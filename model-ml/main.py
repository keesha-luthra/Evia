import os
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader, random_split
import matplotlib.pyplot as plt
import numpy as np
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay
from tqdm import tqdm
import time

# ---------------------------
# 1. Confidence-Aware Loss
# ---------------------------
class ConfidenceAwareLoss(nn.Module):
    def __init__(self, lambda_entropy=0.1):
        super().__init__()
        self.lambda_entropy = lambda_entropy
        self.ce = nn.CrossEntropyLoss()

    def forward(self, outputs, targets):
        ce_loss = self.ce(outputs, targets)
        probs = F.softmax(outputs, dim=1)
        entropy = -torch.sum(probs * torch.log(probs + 1e-8), dim=1).mean()
        return ce_loss + self.lambda_entropy * entropy


# ---------------------------
# 2. Baseline CNN
# ---------------------------
class BaselineCNN(nn.Module):
    def __init__(self, num_classes=11):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(3, 32, 3, 1, 1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            nn.Conv2d(32, 64, 3, 1, 1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            nn.Conv2d(64, 128, 3, 1, 1),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d((7, 7)),
            nn.Flatten(),
            nn.Linear(128 * 7 * 7, 512),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(512, num_classes)
        )

    def forward(self, x):
        return self.net(x)


# ---------------------------
# 3. Hybrid CNN with Gated Fusion
# ---------------------------
class GatedHybridCNN(nn.Module):
    def __init__(self, num_classes=11):
        super().__init__()

        self.spatial_branch = nn.Sequential(
            nn.Conv2d(3, 32, 3, 1, 1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            nn.Conv2d(32, 64, 3, 1, 1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            nn.Conv2d(64, 128, 3, 1, 1),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d((7, 7))
        )

        self.freq_proj = nn.Conv2d(64, 128, kernel_size=1, bias=True)

        self.freq_branch = nn.Sequential(
            nn.Conv2d(3, 32, 3, 1, 1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            nn.Conv2d(32, 64, 3, 1, 1),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d((7, 7))
        )
         self.gate_module = nn.Sequential(
            nn.Conv2d(128 + 128, 64, kernel_size=1),  
            nn.ReLU(inplace=True),
            nn.Conv2d(64, 128, kernel_size=1) 
        )

        self.gate = nn.Sequential(
            nn.Conv2d(128 + 64, 64, 1),
            nn.ReLU(),
            nn.Conv2d(64, 128 + 64, 1),
            nn.Sigmoid()
        )

        self.classifier = nn.Sequential(
            nn.AdaptiveAvgPool2d(1),            
            nn.Flatten(),
            nn.Linear(128, 512),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(512, num_classes)
        )

    def forward(self, x):
        F_s = self.spatial_branch(x)
        fft = torch.fft.fft2(x)
        fft = torch.abs(fft)
        fft = torch.log1p(fft)
        F_f = self.freq_branch(fft)
        F_f = self.freq_proj(F_f)
        F_cat = torch.cat([F_s, F_f], dim=1)
        g_logits = self.gate_module(F_cat)
        g = torch.sigmoid(g_logits) 
        F_fused = g * F_s + (1.0 - g) * F_f
        return self.classifier(F_fused)


# ---------------------------
# 4. Training + Evaluation Loop (with ETA)
# ---------------------------
def train_and_eval(model, criterion, optimizer, train_loader, val_loader, device, epochs=10):
    train_losses, val_losses, train_accs, val_accs = [], [], [], []

    for epoch in range(epochs):
        start_time = time.time()
        model.train()
        total, correct, total_loss = 0, 0, 0

        print(f"\nEpoch {epoch+1}/{epochs}")
        progress = tqdm(train_loader, desc="Training", ncols=100)

        for imgs, labels in progress:
            imgs, labels = imgs.to(device), labels.to(device)
            out = model(imgs)
            loss = criterion(out, labels)

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            total_loss += loss.item() * imgs.size(0)
            preds = out.argmax(1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)
            progress.set_postfix(loss=loss.item())

        train_losses.append(total_loss / total)
        train_accs.append(100 * correct / total)

        model.eval()
        v_loss, v_correct, v_total = 0, 0, 0
        with torch.no_grad():
            for imgs, labels in val_loader:
                imgs, labels = imgs.to(device), labels.to(device)
                out = model(imgs)
                loss = criterion(out, labels)
                v_loss += loss.item() * imgs.size(0)
                preds = out.argmax(1)
                v_correct += (preds == labels).sum().item()
                v_total += labels.size(0)

        val_losses.append(v_loss / v_total)
        val_accs.append(100 * v_correct / v_total)

        epoch_time = time.time() - start_time
        eta = epoch_time * (epochs - (epoch+1))
        print(f"Epoch Time: {epoch_time:.2f}s | ETA Remaining: {eta/60:.2f} min")
        print(f"Train Acc: {train_accs[-1]:.2f}% | Val Acc: {val_accs[-1]:.2f}%")

    return train_losses, val_losses, train_accs, val_accs


# ---------------------------
# 5. Dataset + Setup (EDIT PATH HERE)
# ---------------------------
data_dir = r"C:\Users\hridy\OneDrive\Desktop\iml-proj\archive (2)\IMG_CLASSES"


image_size = 224
transform = transforms.Compose([
    transforms.Resize((image_size, image_size)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

dataset = datasets.ImageFolder(root=data_dir, transform=transform)
train_size = int(0.8 * len(dataset))
val_size = len(dataset) - train_size
train_dataset, val_dataset = random_split(dataset, [train_size, val_size])

train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("CUDA Available:", torch.cuda.is_available())
print("Current Device:", torch.cuda.current_device())
print("Device Name:", torch.cuda.get_device_name(0))

# ---------------------------
# 6. Run Both Models
# ---------------------------
print("\n🧩 Training Baseline CNN...")
baseline = BaselineCNN(num_classes=11).to(device)
criterion_base = nn.CrossEntropyLoss()
optimizer_base = optim.Adam(baseline.parameters(), lr=0.001)
base_hist = train_and_eval(baseline, criterion_base, optimizer_base, train_loader, val_loader, device, epochs=25)

print("\n🚀 Training Hybrid Gated CNN + Confidence Loss...")
hybrid = GatedHybridCNN(num_classes=11).to(device)
criterion_hybrid = ConfidenceAwareLoss(lambda_entropy=0.1)
optimizer_hybrid = optim.Adam(hybrid.parameters(), lr=0.001)
hybrid_hist = train_and_eval(hybrid, criterion_hybrid, optimizer_hybrid, train_loader, val_loader, device, epochs=35)


# ---------------------------
# 7. Visualization
# ---------------------------
def plot_comparison(base_hist, hybrid_hist, label1="Baseline", label2="Hybrid"):
    train_losses, val_losses, train_accs, val_accs = base_hist
    train_losses2, val_losses2, train_accs2, val_accs2 = hybrid_hist

    plt.figure(figsize=(12,5))

    # Loss curves
    plt.subplot(1,2,1)
    plt.plot(train_losses, label=f"{label1} Train")
    plt.plot(val_losses, label=f"{label1} Val")
    plt.plot(train_losses2, label=f"{label2} Train")
    plt.plot(val_losses2, label=f"{label2} Val")
    plt.title("Loss Comparison")
    plt.xlabel("Epoch")
    plt.ylabel("Loss")
    plt.legend()

    # Accuracy curves
    plt.subplot(1,2,2)
    plt.plot(train_accs, label=f"{label1} Train")
    plt.plot(val_accs, label=f"{label1} Val")
    plt.plot(train_accs2, label=f"{label2} Train")
    plt.plot(val_accs2, label=f"{label2} Val")
    plt.title("Accuracy Comparison")
    plt.xlabel("Epoch")
    plt.ylabel("Accuracy (%)")
    plt.legend()

    plt.tight_layout()
    plt.show()

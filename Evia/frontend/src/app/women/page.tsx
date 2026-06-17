"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaCommentMedical, FaVideo, FaUserMd, FaPaperPlane, FaPhone, FaMicrophone, FaMicrophoneSlash, FaVideoSlash, FaCheckCircle } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import { io, Socket } from "socket.io-client";
import Peer, { Instance as PeerInstance } from "simple-peer";
import MinimalNavbar from "@/components/layout/MinimalNavbar";

type ConsultationType = "chat" | "video" | null;

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export default function WomensHealthConsultation() {
  const [consultationType, setConsultationType] = useState<ConsultationType>(null);

  // ----- Chat States -----
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ----- Video Call States -----
  const [socket, setSocket] = useState<Socket | null>(null);
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<PeerInstance | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Auto-scroll chat to bottom when new messages come in
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ----- Chat Handler -----
  const handleChatSubmit = async () => {
    if (!userInput.trim()) return toast.error("Please enter a question.");
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages((prev) => [...prev, { sender: "user", text: userInput, timestamp }]);
    setChatLoading(true);
    const question = userInput;
    setUserInput("");

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/health_chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (res.ok) {
        const aiTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setTimeout(() => {
          setMessages((prev) => [...prev, { sender: "ai", text: data.response, timestamp: aiTimestamp }]);
          setChatLoading(false);
        }, 500); 
      } else {
        toast.error(data.error || "Something went wrong");
        setChatLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to connect to server");
      setChatLoading(false);
    }
  };

  // ----- Video Call Handlers -----
  useEffect(() => {
    if (consultationType === "video") {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const s = io(backendUrl);
      setSocket(s);

      s.on("signal", (data) => {
        if (peerRef.current) {
          peerRef.current.signal(data.signalData);
        }
      });

      s.on("room_joined", (data) => {
        toast.success(data.message);
      });

      return () => {
        s.disconnect();
      };
    }
  }, [consultationType]);

  const joinVideoRoom = async () => {
    if (!room) {
      return toast.error("Please enter a room name");
    }
    setJoined(true);
    socket?.emit("join", { room });
    await startLocalStream();
  };

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      createPeer(stream, true);
    } catch (err) {
      console.error(err);
      toast.error("Could not access camera/microphone");
    }
  };

  const createPeer = (stream: MediaStream, initiator: boolean) => {
    const peer = new Peer({
      initiator,
      trickle: false,
      stream,
    });

    peer.on("signal", (signalData) => {
      socket?.emit("signal", { room, signalData });
    });

    peer.on("stream", (remoteStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });

    peerRef.current = peer;
  };
  
  const toggleMute = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };
  
  const toggleVideo = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };
  
  const handleBackButton = () => {
    setConsultationType(null);
    if (consultationType === "video" && socket) {
      socket.disconnect();
      if (localVideoRef.current?.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  // ----- Render Consultation Section -----
  const renderConsultationSection = () => {
    if (consultationType === "chat") {
      return (
        <div className="bg-brand-100 p-8 rounded-3xl border border-brand-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-[--foreground] flex items-center">
              AI Health Assistant
            </h2>
            <button 
              onClick={handleBackButton}
              className="text-sm font-medium text-[--foreground]/80 hover:text-brand-500 transition-colors"
            >
              Back
            </button>
          </div>
          
          <div className="bg-[--background] border border-brand-200 rounded-2xl h-96 overflow-y-auto mb-6 p-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-100 shadow-sm flex items-center justify-center mb-4 border border-brand-200">
                  <FaCommentMedical className="text-2xl text-brand-500" />
                </div>
                <p className="text-[--foreground] font-medium">Start a secure conversation</p>
                <p className="text-sm mt-1 text-[--foreground]/70">Your health inquiries are kept strictly confidential.</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`mb-6 flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  <div className={`inline-block rounded-2xl px-5 py-3 max-w-[80%] ${
                    msg.sender === "user" ? "bg-brand-400 text-[#4a3b2c] font-medium" : "bg-brand-100 border border-brand-200 text-[--foreground]"
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                  <span className="text-xs text-[--foreground]/60 mt-2 px-1">{msg.timestamp}</span>
                </div>
              ))
            )}
            {chatLoading && (
              <div className="flex items-start">
                <div className="bg-brand-100 border border-brand-200 rounded-2xl px-5 py-4">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 rounded-full bg-brand-500/50 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-brand-500/50 animate-pulse" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-brand-500/50 animate-pulse" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="flex bg-[--background] rounded-full border border-brand-200 overflow-hidden focus-within:ring-2 focus-within:ring-brand-400 focus-within:border-transparent transition-all">
            <input
              className="flex-grow bg-transparent border-none p-4 text-sm text-[--foreground] focus:outline-none"
              placeholder="Type your question..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleChatSubmit()}
            />
            <button
              onClick={handleChatSubmit}
              disabled={chatLoading}
              className="px-6 text-brand-500 hover:brightness-110 transition-colors disabled:opacity-50"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      );
    } else if (consultationType === "video") {
      return (
        <div className="bg-brand-100 p-8 rounded-3xl border border-brand-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-[--foreground]">
              Video Consultation
            </h2>
            <button 
              onClick={handleBackButton}
              className="text-sm font-medium text-[--foreground]/80 hover:text-brand-500 transition-colors"
            >
              Back
            </button>
          </div>
          
          {!joined ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-full max-w-md bg-[--background] p-10 rounded-3xl border border-brand-200 text-center">
                <div className="w-16 h-16 mx-auto bg-brand-100 rounded-2xl shadow-sm flex items-center justify-center mb-6 text-brand-500 border border-brand-200">
                  <FaVideo className="text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-[--foreground] mb-2">Join Virtual Visit</h3>
                <p className="text-[--foreground]/70 mb-8 text-sm">Enter the secure room code provided by your specialist.</p>
                <div className="space-y-4">
                  <input
                    className="w-full bg-brand-100 border border-brand-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400 text-center text-[--foreground] text-sm font-medium"
                    placeholder="Room Code" 
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                  />
                  <button
                    onClick={joinVideoRoom}
                    className="w-full bg-brand-500 text-white py-3.5 px-6 rounded-xl hover:brightness-110 transition-all font-medium text-sm"
                  >
                    Join Securely
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Local Video */}
                <div className="bg-black rounded-2xl overflow-hidden shadow-sm relative aspect-video">
                  <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium">You</div>
                  <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  {isVideoOff && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                      <FaUserMd className="text-brand-500 text-4xl" />
                    </div>
                  )}
                </div>
                
                {/* Remote Video */}
                <div className="bg-black rounded-2xl overflow-hidden shadow-sm relative aspect-video">
                  <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium">Provider</div>
                  <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  {!remoteVideoRef.current?.srcObject && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                      <div className="w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin mb-3"></div>
                      <p className="text-white/80 text-sm font-medium">Waiting for provider...</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex justify-center items-center space-x-6">
                <button onClick={toggleMute} className={`p-4 rounded-full ${isMuted ? 'bg-red-50 text-red-500' : 'bg-brand-200 text-brand-500 hover:brightness-95'} transition-colors`}>
                  {isMuted ? <FaMicrophoneSlash className="text-xl" /> : <FaMicrophone className="text-xl" />}
                </button>
                <button onClick={handleBackButton} className="p-4 rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition-colors">
                  <FaPhone className="rotate-[135deg] text-xl" />
                </button>
                <button onClick={toggleVideo} className={`p-4 rounded-full ${isVideoOff ? 'bg-red-50 text-red-500' : 'bg-brand-200 text-brand-500 hover:brightness-95'} transition-colors`}>
                  {isVideoOff ? <FaVideoSlash className="text-xl" /> : <FaVideo className="text-xl" />}
                </button>
              </div>
            </div>
          )}
        </div>
      );
    } else {
      // Selection Screen - Clean & Clinical
      return (
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <button onClick={() => setConsultationType("chat")} className="text-left group bg-brand-100 p-8 rounded-3xl border border-brand-200 hover:border-brand-400 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-brand-200 flex items-center justify-center mb-6 group-hover:bg-brand-300 transition-colors">
              <FaCommentMedical className="text-xl text-brand-500" />
            </div>
            <h3 className="text-xl font-semibold text-[--foreground] mb-2">AI Health Chatbot</h3>
            <p className="text-[--foreground]/70 text-sm mb-6 leading-relaxed">Instant, confidential answers to common questions about women's dermatological and general health.</p>
            <span className="inline-flex items-center text-sm font-bold text-brand-500 group-hover:brightness-110">
              Start Chat <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
            </span>
          </button>
          
          <button onClick={() => setConsultationType("video")} className="text-left group bg-brand-100 p-8 rounded-3xl border border-brand-200 hover:border-brand-400 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-brand-200 flex items-center justify-center mb-6 group-hover:bg-brand-300 transition-colors">
              <FaVideo className="text-xl text-brand-500" />
            </div>
            <h3 className="text-xl font-semibold text-[--foreground] mb-2">Live Video Visit</h3>
            <p className="text-[--foreground]/70 text-sm mb-6 leading-relaxed">Connect securely face-to-face with a certified healthcare professional using our HIPAA-compliant video system.</p>
            <span className="inline-flex items-center text-sm font-bold text-brand-500 group-hover:brightness-110">
              Join Visit <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
            </span>
          </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[--background] font-sans text-[--foreground]">
      <MinimalNavbar />
      <Toaster position="top-center" toastOptions={{
        className: 'text-sm font-medium text-[--foreground] bg-brand-100 rounded-xl shadow-sm border border-brand-200',
      }} />
      
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-200 text-[#4a3b2c] text-xs font-bold uppercase tracking-wider mb-4">
            <FaCheckCircle className="text-brand-500" /> Integrated Care
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-[--foreground] mb-4">
            Women's Health
          </h1>
          <p className="text-[--foreground]/70 text-lg">
            A dedicated, private space for personalized women's healthcare and dermatological support.
          </p>
        </div>
        
        {renderConsultationSection()}
      </div>
    </div>
  );
}
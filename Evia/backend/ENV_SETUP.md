# Environment Variables Setup for Backend (Flask/Python)

Create a `.env` file in the `Evia/backend/` directory with the following variables:

```env
# ============================================
# BACKEND - Flask/Python Environment Variables
# ============================================

# Google Gemini API Key (Required)
# Get from: https://makersuite.google.com/app/apikey
# or: https://aistudio.google.com/app/apikey
GOOGLE_API_KEY=your_google_gemini_api_key_here

# Google Maps API Key (Required for clinic search)
# Get from: https://console.cloud.google.com/apis/credentials
# Make sure to enable: Places API, Geocoding API, Maps JavaScript API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Flask Secret Key (Required for session management)
# Generate a random secret: python -c "import secrets; print(secrets.token_hex(32))"
# Or: openssl rand -hex 32
SECRET_KEY=your_flask_secret_key_here

# Server Port (Optional - defaults to 5000)
# For production deployment on Render/Heroku, this is usually set automatically
PORT=5000
```

## Required Variables:

1. **GOOGLE_API_KEY** - Google Gemini API key for AI-powered skin disease analysis and treatment recommendations
2. **GOOGLE_MAPS_API_KEY** - Google Maps API key for finding nearby clinics and hospitals
3. **SECRET_KEY** - Flask secret key for session encryption and security

## Optional Variables:

1. **PORT** - Server port (defaults to 5000 if not set). For cloud deployments (Render, Heroku), this is usually set automatically by the platform.

## How to Get API Keys:

1. **Google Gemini API Key**:
   - Go to https://aistudio.google.com/app/apikey
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated key

2. **Google Maps API Key**:
   - Go to https://console.cloud.google.com/
   - Create a project (or use existing)
   - Enable these APIs:
     - Places API
     - Geocoding API
     - Maps JavaScript API
   - Go to "Credentials" → "Create Credentials" → "API Key"
   - Copy the generated key
   - (Optional) Restrict the key to specific APIs for security

3. **Flask Secret Key**:
   - Run in terminal: `python -c "import secrets; print(secrets.token_hex(32))"`
   - Or: `openssl rand -hex 32`
   - Copy the generated string

## Example .env file:

```env
GOOGLE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
GOOGLE_MAPS_API_KEY=AIzaSyYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
SECRET_KEY=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
PORT=5000
```

## Notes:

- Never commit `.env` to version control (it should be in `.gitignore`)
- The `.env` file is automatically loaded by `python-dotenv` (already in requirements.txt)
- For production deployment, set these as environment variables in your hosting platform
- If `GOOGLE_API_KEY` is missing, the app will raise a ValueError on startup
- The Flask app uses CORS to allow requests from `http://localhost:3000` (Next.js frontend)

## Production Deployment:

When deploying to platforms like Render, Heroku, or Railway:
1. Set environment variables in the platform's dashboard
2. The `PORT` variable is usually set automatically by the platform
3. Make sure to update CORS settings in `app.py` to allow your frontend domain



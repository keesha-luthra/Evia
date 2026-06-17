# Environment Variables Setup for Evia (Next.js Frontend)

Create a `.env.local` file in the `Evia/frontend/` directory with the following variables:

```env
# ============================================
# ADERMIS - Next.js Frontend Environment Variables
# ============================================

# MongoDB Database Connection
# Format: mongodb://username:password@host:port/database
# Or: mongodb+srv://username:password@cluster.mongodb.net/database
MONGODB_URI=your_mongodb_connection_string_here

# NextAuth.js Configuration
# Generate a random secret: openssl rand -base64 32
# Or in Node.js: require('crypto').randomBytes(32).toString('base64')
NEXTAUTH_SECRET=your_nextauth_secret_here

# Google Maps API Key (Public - exposed to client)
# Get from: https://console.cloud.google.com/apis/credentials
# Enable: Maps JavaScript API, Places API, Geocoding API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Backend API URL (Public - exposed to client)
# For development: http://localhost:5000
# For production: https://your-backend-domain.com
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Node Environment (usually set automatically)
# Options: development, production, test
NODE_ENV=development

# Optional: Database URL (if used separately from MONGODB_URI)
# DATABASE_URL=your_database_url_here
```

## Required Variables:

1. **MONGODB_URI** - MongoDB connection string for user authentication and data storage
2. **NEXTAUTH_SECRET** - Secret key for NextAuth.js session encryption
3. **NEXT_PUBLIC_GOOGLE_MAPS_API_KEY** - Google Maps API key for clinic location features
4. **NEXT_PUBLIC_BACKEND_URL** - URL of your Flask backend API

## How to Get API Keys:

1. **MongoDB URI**: 
   - Sign up at https://www.mongodb.com/cloud/atlas
   - Create a cluster and get your connection string

2. **NextAuth Secret**:
   - Run: `openssl rand -base64 32`
   - Or use: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

3. **Google Maps API Key**:
   - Go to https://console.cloud.google.com/
   - Create a project and enable: Maps JavaScript API, Places API, Geocoding API
   - Create credentials (API Key)

4. **Backend URL**:
   - Development: `http://localhost:5000`
   - Production: Your deployed backend URL

## Notes:

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser (client-side)
- Variables without `NEXT_PUBLIC_` are server-side only
- Never commit `.env.local` to version control
- Use `.env.local` for local development
- Use `.env.production` for production builds



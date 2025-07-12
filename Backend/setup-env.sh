#!/bin/bash

echo "Setting up environment variables for DevBond Backend..."
echo ""

# Check if .env file already exists
if [ -f ".env" ]; then
    echo "Warning: .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

echo "Creating .env file..."
echo ""

# Create .env file with template
cat > .env << 'EOF'
# Server Configuration
PORT=4001
CORS_ORIGIN=http://localhost:5173

# Database Configuration
MONGOOSE_URL=mongodb+srv://your_username:your_password@cluster0.cnyna.mongodb.net
DB_NAME=your_database_name

# JWT Token Configuration
ACCESS_TOKEN_SECRET=your_access_token_secret_key_here
ACCESS_TOKEN_EXPIRE=1d
REFRESH_TOKEN_SECREAT=your_refresh_token_secret_key_here
REFRESH_TOKEN_EXPIRE=7d

# Redis/Aiven Configuration
AIVEN_HOST=your_aiven_redis_host
AIVEN_PORT=your_aiven_redis_port
AIVEN_USERNAME=your_aiven_redis_username
AIVEN_PASSWORD=your_aiven_redis_password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_CLOUD_APIKEY=your_cloudinary_api_key
CLOUDINARY_CLOUD_APIKEY_SECREATE=your_cloudinary_api_secret

# Mistral AI Configuration
MISTRAL_API_KEY=your_mistral_api_key_here
MISTRAL_MODEL=mistral-medium
EOF

echo "✅ .env file created successfully!"
echo ""
echo "⚠️  IMPORTANT: Please update the .env file with your actual values:"
echo "   - Replace MongoDB connection string with your actual database URL"
echo "   - Set your JWT secret keys"
echo "   - Configure your Aiven Redis credentials"
echo "   - Add your Cloudinary credentials"
echo "   - Add your Mistral AI API key"
echo ""
echo "After updating the .env file, restart your server." 
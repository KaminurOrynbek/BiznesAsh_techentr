#!/bin/bash
# BiznesAsh Frontend Setup Script

echo "Installing BiznesAsh Frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Dependencies installed successfully!"
  echo ""
  echo "To start the development server, run:"
  echo "  npm run dev"
  echo ""
  echo "The app will be available at http://localhost:5173"
  echo ""
  echo "Make sure your backend API Gateway is running on http://localhost:3000"
else
  echo "❌ Installation failed. Please check the error messages above."
  exit 1
fi

# Exit on error
$ErrorActionPreference = "Stop"

Write-Host "📦 Installing dependencies..."
npm ci

Write-Host "🔨 Building storm..."
npm run build

Write-Host "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting:stormai

Write-Host "✅ Build and deployment successful!"
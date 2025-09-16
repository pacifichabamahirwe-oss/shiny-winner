# Deployment Guide - Meet a Rwandan Local

This guide covers deployment options for the Meet a Rwandan Local application.

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud)
- Expo CLI for mobile development

### 1. Clone and Setup
```bash
git clone <repository-url>
cd meet-a-rwandan-local
npm run install:all
```

### 2. Environment Configuration
```bash
# Backend environment
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration
```

### 3. Start Development Servers
```bash
# Start both backend and mobile app
npm run dev

# Or start individually
npm run dev:backend  # Backend API
npm run dev:mobile   # Mobile app
```

## 🐳 Docker Deployment

### Development with Docker
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### Production Docker Setup
```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up -d

# Scale backend instances
docker-compose up -d --scale backend=3
```

## ☁️ Cloud Deployment

### 1. Backend Deployment (Node.js API)

#### Heroku Deployment
```bash
# Install Heroku CLI and login
heroku login

# Create app
heroku create meet-rwandan-local-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=<your-mongodb-connection-string>
heroku config:set JWT_SECRET=<your-jwt-secret>

# Deploy
cd backend
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a meet-rwandan-local-api
git push heroku main
```

#### AWS ECS Deployment
```bash
# Build and push Docker image
docker build -t meet-rwandan-backend ./backend
docker tag meet-rwandan-backend:latest <aws-account-id>.dkr.ecr.<region>.amazonaws.com/meet-rwandan-backend:latest
docker push <aws-account-id>.dkr.ecr.<region>.amazonaws.com/meet-rwandan-backend:latest

# Deploy using ECS task definition
aws ecs update-service --cluster <cluster-name> --service <service-name> --force-new-deployment
```

#### Google Cloud Run
```bash
# Build and deploy
cd backend
gcloud builds submit --tag gcr.io/<project-id>/meet-rwandan-backend
gcloud run deploy meet-rwandan-backend \
  --image gcr.io/<project-id>/meet-rwandan-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### 2. Database Setup

#### MongoDB Atlas (Recommended)
1. Create cluster at https://cloud.mongodb.com
2. Configure network access (whitelist IPs)
3. Create database user
4. Get connection string
5. Update `MONGODB_URI` in environment variables

#### Self-hosted MongoDB
```bash
# Ubuntu/Debian installation
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 3. Mobile App Deployment

#### Expo Application Services (EAS)
```bash
cd MeetARwandanLocal

# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for production
eas build --platform all

# Submit to app stores
eas submit --platform all
```

#### Manual Build Process
```bash
# iOS (requires macOS and Xcode)
cd MeetARwandanLocal
expo run:ios --configuration Release

# Android
expo run:android --variant release
```

## 🔧 Environment Configuration

### Backend Environment Variables
```env
# Server
NODE_ENV=production
PORT=3000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/meet-rwandan-local

# Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=7d

# CORS
CLIENT_URL=https://meetarwandanlocal.com

# File Upload
MAX_FILE_SIZE=10mb
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Payment Integration
MTN_MOMO_API_URL=https://sandbox.momodeveloper.mtn.com
MTN_MOMO_SUBSCRIPTION_KEY=your-subscription-key
MTN_MOMO_API_USER=your-api-user
MTN_MOMO_API_KEY=your-api-key

AIRTEL_MONEY_API_URL=https://openapiuat.airtel.africa
AIRTEL_MONEY_CLIENT_ID=your-client-id
AIRTEL_MONEY_CLIENT_SECRET=your-client-secret

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=noreply@meetarwandanlocal.com
EMAIL_PASS=your-app-password

# SMS
SMS_API_KEY=your-sms-api-key
SMS_SENDER_ID=MeetRwanda
```

### Mobile App Configuration
Update `src/constants/index.ts`:
```typescript
export const API_BASE_URL = 'https://your-api-domain.com/api';
export const SOCKET_URL = 'https://your-api-domain.com';
```

## 📱 App Store Deployment

### iOS App Store
1. **Prepare for submission**
   - Update version in `app.json`
   - Ensure all required metadata is complete
   - Test on physical devices

2. **Build and submit**
   ```bash
   eas build --platform ios
   eas submit --platform ios
   ```

3. **App Store Connect**
   - Complete app metadata
   - Upload screenshots
   - Set pricing and availability
   - Submit for review

### Google Play Store
1. **Prepare for submission**
   - Update version code and name
   - Generate signed APK/AAB
   - Prepare store listing

2. **Build and submit**
   ```bash
   eas build --platform android
   eas submit --platform android
   ```

3. **Google Play Console**
   - Complete store listing
   - Upload screenshots and graphics
   - Set content rating
   - Publish to production

## 🔐 Security Considerations

### SSL/TLS Configuration
```bash
# Let's Encrypt with Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.meetarwandanlocal.com
```

### Firewall Setup
```bash
# UFW configuration
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### Environment Security
- Use secrets management (AWS Secrets Manager, Azure Key Vault)
- Rotate API keys regularly
- Implement proper CORS policies
- Enable rate limiting
- Use HTTPS everywhere

## 📊 Monitoring & Analytics

### Application Monitoring
```bash
# PM2 for Node.js process management
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Health Checks
```bash
# Backend health endpoint
curl https://api.meetarwandanlocal.com/health

# Database connection check
curl https://api.meetarwandanlocal.com/health/db
```

### Logging Setup
```javascript
// Winston logger configuration
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    - name: Install dependencies
      run: cd backend && npm ci
    - name: Run tests
      run: cd backend && npm test
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{secrets.HEROKU_API_KEY}}
        heroku_app_name: "meet-rwandan-local-api"
        heroku_email: "your-email@example.com"
```

## 📞 Support & Troubleshooting

### Common Issues

1. **MongoDB Connection Issues**
   - Check connection string format
   - Verify network access in MongoDB Atlas
   - Ensure correct authentication credentials

2. **Mobile App Build Failures**
   - Clear Expo cache: `expo r -c`
   - Check for version conflicts in dependencies
   - Verify Expo SDK compatibility

3. **Payment Integration Issues**
   - Verify API credentials
   - Check sandbox vs production endpoints
   - Review webhook configurations

### Getting Help
- Create issues in the GitHub repository
- Check documentation at https://docs.meetarwandanlocal.com
- Contact support: support@meetarwandanlocal.com

---

For detailed technical documentation, visit our [Developer Portal](https://developers.meetarwandanlocal.com).
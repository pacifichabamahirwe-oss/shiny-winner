# Meet a Rwandan Local

A mobile application that connects international and domestic tourists with local Rwandans who offer authentic cultural experiences such as cooking, village tours, craft workshops, storytelling, and traditional dance.

## Features

### Core Features
- **User Profiles**: Tourists and locals can create detailed profiles with preferences and interests
- **Activity Listings & Search**: Browse and search for activities with advanced filters
- **Booking System**: Calendar integration with instant booking and confirmation
- **Payments & Security**: Mobile Money (MTN, Airtel) and card payment integration
- **Messaging & Reviews**: In-app chat and rating system
- **Multi-language Support**: English and Kinyarwanda (expandable to French and Swahili)
- **Verification & Safety**: Host ID verification and safety guidelines
- **Admin Dashboard**: Complete management system for users, activities, and analytics

### Design
- Rwanda-inspired design with Imigongo art colors
- Simple, user-friendly interface optimized for Android and iOS
- Modern UI/UX following best practices

## Technology Stack

- **Framework**: React Native 0.72.6
- **Navigation**: React Navigation 6
- **State Management**: React Context API
- **UI Components**: React Native Elements, React Native Paper
- **Icons**: React Native Vector Icons
- **Charts**: React Native Super Grid
- **Calendar**: React Native Calendars
- **Maps**: React Native Maps
- **Payments**: React Native Payments
- **Localization**: React Native Localize, React Native i18n

## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (>= 16)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Java Development Kit (JDK 11 or higher)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd meet-rwandan-local
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup** (macOS only)
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Android Setup**
   - Open Android Studio
   - Install Android SDK and build tools
   - Set up Android emulator or connect a physical device

## Running the Application

### Development Mode

1. **Start Metro bundler**
   ```bash
   npm start
   ```

2. **Run on Android**
   ```bash
   npm run android
   ```

3. **Run on iOS** (macOS only)
   ```bash
   npm run ios
   ```

### Production Build

1. **Android APK**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

2. **iOS Archive** (macOS only)
   - Open `ios/MeetRwandanLocal.xcworkspace` in Xcode
   - Select "Generic iOS Device" as target
   - Product → Archive

## Project Structure

```
src/
├── context/           # React Context providers
│   ├── AuthContext.js
│   └── LanguageContext.js
├── screens/           # Application screens
│   ├── HomeScreen.js
│   ├── SearchScreen.js
│   ├── BookingScreen.js
│   ├── MessagesScreen.js
│   ├── ProfileScreen.js
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── ActivityDetailScreen.js
│   ├── HostProfileScreen.js
│   ├── CreateActivityScreen.js
│   └── AdminDashboardScreen.js
└── components/        # Reusable components (to be added)
```

## Key Features Implementation

### Authentication
- User registration and login
- Role-based access (Tourist, Host, Admin)
- Profile management

### Activity Management
- Create and manage activities
- Image upload and gallery
- Calendar integration for availability
- Pricing and group size management

### Booking System
- Real-time availability checking
- Instant booking and confirmation
- Booking history and management
- Cancellation handling

### Messaging System
- Real-time chat between users and hosts
- Message history
- Online/offline status

### Payment Integration
- Mobile Money (MTN, Airtel)
- Card payments
- Secure transaction handling
- Receipt generation

### Multi-language Support
- English and Kinyarwanda
- Expandable to French and Swahili
- Context-based translations

### Admin Features
- User management
- Activity approval system
- Analytics dashboard
- Revenue tracking

## Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
API_BASE_URL=https://your-api-url.com
PAYMENT_GATEWAY_KEY=your-payment-key
MAPS_API_KEY=your-maps-api-key
```

### API Integration
The app is designed to work with a backend API. Update the API endpoints in the respective screen files to connect to your backend.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@meetrwandanlocal.com or join our Slack channel.

## Acknowledgments

- Rwanda Development Board for tourism insights
- Local communities for cultural guidance
- React Native community for excellent documentation
- Contributors and beta testers

## Roadmap

### Phase 1 (Current)
- [x] Basic app structure
- [x] User authentication
- [x] Activity browsing and search
- [x] Booking system
- [x] Messaging system
- [x] Multi-language support

### Phase 2 (Next)
- [ ] Payment integration
- [ ] Push notifications
- [ ] Offline support
- [ ] Advanced analytics
- [ ] Social features

### Phase 3 (Future)
- [ ] AI-powered recommendations
- [ ] Virtual reality experiences
- [ ] Blockchain integration
- [ ] Advanced safety features
- [ ] Community features

---

**Meet a Rwandan Local** - Connecting the world with authentic Rwandan experiences.
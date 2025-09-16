# Meet a Rwandan Local

A mobile application that connects international and domestic tourists with local Rwandans who offer authentic cultural experiences such as cooking, village tours, craft workshops, storytelling, and traditional dance.

## Features

### Core Features
- **User Profiles**: Tourists and locals can create detailed profiles with preferences and verification
- **Activity Listings**: Browse and search for cultural activities with advanced filtering
- **Booking System**: Calendar integration for availability and instant booking
- **Payments**: Integration with Mobile Money (MTN, Airtel) and card payments
- **Messaging**: In-app chat between tourists and hosts
- **Reviews & Ratings**: Comprehensive review system for experiences
- **Multi-language Support**: English and Kinyarwanda (expandable to French and Swahili)
- **Verification & Safety**: Host ID verification and safety guidelines
- **Admin Dashboard**: Complete management system for users, activities, and analytics

### Design
- Rwanda-inspired color palette based on Imigongo art
- Clean, user-friendly interface optimized for both Android and iOS
- Cultural imagery and traditional Rwandan design elements

## Technology Stack

- **React Native**: Cross-platform mobile development
- **React Navigation**: Navigation system with tab and stack navigators
- **React Native Paper**: Material Design components
- **React Native Vector Icons**: Icon library
- **React Native Calendars**: Calendar integration for bookings
- **React Native Async Storage**: Local data persistence
- **i18next**: Internationalization support
- **React Native Flash Message**: Toast notifications

## Installation

### Prerequisites
- Node.js (>= 16)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Setup

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
   cd ios && pod install && cd ..
   ```

4. **Run the application**
   
   For Android:
   ```bash
   npm run android
   ```
   
   For iOS:
   ```bash
   npm run ios
   ```

## Project Structure

```
src/
├── screens/           # All screen components
│   ├── HomeScreen.js
│   ├── ExploreScreen.js
│   ├── BookingScreen.js
│   ├── MessagesScreen.js
│   ├── ProfileScreen.js
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── ActivityDetailScreen.js
│   ├── HostProfileScreen.js
│   ├── CreateActivityScreen.js
│   └── AdminDashboardScreen.js
├── styles/            # Theme and styling
│   └── theme.js
└── i18n/             # Internationalization
    ├── i18n.js
    └── locales/
        ├── en.json
        └── rw.json
```

## Demo Accounts

The app includes demo accounts for testing:

- **Tourist**: tourist@demo.com / password123
- **Host**: host@demo.com / password123
- **Admin**: admin@demo.com / password123

## Key Features Implementation

### 1. User Authentication
- Login/Register screens with user type selection
- Form validation and error handling
- Demo account functionality

### 2. Activity Management
- Browse activities with search and filtering
- Detailed activity pages with booking functionality
- Host profile pages with reviews and statistics

### 3. Booking System
- Calendar integration for date selection
- Time slot selection
- Guest count management
- Booking confirmation and management

### 4. Messaging System
- Real-time chat interface
- Conversation management
- Message status indicators

### 5. Multi-language Support
- English and Kinyarwanda translations
- Language switching functionality
- Localized content throughout the app

### 6. Admin Dashboard
- User management
- Activity moderation
- Verification system
- Analytics and reporting

## Rwanda-Inspired Design

The app features a color palette inspired by Rwanda's flag and traditional Imigongo art:
- **Primary Green**: #00A651 (Rwanda flag green)
- **Secondary Yellow**: #FCD116 (Rwanda flag yellow)
- **Accent Red**: #E31E24 (Rwanda flag red)
- **Cultural Elements**: Traditional patterns and imagery

## Target Users

- **International Tourists** (25-45 years old, seeking cultural immersion)
- **Domestic Travelers** (young professionals, families, school groups)
- **Local Rwandans** (urban and rural areas who want to host experiences)

## Expected Outcomes

- Empower local communities with income opportunities
- Extend average tourist stay in Rwanda
- Promote cultural heritage preservation
- Support Rwanda's Vision 2050 tourism goals

## Development Notes

- The app is built with React Native for cross-platform compatibility
- All screens are fully functional with mock data
- The design follows Rwanda's cultural aesthetics
- Multi-language support is implemented for English and Kinyarwanda
- Admin functionality is included for platform management

## Future Enhancements

- Real-time notifications
- Offline functionality
- Advanced analytics
- Payment gateway integration
- Social media integration
- Enhanced safety features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
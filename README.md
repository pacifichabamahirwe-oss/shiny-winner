# Meet a Rwandan Local 🇷🇼

A mobile application that connects international and domestic tourists with local Rwandans who offer authentic cultural experiences such as cooking, village tours, craft workshops, storytelling, and traditional dance.

## 🎯 Purpose

The app promotes community-based tourism, increases cultural exchange, and provides safe digital transactions while empowering local communities with income opportunities and supporting Rwanda's Vision 2050 tourism goals.

## ✨ Core Features

### 1. User Profiles
- **Tourists**: Create profiles with preferences (interests, language, budget)
- **Locals**: Create host profiles showcasing activities, descriptions, availability, pricing, and photos

### 2. Activity Listings & Search
- Browse and search activities (cooking, crafts, village walks, etc.)
- Advanced filters: location, experience type, price, language, difficulty level
- Category-based exploration with Rwanda-inspired design

### 3. Booking System
- Calendar integration for hosts to set availability
- Instant or request-based booking options
- Confirmation notifications for both parties
- Booking management and status tracking

### 4. Payments & Security
- Integration with Mobile Money (MTN, Airtel)
- Credit/debit card payment options
- Secure payment system with digital receipts
- Deposit and cancellation policy management

### 5. Messaging & Reviews
- In-app real-time chat between tourists and hosts
- Comprehensive rating system (5 categories + overall)
- Photo reviews and host responses
- Community-driven helpful voting system

### 6. Multi-language Support
- English and Kinyarwanda (primary)
- French and Swahili support
- Localized content and cultural context

### 7. Verification & Safety
- Host ID verification with manual approval process
- Tourist safety guidelines and educational content
- Host training modules and certification
- Community reporting and moderation system

### 8. Admin Dashboard
- User and listing management
- Payment and dispute resolution
- Analytics and business intelligence
- Content moderation tools

## 🏗️ Technical Architecture

### Backend (Node.js/Express/TypeScript)
```
/backend
├── src/
│   ├── models/          # MongoDB/Mongoose models
│   ├── routes/          # API endpoints
│   ├── middleware/      # Authentication, validation, error handling
│   ├── controllers/     # Business logic
│   ├── utils/           # Helper functions and utilities
│   └── types/           # TypeScript type definitions
├── package.json
└── tsconfig.json
```

**Key Technologies:**
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt hashing
- **Real-time**: Socket.IO for messaging
- **Validation**: Express-validator
- **File Upload**: Multer with cloud storage integration
- **Payment Integration**: MTN MoMo, Airtel Money APIs

### Frontend (React Native/Expo/TypeScript)
```
/MeetARwandanLocal
├── src/
│   ├── components/      # Reusable UI components
│   ├── screens/         # App screens organized by feature
│   ├── navigation/      # Navigation configuration
│   ├── services/        # API calls and external services
│   ├── store/           # State management (Zustand)
│   ├── types/           # TypeScript interfaces
│   ├── constants/       # App constants and configuration
│   ├── utils/           # Helper functions
│   └── hooks/           # Custom React hooks
├── assets/              # Images, icons, fonts
└── App.tsx
```

**Key Technologies:**
- **Framework**: React Native with Expo
- **Navigation**: React Navigation v6
- **State Management**: Zustand with persistence
- **UI Components**: React Native Paper + custom components
- **Real-time**: Socket.IO client
- **Maps**: React Native Maps
- **Calendar**: React Native Calendars
- **Internationalization**: i18next

## 🎨 Design System

### Rwanda Cultural Inspiration
- **Colors**: Inspired by Rwanda's flag and Imigongo traditional art
  - Primary Blue: `#00A1DE` (Rwanda flag blue)
  - Secondary Yellow: `#FFCC00` (Rwanda flag yellow)
  - Accent Green: `#009639` (Rwanda flag green)
  - Earth tones from traditional Imigongo art

### Typography & Layout
- Clean, accessible typography
- Generous white space for readability
- Cultural iconography and imagery
- Mobile-first responsive design

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Expo CLI
- iOS Simulator or Android Emulator

### Backend Setup

1. **Clone and setup backend**
```bash
cd backend
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start the backend server**
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Frontend Setup

1. **Setup mobile app**
```bash
cd MeetARwandanLocal
npm install
```

2. **Start the development server**
```bash
npm start
```

3. **Run on device/simulator**
```bash
# iOS
npm run ios

# Android
npm run android

# Web (for development)
npm run web
```

## 📱 Target Users

### International Tourists (25-45 years)
- Seeking authentic cultural immersion
- Value unique, local experiences
- Comfortable with mobile technology
- Budget-conscious but willing to pay for quality

### Domestic Travelers
- Young professionals and families
- School groups and educational institutions
- Weekend explorers from urban areas
- Cultural enthusiasts

### Local Rwandan Hosts
- Urban and rural community members
- Skilled in traditional crafts, cooking, or cultural practices
- Looking for supplemental income opportunities
- Passionate about sharing their heritage

## 🌍 Expected Impact

### Economic Empowerment
- Direct income generation for local communities
- Support for traditional crafts and skills
- Reduced urban migration through rural opportunities
- Women's economic participation enhancement

### Cultural Preservation
- Documentation and transmission of traditional knowledge
- Intergenerational skill sharing
- Cultural pride and identity strengthening
- International appreciation of Rwandan heritage

### Tourism Development
- Extended average tourist stay duration
- Diversified tourism offerings beyond wildlife
- Community-based tourism model
- Alignment with Rwanda's Vision 2050 goals

## 🔐 Security & Privacy

### Data Protection
- GDPR-compliant data handling
- Encrypted data transmission and storage
- Secure payment processing
- User consent management

### Safety Features
- Host verification process
- Tourist safety guidelines
- Emergency contact systems
- Community reporting mechanisms
- Insurance integration options

## 📊 Business Model

### Revenue Streams
- Commission on completed bookings (5-10%)
- Premium host features and promotion
- Payment processing fees
- Advertising from tourism partners
- Training and certification programs

### Sustainability
- Reinvestment in community development
- Host training and capacity building
- Technology infrastructure improvement
- Marketing and user acquisition

## 🛣️ Roadmap

### Phase 1: MVP (Current)
- ✅ Core user registration and profiles
- ✅ Basic activity listings and search
- ✅ Fundamental booking system
- ✅ Mobile Money integration
- ✅ Basic messaging system

### Phase 2: Enhanced Features
- [ ] Advanced search and AI recommendations
- [ ] Video calls for virtual experiences
- [ ] Group booking capabilities
- [ ] Loyalty and rewards program
- [ ] Offline functionality

### Phase 3: Ecosystem Expansion
- [ ] Integration with tourism boards
- [ ] Corporate and educational partnerships
- [ ] Multi-country expansion model
- [ ] Advanced analytics and insights
- [ ] Sustainability tracking and reporting

## 🤝 Contributing

We welcome contributions from developers, designers, and cultural experts. Please read our contributing guidelines and code of conduct.

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Maintain documentation
- Respect cultural sensitivity
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Rwanda Development Board for tourism insights
- Local communities for cultural guidance
- Technology partners for payment integration
- Beta testers and early adopters

## 📞 Contact

- **Email**: support@meetarwandanlocal.com
- **Website**: https://meetarwandanlocal.com
- **Social Media**: @MeetRwandanLocal

---

**Built with ❤️ for Rwanda's cultural heritage and community empowerment**
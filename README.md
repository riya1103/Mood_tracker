# 🎯 Mood Tracker App

A comprehensive mobile mood tracking application that helps users log their moods, identify patterns, and receive personalized recommendations for mental health improvement.

## 📱 Features

### Core Features
- **Mood Logging**: Daily mood tracking with intensity levels (1-10)
- **Detailed Context**: Log activities, triggers, sleep hours, exercise, and social interaction
- **Data Visualization**: Charts showing 30-day mood trends
- **Pattern Analysis**: Identify mood patterns and correlations
- **AI Recommendations**: Personalized suggestions based on mood data
- **Mood Statistics**: Visual representation of mood distribution and key metrics

### Technical Features
- **Authentication**: Secure user registration and login with JWT
- **Data Security**: Encrypted password storage with bcryptjs
- **Real-time Sync**: Cloud synchronization across devices
- **Offline Support**: (Planned) Local data caching
- **Cross-platform**: iOS, Android, and Web support

## 🛠️ Tech Stack

### Frontend
- **React Native** with **Expo** - Cross-platform mobile development
- **React Navigation** - Tab and stack navigation
- **Axios** - HTTP client for API calls
- **React Native Chart Kit** - Data visualization
- **AsyncStorage** - Local data persistence

### Backend
- **Express.js** - REST API framework
- **MongoDB** - Document database
- **Mongoose** - MongoDB ODM
- **JWT** - Secure authentication
- **Bcryptjs** - Password hashing

## 📋 Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- MongoDB instance (local or Atlas)
- Expo CLI: `npm install -g expo-cli`

## 🚀 Installation & Setup

### 1. Clone and Setup

```bash
cd mood-tracker-app
npm install
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Update MongoDB URI in .env if needed
# MongoDB local: mongodb://localhost:27017/mood-tracker
# MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/mood-tracker

# Start the backend server
npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# For local backend, update API URL in services/api.js:
# const API_URL = 'http://YOUR_LOCAL_IP:5000/api'
# (Use your machine's local IP, not localhost, for Android)

# Start Expo
npm run dev
```

### 4. Running the App

#### iOS
```bash
npm run ios
```

#### Android
```bash
npm run android
```

#### Web
```bash
npm run web
```

#### Using Expo Client
1. Download Expo Go from App Store or Google Play
2. Scan the QR code shown in terminal after `npm run dev`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Mood Entries
- `POST /api/mood/log` - Log a new mood entry
- `GET /api/mood/entries` - Get user's mood entries
- `GET /api/mood/entry/:id` - Get specific mood entry
- `PUT /api/mood/entry/:id` - Update mood entry
- `DELETE /api/mood/entry/:id` - Delete mood entry

### Insights
- `GET /api/insights/patterns` - Get mood patterns and statistics
- `GET /api/insights/recommendations` - Get personalized recommendations
- `GET /api/insights/chart-data` - Get data for chart visualization

## 💾 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed)
}
```

### Mood Model
```javascript
{
  userId: ObjectId,
  mood: String (terrible|bad|neutral|good|excellent),
  intensity: Number (1-10),
  activities: [String],
  notes: String,
  triggers: [String],
  sleepHours: Number,
  exerciseMinutes: Number,
  socialInteraction: String (none|minimal|moderate|extensive),
  date: Date
}
```

## 🔍 How Insights Work

### Pattern Analysis
- Calculates average mood intensity
- Tracks mood distribution over time
- Identifies trends (improving/declining/stable)
- Correlates activities with positive moods

### Recommendation Engine
- **Sleep Analysis**: Recommends 7-9 hours per night
- **Exercise**: Suggests regular physical activity if sedentary
- **Trigger Management**: Identifies top triggers for mood swings
- **Mood Trend**: Alerts when mood is declining
- **Social Connection**: Encourages interaction if isolated
- **Positive Reinforcement**: Highlights activities that boost mood

## 📱 Screenshots & Navigation

### App Structure
```
├── Home Screen
│   ├── 30-day mood trend chart
│   ├── Mood statistics & patterns
│   └── Recommendations
├── Log Mood Screen
│   ├── Mood selection (5 options)
│   ├── Intensity slider
│   ├── Activities & triggers
│   └── Sleep, exercise, social data
├── Insights Screen
│   ├── Period selector (7/30/90 days)
│   ├── Mood distribution chart
│   ├── Key metrics
│   ├── Top activities & triggers
│   └── Trend analysis
└── Profile Screen
    ├── User info
    ├── Settings
    ├── Stats overview
    └── Logout
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- User data isolation (users only see their own data)
- CORS protection
- Input validation
- Secure token storage in AsyncStorage

## 🐛 Troubleshooting

### Backend not connecting
- Ensure MongoDB is running: `mongod`
- Check Port 5000 is available
- Verify MONGODB_URI in .env

### Frontend not connecting to backend
- Update API URL in `frontend/services/api.js`
- Use local IP instead of localhost for Android
- Check backend is running: `npm run dev` in backend folder

### Expo app not loading
- Clear Expo cache: `expo start --clear`
- Check Node modules: Delete and reinstall
- Verify all dependencies: `npm install`

## 📝 Sample Mood Entry

```json
{
  "mood": "good",
  "intensity": 7,
  "activities": ["Exercise", "Social", "Reading"],
  "notes": "Had a great day at the gym and met up with friends",
  "triggers": [],
  "sleepHours": 8,
  "exerciseMinutes": 45,
  "socialInteraction": "extensive",
  "date": "2026-02-28"
}
```

## 🎯 Future Enhancements

- [ ] Push notifications for daily logging reminders
- [ ] Social features (share wins with friends)
- [ ] Integration with wearables (Apple Watch, Fitbit)
- [ ] Voice-based mood recording
- [ ] Dark mode support
- [ ] Meditation & breathing exercise guides
- [ ] Export mood data as PDF/CSV
- [ ] Integration with mental health professionals
- [ ] Machine learning for better recommendations
- [ ] Multi-language support

## 📄 License

This project is open source and available under the MIT License.

## 💬 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🤝 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Made with ❤️ for better mental health tracking**

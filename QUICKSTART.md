# ⚡ Quick Start Guide

## 5-Minute Setup

### Prerequisites
- Node.js installed
- MongoDB running locally (`brew services start mongodb-community` on Mac)
- Terminal/Command prompt

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Backend
```bash
cd backend
npm install
npm run dev
# Backend starts on http://localhost:5000
```

### Step 3: Setup Frontend (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```

### Step 4: Connect Frontend to Backend
If on Android emulator or physical phone, update the API URL in `frontend/services/api.js`:
```javascript
const API_URL = 'http://YOUR_MACHINE_IP:5000/api'
```

Get your IP: `ifconfig` (Mac/Linux) or `ipconfig` (Windows)

### Step 5: Test the App

1. **Create Account**
   - Click "Sign Up"
   - Enter any name, email, password
   - Keep credentials for login

2. **Log a Mood**
   - Go to "Log Mood" tab
   - Select a mood
   - Adjust intensity slider
   - Select activities and triggers
   - Click "Log Mood"

3. **View Insights**
   - Go to "Insights" tab
   - See your mood patterns
   - View statistics and recommendations

## 🎨 UI Overview

| Screen | Purpose |
|--------|---------|
| **Home** | Dashboard with mood trends, stats, and recommendations |
| **Log Mood** | Daily mood entry with detailed context |
| **Insights** | Analytics and pattern analysis |
| **Profile** | User settings and app info |

## 🔑 Features Demo

### Try These Actions
1. Log moods for several days
2. Add activities and triggers
3. Include sleep and exercise hours
4. Check Insights to see patterns
5. Get personalized recommendations

## 📱 Running on Different Platforms

### iPhone (iOS)
```bash
npm run ios
# Opens iOS simulator
```

### Android Phone
```bash
npm run android
# Opens Android emulator or connects to phone
```

### Web Browser
```bash
npm run web
# Opens in browser at localhost
```

### Physical Device
1. Download "Expo Go" app
2. Run `npm run dev` in frontend folder
3. Scan QR code with Expo Go app

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| Can't connect to backend | Check backend is running on port 5000, update API URL |
| MongoDB error | Start MongoDB: `brew services start mongodb-community` |
| Port 5000 in use | Kill process: `lsof -ti:5000 \| xargs kill -9` |
| Expo won't start | Clear cache: `expo start --clear` |
| Can't scan QR code | Use same WiFi network for phone and computer |

## 📊 What to Track

**Moods:**
- Terrible, Bad, Neutral, Good, Excellent

**Activities:**
- Work, Exercise, Meditation, Social, Gaming, Reading, Cooking, Sleeping

**Triggers:**
- Work Stress, Family Issues, Health, Financial, Sleep Issues, Social Anxiety, Loneliness

**Metrics:**
- Sleep hours (7-9 recommended)
- Exercise minutes
- Social interaction level

## 💡 Tips

- Log moods at the same time each day for consistency
- Be specific with triggers and activities
- Track sleep - it greatly impacts mood
- Check insights after 2-3 weeks of data
- Use recommendations to improve patterns

## 🚀 Next Steps

1. Add more mood entries (aim for 30 days)
2. Experiment with activities listed
3. Note patterns in triggers
4. Implement recommendations
5. Share insights with friends

## 📞 Need Help?

- Check README.md for detailed documentation
- Review error messages in console
- Ensure all dependencies are installed
- Verify MongoDB connection string

---

**Ready? Happy mood tracking! 🎯**

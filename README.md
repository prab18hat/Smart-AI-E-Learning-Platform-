# 🚀 Smart AI Learning Platform

Welcome to the future of e-learning! The Smart AI Learning Platform is a cutting-edge educational platform that leverages artificial intelligence to provide personalized learning experiences, interactive courses, and real-time assistance.

## ✨ Features

### 🤖 AI-Powered Learning
- **Personalized Learning Paths**: AI algorithms analyze your progress and suggest customized learning journeys
- **Smart Recommendations**: Get course suggestions based on your interests and learning patterns
- **Adaptive Difficulty**: Content adjusts to match your skill level in real-time

### 📚 Interactive Courses
- **Rich Multimedia Content**: Engaging video lectures, interactive quizzes, and hands-on exercises
- **Progress Tracking**: Monitor your learning journey with detailed analytics
- **Skill Assessment**: Regular assessments to measure understanding and retention

### 💬 AI Chat Assistant
- **24/7 Learning Support**: Get instant help with course materials anytime
- **Context-Aware Responses**: AI understands your course context for relevant assistance
- **Multi-language Support**: Communicate in your preferred language

### 🎯 Smart Features
- **Code Execution**: Run and test code directly in the platform
- **Peer Learning**: Connect with fellow learners for collaborative projects
- **Gamification**: Earn badges and rewards for your learning achievements

## 🛠️ Tech Stack

- **Frontend**: React.js, Next.js, Redux, Tailwind CSS
- **Backend**: Node.js, Express.js
- **AI/ML**: Python, TensorFlow, NLP models
- **Database**: MongoDB, Redis
- **Authentication**: JWT, OAuth 2.0
- **Real-time**: WebSockets
- **Containerization**: Docker
- **CI/CD**: GitHub Actions

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- Python (v3.8 or higher)
- MongoDB (v5.0 or higher)
- Redis (v6.0 or higher)

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. Create a Vercel account at https://vercel.com
2. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
3. Navigate to frontend directory and deploy:
   ```bash
   cd Frontend
   vercel
   ```
4. Set environment variables in Vercel:
   - `REACT_APP_API_URL`: Your Render backend URL
   - `REACT_APP_GOOGLE_RECAPTCHA_KEY`: Your Google reCAPTCHA key

### Backend Deployment (Render)

1. Create a Render account at https://render.com
2. Create a new Web Service:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret key
     - `OPENAI_API_KEY`: Your OpenAI API key
     - `RAZORPAY_KEY`: Your Razorpay key
     - `RAZORPAY_SECRET`: Your Razorpay secret
     - `SMTP_HOST`: Your SMTP host
     - `SMTP_PORT`: Your SMTP port
     - `SMTP_USER`: Your SMTP user
     - `SMTP_PASS`: Your SMTP password

### Post-Deployment Steps

1. After both deployments are complete:
   - Update your frontend's API calls to point to your Render backend URL
   - Test the full application flow
   - Monitor both services for any errors

2. Free Tier Limitations:
   - Vercel: 100 GB/month bandwidth, 100,000 requests/month
   - Render: 100 hours/month of free compute time

3. Deployment Commands:
   ```bash
   # Build frontend
   cd Frontend
   npm run build

   # Start backend locally (for testing)
   cd ../server
   npm start
   ```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smart-ai-learning-platform.git
   cd smart-ai-learning-platform
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../Frontend
   npm install
   ```

3. **Set up environment variables**
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     # Server
     PORT=5000
     MONGODB_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     
     # Frontend
     NEXT_PUBLIC_API_URL=http://localhost:5000
     ```

4. **Start the development servers**
   ```bash
   # Start backend server
   cd server
   npm run dev
   
   # In a new terminal, start frontend
   cd Frontend
   npm run dev
   ```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 🧪 Testing

Run the test suite:

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd ../Frontend
npm test
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- All the amazing open-source libraries that made this project possible
- Our wonderful community of contributors
- The educators and learners who inspire us every day

## 📞 Contact

<<<<<<< HEAD
For any queries or support, please contact us at [your.email@example.com](mailto:coddyculturex@gmail.com)
=======
For any queries or support, please contact us at [your.email@example.com](mailto:prabhatmdi8953@gmail.com)
>>>>>>> 2d4ffe0a024f97d401e0ca5eb099fa118e345d3b

---

<p align="center">
<<<<<<< HEAD
  Made with ❤️ by CoddyCulture Team
=======
  Made with ❤️ by the Smart AI Learning Team Prabhat Mishra
>>>>>>> 2d4ffe0a024f97d401e0ca5eb099fa118e345d3b
</p>

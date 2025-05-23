import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Header from "./components/header/Header";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Verify from "./pages/auth/Verify";
import Footer from "./components/footer/Footer";
import Chatbot from "./components/chatbot/Chatbot";
import PersonalizedPath from "./components/personalizedPath/PersonalizedPath";
import About from "./pages/about/About";
import Account from "./pages/account/Account";
import { UserData } from "./context/UserContext";
import Loading from "./components/loading/Loading";
import Courses from "./pages/courses/Courses";
import CourseDescription from "./pages/coursedescription/CourseDescription";
import PaymentSuccess from "./pages/paymentsuccess/PaymentSuccess";
import Dashbord from "./pages/dashbord/Dashbord";
import CourseStudy from "./pages/coursestudy/CourseStudy";
import Lecture from "./pages/lecture/Lecture";
import AdminDashbord from "./admin/Dashboard/AdminDashbord";
import AdminCourses from "./admin/Courses/AdminCourses";
import AdminUsers from "./admin/Users/AdminUsers";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
// Gamification & Quiz imports
import Quizzes from "./pages/quiz/Quizzes";
import TakeQuiz from "./pages/quiz/TakeQuiz";
import QuizAttempt from "./pages/quiz/QuizAttempt";
import QuizLeaderboard from "./pages/quiz/QuizLeaderboard";
import Leaderboard from "./pages/leaderboard/Leaderboard";
import Badges from "./pages/badges/Badges";
import Rewards from "./pages/rewards/Rewards";
import AdminQuizManager from "./pages/quiz/AdminQuizManager";


const App = () => {
  const { isAuth, user, loading } = UserData();
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Header isAuth={isAuth} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses />} />
            <Route
              path="/account"
              element={isAuth ? <Account user={user} /> : <Login />}
            />
            <Route path="/login" element={isAuth ? <Home /> : <Login />} />
            <Route
              path="/register"
              element={isAuth ? <Home /> : <Register />}
            />
            <Route path="/verify" element={isAuth ? <Home /> : <Verify />} />
            <Route
              path="/forgot"
              element={isAuth ? <Home /> : <ForgotPassword />}
            />
            <Route
              path="/reset-password/:token"
              element={isAuth ? <Home /> : <ResetPassword />}
            />
            <Route
              path="/course/:id"
              element={isAuth ? <CourseDescription user={user} /> : <Login />}
            />
            <Route
              path="/payment-success/:id"
              element={isAuth ? <PaymentSuccess user={user} /> : <Login />}
            />
            <Route
              path="/:id/dashboard"
              element={isAuth ? <Dashbord user={user} /> : <Login />}
            />
            <Route
              path="/course/study/:id"
              element={isAuth ? <CourseStudy user={user} /> : <Login />}
            />

            <Route
              path="/lectures/:id"
              element={isAuth ? <Lecture user={user} /> : <Login />}
            />

            <Route
              path="/admin/dashboard"
              element={isAuth ? <AdminDashbord user={user} /> : <Login />}
            />

            <Route
              path="/admin/course"
              element={isAuth ? <AdminCourses user={user} /> : <Login />}
            />
            <Route
              path="/admin/users"
              element={isAuth ? <AdminUsers user={user} /> : <Login />}
            />
            <Route path="/quizzes" element={isAuth ? <Quizzes /> : <Login />} />
            <Route path="/quiz/take/:quizId" element={isAuth ? <TakeQuiz /> : <Login />} />
            <Route path="/quiz/attempt" element={isAuth ? <QuizAttempt /> : <Login />} />
            <Route path="/quiz/leaderboard" element={isAuth ? <QuizLeaderboard /> : <Login />} />
            <Route path="/leaderboard" element={isAuth ? <Leaderboard /> : <Login />} />
            <Route path="/badges" element={isAuth ? <Badges /> : <Login />} />
            <Route path="/rewards" element={isAuth ? <Rewards /> : <Login />} />
            {/* Admin-only quiz management */}
            <Route path="/admin/quizzes" element={isAuth && user?.role === "admin" ? <AdminQuizManager /> : <Login />} />
          </Routes>
          <Chatbot grokApiKey="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" />
          <PersonalizedPath grokApiKey="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" />
          <Footer />
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
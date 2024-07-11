import { Route, Routes } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

import HomePage from "./pages/home/HomePage.jsx";
import SignUpPage from "./pages/auth/signup/SignUpPage.jsx";
import LoginPage from "./pages/auth/loginPage/LoginPage.jsx";
import Sidebar from "./components/common/Sidebar.jsx";
import RightPanel from "./components/common/RightPanel.jsx";
import Notification from "./pages/notification/NotificationPage.jsx"
import ProfilePage from "./pages/profile/ProfilePage.jsx";

function App() {
  return (
      <div className="flex max-w-6xl mx-auto">
        
        <Sidebar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/notifications" element={<Notification />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
        </Routes>
        <RightPanel></RightPanel>
        <Toaster />
      </div>
  );
}

export default App;

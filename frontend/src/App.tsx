import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RegistrationPage from "./pages/RegistrationPage";
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from "@/components/DashboardLayout";
import NewsPage from "./pages/NewsPage";
import CryptoPage from "./pages/CryptosPage";
import CurrencyPage from "./pages/CurrencyPage";
import SettingsPage from "./pages/SettingsPage";
import OnboardingPage from "./pages/Onboardingpage";

function App() {
 
  return (
   <Router>
    <Routes>

      <Route path="/login" element={<LoginPage />}></Route>

      

      <Route path="/register" element={<RegistrationPage />}></Route>
      
      <Route element={<ProtectedRoute />} >
      <Route element={<DashboardLayout />} >
      <Route path="/" element={<DashboardPage />}></Route>
       <Route path="/news" element={<NewsPage />}></Route>
       <Route path="/crypto" element={<CryptoPage />}></Route>
       <Route path="/currency" element={<CurrencyPage />}></Route>
        <Route path="/settings" element={<SettingsPage />}></Route>
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Route>
      </Route> 
    </Routes>
    
    
  </Router>
  )
}

export default App
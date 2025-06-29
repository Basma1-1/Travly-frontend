import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import Home from './Pages/Home/Home.jsx';
import Login from './Pages/Login/Login.jsx'; 
import Register from './Pages/Register/Register.jsx'; 
import Destination from './Pages/Destination/Destination.jsx';
import Results from './Pages/Results/Results.jsx';
import DashboardAdmin from './Pages/DashboardAdmin/DashboardAdmin.jsx';
import Reservation from "./Pages/Reservation/Reservation.jsx";
import Logout from "./Pages/Logout/Logout.jsx";
import Notification from "./Pages/Notification/Notification.jsx";
import PrivateRoute from './Components/PrivateRoute';
import TripDetails from './Pages/TripDetails/TripDetails.jsx';
import Paiement from './Pages/Paiement/Paiement.jsx';
import Confirmation from './Pages/Confirmation/Confirmation.jsx';
import AboutUs from './Pages/AboutUs/AboutUs.jsx';
import Navbar from './Components/Navbar/Navbar.jsx';
import Footer from './Components/Footer/Footer.jsx';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleMode = () => {
    setDarkMode(!darkMode);
  };

  return (
      <Router>
        <Routes>
          <Route path='/' element={
            <div className={darkMode ? "dark-mode" : "light-mode"}>
              <Navbar darkMode={darkMode} toggleMode={toggleMode} />
                <Outlet/>
              <Footer/>
            </div>
          }>
            <Route index element={<Home darkMode={darkMode} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/destination" element={<Destination />} />
            <Route path="/results" element={<Results />} />
            <Route
              path="/details/:id"
              element={
                <PrivateRoute>
                  <TripDetails />
                </PrivateRoute>
              }
            />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/paiement" element={<Paiement />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/admin/dashboard/*"element={ <PrivateRoute> <DashboardAdmin /> </PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
  )
}

export default App;






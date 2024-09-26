// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/header';
import Home from './pages/home';
import LoginPage from './pages/login';
import SignupPage from './pages/register';
import AgencyHome from './pages/agencyHome';
import AddCar from './pages/addCar';
import UserHome from './pages/userHome'; 
import CardDetail from './pages/carDetail';
import AdminHome from './pages/adminHome';
import UserList from './pages/usersList';
import AgencyList from './pages/agencyList';
import AgencyCarDetail from './pages/agencyCarDetail';
import EditCar from './pages/editCar';
import Rent from './pages/rent'; 
import Payment from './pages/payment';
import Dashboard from './pages/dashboard';
import Bookings from './pages/adminBookings';
import AgencyBookings from './pages/agencyBookings';

function App() {
  return (
      <Router>
        <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<SignupPage />} />
            <Route path="/agencyHome" element={<AgencyHome />} />
            <Route path="/addCar" element={<AddCar />} />
            <Route path="/userHome" element={<UserHome />} />
            <Route path="/cardetail/:id" element={<CardDetail />} />
            <Route path="/adminHome" element={<AdminHome />} />
            <Route path="/usersList" element={<UserList />} />
            <Route path="/agencyList" element={<AgencyList />} />
            <Route path="/agencyCarDetail" element={<AgencyCarDetail />} />
            <Route path="/editCar/:carid" element={<EditCar />} />
            <Route path="/rent/:carid" element={<Rent />} />
            <Route path="/payment/:carid" element={<Payment />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/agencyBookings" element={<AgencyBookings />} />
          </Routes>
      </Router>
  );
}

export default App;

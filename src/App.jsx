import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React from 'react'
import Home from './pages/Home'
import Tour from './pages/Tour'
import Explore from './pages/Explore'
import About from './pages/About'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import TourDetail from './pages/TourDetail'
import Profile from './pages/Profile'
import MyBooking from './pages/MyBooking'
import { UserProvider } from './contexts/UserContext'
import ScrollToTop from './components/ScrollToTop'

import Admin from './pages/admin/Admin'
import './App.css'

function App () {
    return (
        <UserProvider>
            <Router>
                <ScrollToTop />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/tour" element={<Tour />} />
                    <Route path="/explore" element={<Explore/>} />
                    <Route path="/about" element={<About/>} />
                    <Route path="/login" element={<Login/>} />
                    <Route path="/signup" element={<SignUp/>} />
                    <Route path="/tours/:id" element={<TourDetail />} />
                    <Route path='/profile' element={<Profile />} />
                    <Route path='/bookings' element={<MyBooking />} /> 

                    <Route path='/admin' element={<Admin />} />
                </Routes>
            </Router>
        </UserProvider>
    )
}

export default App

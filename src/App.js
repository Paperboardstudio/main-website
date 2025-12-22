import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import LandingPage from './pages/LandingPage/LandingPage';
import TransitionPage from './pages/TransitionPage/TransitionPage';
import { Header } from './pages/Header/Header';
import ClaritAppPrivacy from './pages/ClaritAppPrivacy/ClaritAppPrivacy';

import { MainPage } from './pages';

const HomePage = () => {
  return (
    <div className="app" style={{ overflow: 'auto', overflowX: 'hidden', height: '100vh', scrollBehavior: 'smooth' }}>
      <Header />
      {}
      <section style={{ height: '100vh' }} id="home" className="section-anchor">
        <LandingPage />
      </section>

      {}
      <section style={{ height: '100vh'}}>
        <TransitionPage />
      </section>

      {}
      <section style={{ height: '100vh' }}>
        <MainPage />
      </section>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/claritapp-privacy" element={<ClaritAppPrivacy />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

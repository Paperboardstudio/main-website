import React from 'react';
import './App.css';

import LandingPage from './pages/LandingPage/LandingPage';
import TransitionPage from './pages/TransitionPage/TransitionPage';
import { Header } from './pages/Header/Header';

import { MainPage } from './pages';

const App = () => {
  return (
    <div className="app" style={{ overflow: 'auto', height: '100vh', scrollBehavior: 'smooth' }}>
      <Header />
      {/* Landing Page */}
      <section style={{ height: '100vh' }}>
        <LandingPage />
      </section>

      {/* Transition Page */}
      <section style={{ height: '150vh', position: 'relative'}}>
        <TransitionPage />
      </section>

      {/* Main Page */}
      <section style={{ height: '100vh' }}>
        <MainPage />
      </section>
    </div>
  );
};

export default App;

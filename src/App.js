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

export default App;

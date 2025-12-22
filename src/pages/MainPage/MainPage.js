import React from 'react';
import './MainPage.scss';
import { Services } from '../ServicePage/ServicePage';
import { Portfolio } from '../PortfolioPage/PortfolioPage';
import { Footer } from '../Footer/Footer';

export const MainPage = () => {
  return (
    <div className="main-page">   
      <section className="main-page__services">
        <Services />
      </section>
      <section className="main-page__portfolio">
        <Portfolio />
      </section>
      <Footer ></Footer>
    </div>
  );
};

export default MainPage;

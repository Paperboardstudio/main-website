import React from 'react';
import './MainPage.scss';
import { Header } from '../Header/Header';
import { Services } from '../ServicePage/ServicePage';
import { Portfolio } from '../PortfolioPage/PortfolioPage';
import { Footer } from '../Footer/Footer';

import { GLTFModel } from '../ModelViewer/ModelViewer';

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

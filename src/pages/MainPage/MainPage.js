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
      <Header />
      <div className="main-page__content single-page" id="home">
        <div className="main-page__text-content">
          <h1 className="main-page__title">Delivering Visual Innovations</h1>
          <button className="main-page__contact-button">Get in touch with us</button>
        </div>
        <div className="main-page__image-container">
          <GLTFModel url="/kerosene.gltf" />
        </div>
      </div>
      <section className="main-page__services single-page" id="services">
        <Services />
      </section>
      <section className="main-page__portfolio single-page" id="portfolio">
        <Portfolio />
      </section>
      <Footer ></Footer>
    </div>
  );
};

export default MainPage;

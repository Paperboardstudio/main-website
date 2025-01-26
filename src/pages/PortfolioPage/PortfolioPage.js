import React from 'react';
import './PortfolioPage.scss';

const portfolioItems = [
  {
    imagePlaceholder: 'Picture of Clarita POS',
    title: 'Mobile App Design and Development for POS',
    description: 'Clarita POS enables cashiers to process transactions and store owners to visualize sales reporting and analytics.',
  },
  {
    imagePlaceholder: 'Picture of AR car app',
    title: 'Car Dealership AR',
    description: 'Augmented Reality app that assists the salesperson with accessible information and a faster quote.',
  },
];

export const Portfolio = () => {
  return (
    <section className="portfolio-wrapper">
      <div className="portfolio">
        <h2 className="portfolio__title">Our Portfolio</h2>
        <div className="portfolio__items">
          {portfolioItems.map((item, index) => (
            <div className="portfolio__item" key={index}>
              <div className="portfolio__item-image">
                <span className="portfolio__item-image-placeholder">{item.imagePlaceholder}</span>
              </div>
              <div className="portfolio__item-description">
                <h3 className="portfolio__item-title">{item.title}</h3>
                <p className="portfolio__item-text">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

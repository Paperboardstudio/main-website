import React from 'react';
import './ServicePage.scss';

export const ServiceCard = ({ title, description, technologies, imageAlt }) => {
  return (
    <div className="service-card">
      <h2 className="service-card__title">{title}</h2>
      <div className="service-card__image">
        <span className="service-card__image-description">{description}</span>
      </div>
      <ul className="service-card__technologies">
        {technologies.map((tech) => (
          <li key={tech} className="service-card__technology">{tech}</li>
        ))}
      </ul>
    </div>
  );
};

export const Services = () => {
  const services = [
    {
      title: 'MOBILE APP DEVELOPMENT',
      description: 'Picture of phones',
      technologies: ['Swift', 'React Native', 'FlutterJS', 'Kotlin'],
      imageAlt: 'Mobile development concepts'
    },
    {
      title: 'SOLID DESIGN SOLUTIONS',
      description: 'Picture of artsy stuff',
      technologies: ['Figma', 'Adobe AfterEffects', 'Adobe Illustrator', 'Blender', 'Cinema 4D'],
      imageAlt: 'Design tools and artwork'
    },
    {
      title: 'WEB DEVELOPMENT',
      description: 'Picture of pages with code',
      technologies: ['ReactJS', 'VueJS', 'NodeJS', 'Webflow'],
      imageAlt: 'Web development environment'
    },
  ];

  return (
    <section className="services">
      <h1 className="services__title">Our Services</h1>
      <div className="services__list">
        {services.map((service) => (
          <ServiceCard
            key={service.title}
            title={service.title}
            description={service.description}
            technologies={service.technologies}
            imageAlt={service.imageAlt}
          />
        ))}
      </div>
    </section>
  );
};

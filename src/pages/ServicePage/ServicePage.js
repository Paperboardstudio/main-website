import React from 'react';
import './ServicePage.scss';

export const ServiceCard = ({ title, technologies, image, imageAlt }) => {
  return (
    <div className="service-card">
      <h2 className="service-card__title">{title}</h2>
      <div className="service-card__image">
        <img src={image} alt={imageAlt} />
      </div>
      <ul className="service-card__technologies">
        {technologies.map((tech) => (
          <li key={tech} className="service-card__technology">
            {tech}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const Services = () => {
  const services = [
    {
      title: 'Mobile app development',
      image: '/images/service1.webp', // Use the image from the public folder
      technologies: ['Swift', 'React Native', 'FlutterJS', 'Kotlin'],
      imageAlt: 'Mobile development concepts',
    },
    {
      title: 'Solid design solutions',
      image: '/images/service2.webp',
      technologies: ['Figma', 'Adobe AfterEffects', 'Adobe Illustrator', 'Blender', 'Cinema 4D'],
      imageAlt: 'Design tools and artwork',
    },
    {
      title: 'Web development',
      image: '/images/service3.webp',
      technologies: ['ReactJS', 'VueJS', 'NodeJS', 'Webflow'],
      imageAlt: 'Web development environment',
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
            image={service.image}
            technologies={service.technologies}
            imageAlt={service.imageAlt}
          />
        ))}
      </div>
    </section>
  );
};
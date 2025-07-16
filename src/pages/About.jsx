// src/pages/About.jsx
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AboutHero from '../components/AboutHero';
import AboutIntro from '../components/AboutIntro';
import WhyChooseUs from '../components/WhyChooseUs'; // gọi lại

const About = () => {
  return (
    <>
      <Header />
      <AboutHero />
      <AboutIntro />
      <WhyChooseUs />
      <Footer />
    </>
  );
};

export default About;

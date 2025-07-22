// src/pages/About.jsx
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AboutIntro from '../components/AboutIntro';
import WhyChooseUs from '../components/WhyChooseUs'; // gọi lại

const About = () => {
  return (
    <>
      <Header />
      <AboutIntro />
      <WhyChooseUs />
      <Footer />
    </>
  );
};

export default About;

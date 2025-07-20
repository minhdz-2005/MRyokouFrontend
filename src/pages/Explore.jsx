// src/pages/Explore.jsx
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ExploreHero from '../components/ExploreHero';
import ExploreVN from '../components/ExploreVN'
import TravelGuide from '../components/TravelGuide'

const Explore = () => {
  return (
    <>
      <Header />
      <ExploreHero />
      <ExploreVN></ExploreVN>
      <TravelGuide></TravelGuide>
      <Footer />
    </>
  );
};

export default Explore;

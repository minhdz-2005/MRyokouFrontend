// src/pages/Tour.jsx
import React from 'react';
import Header from '../components/Header';
import TourList from '../components/TourList';
import Footer from '../components/Footer';
import TourHero from '../components/TourHero';
import SearchBar from '../components/SearchBar';
import SortBar from '../components/SortBar';

const Tour = () => {
  return (
    <>
      <Header />
      <TourHero></TourHero>
      <SearchBar></SearchBar>
      <TourList />
      <Footer />
    </>
  );
};

export default Tour;

// src/pages/Explore.jsx
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ExploreHero from '../components/ExploreHero'; // <== thêm dòng này
import ExploreByDestination from '../components/ExploreByDestination';
import ExploreBySeason from '../components/ExploreBySeason';

const Explore = () => {
  return (
    <>
      <Header />
      <ExploreHero /> {/* <== gọi ở đây */}
      <div className="container my-5">
        <ExploreByDestination />
        <hr className="my-5" />
        <ExploreBySeason />
      </div>
      <Footer />
    </>
  );
};

export default Explore;

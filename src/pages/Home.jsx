import React from "react";
import Header from "../components/Header";
import Banner from "../components/Banner";
import FeaturedTours from "../components/FeaturedTour";
import WhyChooseUs from "../components/WhyChooseUs";
import Reviews from "../components/Reviews"
import Footer from "../components/Footer";

const Home = () => {
    return (
        <>
            <Header></Header>
            <Banner></Banner>
            <FeaturedTours></FeaturedTours>
            <WhyChooseUs/>
            <Reviews></Reviews>
            <Footer></Footer>
        </>
    )
}

export default Home
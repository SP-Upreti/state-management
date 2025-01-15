import Footer from "../components/footer/footer";
import Navbar from "../components/navigation/navbar";
import Categories from "../components/products/categories";
import Products from "../components/products/products";
import HeroSection from "../components/sections/heroSection";
import Stats from "../components/stats/stats";

export default function Home() {
    return (
        <>
            <Navbar />
            <HeroSection />
            <Products />
            <Categories />
            <Stats />
            <Footer />
        </>
    )
}

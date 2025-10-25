import Footer from "../components/footer/footer";
import Navbar from "../components/navigation/navbar";
import Categories from "../components/products/categories";
import RecentProducts from "../components/products/RecentProducts";
import PopularProducts from "../components/products/PopularProducts";
import HeroSection from "../components/sections/heroSection";
import Stats from "../components/stats/stats";

export default function Home() {
    return (
        <>
            <Navbar />
            <HeroSection />
            <PopularProducts />
            <Categories />
            <RecentProducts />
            <Stats />
            <Footer />
        </>
    )
}

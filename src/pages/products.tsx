import Footer from "../components/footer/footer";
import Navbar from "../components/navigation/navbar";
import Filtre from "../components/products/filtre";

export default function Products() {
    return (
        <>
            <Navbar />
            <Filtre >
                <h2>Hello products</h2>
            </Filtre>
            <Footer />
        </>
    )
}

import Slides from "./slides";

export default function HeroSection() {
    return (
        <div className="bg-gray-900">
            <section className="py-24 mx-auto max-w-screen-xl pb-16 px-4 items-center lg:flex md:px-8">
                <div className="space-y-4 flex-1 sm:text-center lg:text-left">
                    <h1 className="text-white font-bold text-4xl xl:text-5xl">
                        Your <span className="text-indigo-400">One-Stop Shop</span> for Everything You Need
                    </h1>
                    <p className="text-gray-300 max-w-xl leading-relaxed sm:mx-auto lg:ml-0">
                        Shop the latest products at unbeatable prices. Fast shipping, secure checkout, and exclusive deals you won't find anywhere else!
                    </p>
                    <div className="pt-10 items-center justify-center space-y-3 sm:space-x-6 sm:space-y-0 sm:flex lg:justify-start">
                        <a href="/" className="px-7 py-3 w-full bg-white text-gray-800 text-center rounded-md shadow-md block sm:w-auto">
                            Shop Now
                        </a>
                        <a href="/" className="px-7 py-3 w-full bg-gray-700 text-gray-200 text-center rounded-md block sm:w-auto">
                            View Offers
                        </a>
                    </div>
                </div>
                <div className="flex-1 text-center mt-7 lg:mt-0 lg:ml-3">
                    <Slides />
                </div>
            </section>
        </div>
    );
}

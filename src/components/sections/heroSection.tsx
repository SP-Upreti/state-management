

import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/swiper-bundle.css"

export default function HeroSection() {
    return (
        <section className="max-h-[500px] overflow-hidden mx-auto max-w-screen-xl  px-4 items-center flex flex-col-reverse lg:flex-row md:px-8">
            <Slides />
        </section>
    );
}


function Slides() {

    return (
        <Swiper
            // install Swiper modules
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={50}
            slidesPerView={1}
            navigation
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log('slide change')}
        >
            {
                Array.from({ length: 6 }, (_, idx) => {
                    return (
                        <SwiperSlide key={idx}>
                            <img src={`/banner${idx + 1}.jpg`} alt="banner1" />
                        </SwiperSlide>
                    )
                })
            }

        </Swiper>
    );
};
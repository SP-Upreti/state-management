// import Swiper core and required modules
import { A11y, Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

export default function Slides() {
    return (
        <div className="max-w-[500px] ">
            <Swiper
                // install Swiper modules
                modules={[A11y, Autoplay, Pagination]}
                spaceBetween={50}
                autoplay={{ delay: 3000 }}
                slidesPerView={1}
                // navigation
                pagination={{
                    clickable: true
                }}
            >
                <SwiperSlide>
                    <img src='/slides/slide0.png' alt='feature 1' className='h-[400px]' />
                </SwiperSlide>
                <SwiperSlide>
                    <img src='/slides/slide1.png' alt='feature 2' className='h-[400px]' />
                </SwiperSlide>
                <SwiperSlide>
                    <img src='/slides/slide2.png' alt='feature 3' className='h-[400px]' />
                </SwiperSlide>
            </Swiper>
        </div >
    );
};

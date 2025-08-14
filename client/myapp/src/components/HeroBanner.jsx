import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";  // Pagination module

import "swiper/css";
import "swiper/css/pagination";

const HeroBanner = () => {
  const sliderData = [
    {
      id: 1,
      bgGradient: "bg-gradient-to-tr from-[#537F90] to-[#18252A]",
      image: "/images/watch.png",
      title: "Stylish Watches",
      description: "Exclusive Collection",
      buttonText: "Shop Now",
    },
    {
      id: 2,
      bgGradient: "bg-gradient-to-tr from-[#D2D0C1] to-[#6C6B63]",
      image: "/images/Remove background project.png",
      title: "Elegant Timepieces",
      description: "Discover the latest trends at unbeatable prices.",
      buttonText: "Buy Now",
    },
    {
      id: 3,
      bgGradient: "bg-gradient-to-tr from-[#b4a9a9] to-[#18252A]",
      image: "/images/headphone.png",
      title: "Luxury Items",
      description: "Shop more, save more, stress less.",
      buttonText: "Buy Now",
    },
  ];

  return (
    <div className="mt-20 w-full px-6 mx-auto">
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={50}
        slidesPerView={1}
        className="rounded-lg overflow-hidden"
      >
        {sliderData.map(({ id, bgGradient, image, title, description, buttonText }) => (
          <SwiperSlide key={id}>
            <div
              className={`flex flex-row items-center justify-between p-8 md:p-16 h-auto md:h-96 text-white rounded-lg ${bgGradient}`}
            >
              {/* Left Text Section */}
              <div className="w-1/2 mb-0 text-center md:text-left">
                <h2 className="text-3xl md:text-5xl font-extrabold mb-5 leading-tight drop-shadow-lg">
                  {title}
                </h2>
                <p className="mb-8 text-md md:text-lg max-w-md drop-shadow-md">
                  {description}
                </p>
                <button className="bg-[#587b99] text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition">
                  {buttonText}
                </button>
              </div>

              {/* Right Image Section */}
              <div className="w-1/2 flex justify-center">
                <img
                  src={image}
                  alt={title}
                  className="max-h-64 md:max-h-80 object-contain drop-shadow-xl"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroBanner;

import React, { useRef } from "react";
import {
  Swiper as SwiperType,
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  EffectCoverflow,
} from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import propertyImg from "../../public/assets/projects/property.jpg";
import CryptoImg from "../../public/assets/projects/crypto.jpg";
import netflixImg from "../../public/assets/projects/netflix.jpg";
import twitchImg from "../../public/assets/projects/twitch.jpg";
import ProjectItem from "../ProjectItem";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";

const Projects = () => {
  const swiperRef = useRef<SwiperType>();

  return (
    <div id="projects" className="w-full">
      <div className="max-w-full mx-auto px-2 py-16">
        <div className="max-w-7xl mx-auto ">
          <p className="text-xl tracking-widest uppercase text-basic-200">
            Projects
          </p>
          <h2 className="py-4">What i&apos;ve built</h2>
        </div>
        <div className="flex justify-evenly items-center w-full">
          <button
            className="text-5xl rounded-full cursor-pointer shadow-lg shadow-gray-400 hover:scale-105 ease-in duration-200"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <FaChevronCircleLeft />
          </button>
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y, EffectCoverflow]}
            spaceBetween={20}
            slidesPerView={1}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            pagination={{ clickable: true }}
            loop={true}
            effect="coverflow"
            coverflowEffect={{
              rotate: 5,
              stretch: 25,
              depth: 700,
              modifier: 1,
              slideShadows: false,
            }}
            style={{ width: "80%" }}
          >
            <SwiperSlide>
              <div className={`w-3/4 m-auto mt-20`}>
                <ProjectItem
                  title="Property Finder"
                  image={propertyImg}
                  projectUrl="/property"
                  teach="React JS"
                />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className={`w-3/4 m-auto mt-20`}>
                <ProjectItem
                  title="Crypto App"
                  image={CryptoImg}
                  projectUrl="/crypto"
                  teach="React JS"
                />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className={`w-3/4 m-auto mt-20`}>
                <ProjectItem
                  title="Netflix App"
                  image={netflixImg}
                  projectUrl="/netflix"
                  teach="React JS"
                />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className={`w-3/4 m-auto mt-20`}>
                <ProjectItem
                  title="Twitch UI"
                  image={twitchImg}
                  projectUrl="/twitch"
                  teach="Next JS"
                />
              </div>
            </SwiperSlide>
          </Swiper>
          <button
            className="text-5xl rounded-full cursor-pointer shadow-lg shadow-gray-400 hover:scale-105 ease-in duration-200"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <FaChevronCircleRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Projects;

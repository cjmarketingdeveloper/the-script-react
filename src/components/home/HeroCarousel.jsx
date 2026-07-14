import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { listSliders } from "../../lib/fetchRequests";
import { Swiper, SwiperSlide } from 'swiper/react'
import {  Pagination, Autoplay } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'

export default function HeroCarousel() {
    const [listContent, setListContent]                   =  useState([]);
    
    useEffect(() => {
      fetchListOfSliders();
    }, []);
  
    const fetchListOfSliders = async () => {
      try {
  
        const response = await listSliders();              
        setListContent(response);
      } catch (error) {
        console.error("Error fetching sliders:", error);
      } 
    }

  return (
    <div className="container-xl my-5 slider-relative-container">
      {
        listContent.length > 0 ?
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 5000 }}
            pagination={{ clickable: true }}
            className="mySwiper"
          >
            {listContent.map((slide, index) => (
              <SwiperSlide key={slide._id || index}>
                <div 
                  className="relative layer-slide-item flex items-center p-5 rounded-lg text-white"
                  style={{ 
                      backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.featuredImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                  }}
                >
                  <div className="max-w-md info-slide-sect">
                    
                    <h2 className="txt-mega1">{slide.title}</h2>
                    <h4 className="txt-mega2 mb-4">{slide.subTitle}</h4>
                    {slide.link && (
                      <Link 
                        to={slide.link}
                        className="btn px-4 py-2 btn-pill-sm"
                        style={{ backgroundColor: slide.linkColor }}
                      >
                        {slide.linkText || "Learn More"}
                      </Link>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        :(
          <p>Loading Slides...</p>  
        )
      }      
    </div>
  )
}
import React from 'react';
import styles from './SlideShow.module.css'
import Card from '../Card/Card'
import {Swiper, SwiperSlide} from 'swiper/react';
import "swiper/css";
import "swiper/css/navigation";
import {Navigation} from "swiper/modules";


export default function SlideShow({title, movies, onLikeMovie, likedMovies}) {
    return (
        <div>

            <h2 className={styles.title}>{title}</h2>
            <div className={styles.Row}>
                <Swiper
                modules={[Navigation]}
                navigation
                spaceBetween={10}
                slidesPerView={5.8}
                >
                {

                    movies?.map((movie)=>(
                        <SwiperSlide key={movie.id}>
                        <Card 
                          movie={movie}
                          onLikeMovie={onLikeMovie}
                          likedMovies={likedMovies}
                        />
                        </SwiperSlide>
                    ))
                }
                </Swiper>
            </div>
        </div>
    )
}
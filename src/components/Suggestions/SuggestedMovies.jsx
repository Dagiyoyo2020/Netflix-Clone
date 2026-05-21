import { useState, useEffect } from 'react';
import { getMovieSuggestions } from '../Utility/geminiService';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Card from '../Card/Card';
import styles from './Suggestions.module.css';

export default function Suggestions({ likedMovies, onLikeMovie }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (likedMovies && likedMovies.length > 0) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [likedMovies]);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const result = await getMovieSuggestions(likedMovies);
      setSuggestions(result);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!likedMovies || likedMovies.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div>
        <h2 className={styles.title}>AI Suggestions For You</h2>
        <p className={styles.loading}>Getting AI suggestions...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className={styles.title}>AI Suggestions For You</h2>
      <div className={styles.Row}>
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={10}
          slidesPerView={5.8}
        >
          {suggestions.map((suggestion, index) => (
            <SwiperSlide key={index}>
              <Card 
                movie={suggestion}
                onLikeMovie={onLikeMovie}
                likedMovies={likedMovies}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
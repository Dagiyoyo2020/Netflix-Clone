import React, { useState, useEffect } from "react";
import styles from "./Card.module.css";
import { FaCirclePlay } from "react-icons/fa6";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { BsPlusCircle } from "react-icons/bs";
import { ThumbsUp } from "lucide-react";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export default function Card({ movie, onLikeMovie, likedMovies }) {
  const [isLiked, setIsLiked] = useState(false);
  const genreMap = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Sci-Fi",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
    10759: "Action & Adventure",
    10762: "Kids",
    10763: "News",
    10764: "Reality",
    10765: "Sci-Fi & Fantasy",
    10766: "Soap",
    10767: "Talk",
    10768: "War & Politics",
  };

  const fallbackGenres = ["Action", "Thriller", "Horror", "Comedy", "Sci-Fi"];
useEffect(() => {
    if (likedMovies && movie) {
      const alreadyLiked = likedMovies.some(
        (likedMovie) => likedMovie.movie_id === movie.id,
      );
      setIsLiked(alreadyLiked);
    }
  }, [likedMovies]);

const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newLikeStatus = !isLiked;
    setIsLiked(newLikeStatus);
    
    if (onLikeMovie) {
      onLikeMovie(movie, newLikeStatus);
    }

  };

  return (
    <div className={styles.card}>
      <img
        className={styles.poster}
        src={
          movie?.poster_path
            ? `${IMAGE_BASE}${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Poster"
        }
        alt={movie.title || movie.name}
      />

      <div className={styles.hoverEffect}>
        <img
          className={styles.hoverImage}
          src={
            movie?.poster_path
              ? `${IMAGE_BASE}${movie.poster_path}`
              : "https://via.placeholder.com/500x750?text=No+Poster"
          }
          alt=""
        />

        <h1>{movie.original_name} </h1>
        <h1>{movie.title}</h1>
        <div className={styles.buttons}>
          <FaCirclePlay
            className={styles.circleButton}
            size={30}
            color="white"
          />
          <BsPlusCircle
            className={styles.circleButton}
            size={30}
            color="white"
          />
          <ThumbsUp
            className={`${styles.circleButton} ${isLiked ? styles.liked : ""}`}
            size={30}
            color={isLiked ? "#E50914" : "white"}
            onClick={handleLikeClick}
            fill={isLiked ? "#E50914" : "none"}
          />
          <IoIosArrowDropdownCircle
            className={styles.circleButtonSmall}
            size={30}
            color="white"
          />
        </div>

        <div className={styles.metadata}>
          <span className={styles.tag}>U/A 16+</span>
          <span className={styles.tag}>Movie</span>
          <span className={styles.tag}>HD</span>
        </div>

        <div className={styles.genres}>
          {movie?.genre_ids?.slice(0, 3).map((genreId, index) => (
            <span key={genreId}>
              {genreMap[genreId] || "Unknown"}
              {index < 2 && movie.genre_ids.length > index + 1 && (
                <span className={styles.dot}> • </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

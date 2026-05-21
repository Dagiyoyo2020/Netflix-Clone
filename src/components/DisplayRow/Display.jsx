import React from "react";
import styles from "./DisplayRow.module.css";
import SlideShow from "../SlideShow/SlideShow";
import Suggestions from '../Suggestions/SuggestedMovies';
import { movieInstance } from "../Utility/MovieInstance";
import requests from "../Utility/requestUrls";
import { getLikedMovies, likeMovie, unlikeMovie } from '../Utility/apiService';
import {useState, useEffect} from 'react'

export default function Display() {
  const [movies, setMovies] = useState({
    trending: [],
    netflixOriginals: [],
    topRated: [],
    action: [],
    comedy: [],
    horror: [],
    romance: [],
    documentaries: [],
  });
  
  const [likedMovies, setLikedMovies] = useState([]);

  useEffect(()=>{
    fetchMovies();
    loadLikedMovies();
  },[]);

  const fetchMovies = async () => {
    try {
      const [trendingRes, netflixRes, topRatedRes, actionRes, comedyRes, horrorRes, romanceRes, docRes] = await Promise.all([
        movieInstance.get(requests.fetchTrending),
        movieInstance.get(requests.fetchNetflixOriginals),
        movieInstance.get(requests.fetchTopRatedMovies),
        movieInstance.get(requests.fetchActionMovies),
        movieInstance.get(requests.fetchComedyMovies),
        movieInstance.get(requests.fetchHorrorMovies),
        movieInstance.get(requests.fetchRomanceMovies),
        movieInstance.get(requests.fetchDocumentaries)
      ]);
      
      setMovies({
        trending: trendingRes.data.results,
        netflixOriginals: netflixRes.data.results,
        topRated: topRatedRes.data.results,
        action: actionRes.data.results,
        comedy: comedyRes.data.results,
        horror: horrorRes.data.results,
        romance: romanceRes.data.results,
        documentaries: docRes.data.results,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const loadLikedMovies = async () => {
    try {
      const savedLikes = await getLikedMovies();
      setLikedMovies(savedLikes);
    } catch (error) {
      console.error('Failed to load liked movies:', error);
    }
  };

  const handleLikeMovie = async (movie, isLiked) => {
    try {
      if (isLiked) {
        await likeMovie(movie);
        setLikedMovies(prev => [...prev, movie]);
      } else {
        await unlikeMovie(movie.id);
        setLikedMovies(prev => prev.filter(m => m.movie_id !== movie.id));
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  return (
    <div className={styles.mainWrapper}>

      <SlideShow title="Trending" movies={movies.trending} onLikeMovie={handleLikeMovie} likedMovies={likedMovies} />
      <SlideShow title="Netflix Originals" movies={movies.netflixOriginals} onLikeMovie={handleLikeMovie} likedMovies={likedMovies} />
      <SlideShow title="Top Rated" movies={movies.topRated} onLikeMovie={handleLikeMovie} likedMovies={likedMovies} />
      <SlideShow title="Horror" movies={movies.horror} onLikeMovie={handleLikeMovie} likedMovies={likedMovies} />
      <Suggestions likedMovies={likedMovies} />
    </div>
  );
} 
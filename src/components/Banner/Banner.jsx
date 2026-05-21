import React, {useEffect, useState} from "react";
import NetflixBanner from "../../assets/image/logo.png";
import styles from "./Banner.module.css";
import { Play, Info } from "lucide-react";
import {movieInstance} from '../Utility/MovieInstance'
import requests from '../Utility/requestUrls'

const BANNER_BASE ="https://image.tmdb.org/t/p/original/"
export default function Banner() {

  const [BannerMovie, setBannerMovie] = useState(null)

  useEffect(()=>{
    async function fetchBannerImage () {
      const request = await movieInstance.get(requests.fetchTrending)
      setBannerMovie(
        request.data.results[Math.floor(Math.random()*request.data.results.length)]
      )
    }
    fetchBannerImage()
  },[])

  const truncate = (string, n) => {
    return string?.length > n ? string.substr(0, n-1) + '...' : string;
  }

  if (!BannerMovie) return null;

  return (
    <div className={styles.banner} style={{
        backgroundSize:"cover",
        backgroundImage:`url("${BANNER_BASE}${BannerMovie.backdrop_path}")`
    }}
    >
      <div className={styles.content}>
        <img
          src={NetflixBanner}
          alt="Netflix Banner"
          className={styles.bannerImage}
        />
        <div className={styles.overlay}>
          <h1 className={styles.title}>
            {BannerMovie?.original_name || BannerMovie?.original_title || BannerMovie?.title}
          </h1>
          <h1 className={styles.description}>
            {truncate(BannerMovie?.overview, 180)}
          </h1>
          <div className={styles.buttonContainer}>
            <button className={styles.button}>
              <Play size={30} />
              Play
            </button>
            <button className={styles.button}>
              <Info size={30} />
              My List
            </button>
          </div>
        </div>
      </div>
      <div className={styles.fadeBottom}></div>
    </div>
  );
}
import React from 'react'
import styles from './Footer.module.css'
import { BsFacebook, BsInstagram, BsTwitter, BsYoutube } from 'react-icons/bs'
export default function Footer () {
    return (
        <div className={styles.footerWrapper}>
            <div className={styles.logos}>
                <BsFacebook size={30}/>
                <BsInstagram size={30}/>
                <BsTwitter size={30}/>
                <BsYoutube size={30}/>
            </div>
            <div className={styles.footerDesc}>
                <div className={styles.first}>
                    <p>Audio Description</p>
                    <p>Investor Relations</p>
                    <p>Legal Notices</p>

                </div>
                <div className={styles.second}> 
                    <p>Help Centre</p>
                    <p>Jobs</p>
                    <p>Cookie Preferences</p>
                </div>
                <div className={styles.third}>
                    <p>Gift Cards</p>
                    <p>Terms of Use</p>
                    <p>Corporate Information</p>
                </div>
                <div className={styles.fourth}>
                    <p>Media Centre</p>
                    <p>Privacy</p>
                    <p>Contact Us</p>
                </div>

            </div>
            <div className={styles.date}>
                <p className={styles.date}>1997-2026 Netflix, Inc.</p>
            </div>
        </div>
    )
}
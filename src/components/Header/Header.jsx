import React from "react";
import { useState } from "react";
import logo from "../../assets/image/logo.png";
import { Search, Bell, User, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header({ user, onLogout }) {
  const [IsSearchOpen, setIsSearchOpen] = useState(false);
  const [dropDown, setdropDown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Listen for scroll events
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);    

  const handleSignOut = () => {
    setdropDown(false);
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <Link to="/">
          <img className={styles.logo} src={logo} alt="Netflix Logo" />
        </Link>
        <nav className={styles.nav}>
          <Link className={styles.link} to="/">Home</Link>
          <Link className={styles.link} to="/movies">Movies</Link>
          <Link className={styles.link} to="/tv-shows">TV Shows</Link>
          <Link className={styles.link} to="/new-popular">New & Popular</Link>
          <Link className={styles.link} to="/my-list">My List</Link>
          <Link className={styles.link} to="/browse-by-language">Browse by Language</Link>
        </nav>
        <div className={styles.rightSection}>
          <div className={styles.search}>
            {IsSearchOpen && (
              <input
                type="text"
                placeholder="Search..."
                className={styles.searchInput}
              />
            )}
            <button
              onClick={() => setIsSearchOpen(!IsSearchOpen)}
              className={styles.searchButton}
            >
              <Search size={20} />
            </button>
          </div>
          <button className={styles.notificationButton}>
            <Bell size={20} />
            <span className={styles.notificationCount}>3</span>
          </button>
          <div className={styles.profile}>
            <div className={styles.profileButton}>
              <div className={styles.profileIcon}>
                <User size={20} />
              </div>
              
              {/* Username Display */}
              {user && (
                <span className={styles.username}>
                  {user.username}
                </span>
              )}

              <button
                className={styles.dropDownButton}
                onClick={() => setdropDown(!dropDown)}
              >
                <ChevronDown size={20} />
              </button>
              {dropDown && (
                <div className={styles.dropDownMenu}>
                  {user && (
                    <div className={styles.userInfo}>
                      <User size={24} />
                      <span>{user.username}</span>
                      <small>{user.email}</small>
                    </div>
                  )}
                  <Link 
                    className={styles.dropDownItems} 
                    to="/account"
                    onClick={() => setdropDown(false)}
                  >
                    Account
                  </Link>
                  <Link 
                    className={styles.dropDownItems} 
                    to="/help"
                    onClick={() => setdropDown(false)}
                  >
                    Help Center
                  </Link>
                  <hr />
                  <button 
                    className={`${styles.dropDownItems} ${styles.signOutButton}`}
                    onClick={handleSignOut}
                  >
                    Sign out of Netflix
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
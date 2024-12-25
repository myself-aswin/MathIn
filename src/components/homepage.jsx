// homepage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Loader from './loader';
import Footer from './footer';
import '../styles/homepage.css';

const Homepage = () => {
  const navigate = useNavigate();
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const options = [
    { label: "Prepare", icon: "prepare", path: "prepare" },
    { label: "Practice", icon: "practice", path: "practice" },
    { label: "Participate", icon: "participate", path: "participate" }
  ];

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  if (!isPageLoaded) {
    return <Loader />;
  }

  return (
    <>
      <div className="homepage-container">
        <div className="homepage-main-title">
          <img src={`${import.meta.env.BASE_URL}icons/sparkle.svg`} alt="sparkleIcon" />
          <h1>Math<span>In</span></h1>
          <img src={`${import.meta.env.BASE_URL}icons/sparkle.svg`} alt="sparkleIcon" />
        </div>

        <h2 className="homepage-sub-title">Math at Ease !</h2>

        <div className="homepage-options">
          {options.map((option) => (
            <button className="homepage-options-btn" key={option.label} onClick={() => navigate(option.path, { replace: true })}>
              <img src={`${import.meta.env.BASE_URL}icons/${option.icon}.svg`} alt={`${option.icon}Icon`} />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Homepage;
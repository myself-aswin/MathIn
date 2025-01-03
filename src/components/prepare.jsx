// prepare.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/prepare.css';
import Loader from './loader';
import Footer from './footer';

const Prepare = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    navigate('/', { replace: true });
  };

  const handleDownload = () => {
    setLoading(true);
    const link = document.createElement('a');
    link.href = `${import.meta.env.BASE_URL}content/mathIn.pdf`;
    link.download = 'mathIn.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="prepare-box1">
      {loading && <Loader />}

      <div className="prepare-box2">
        <div className="prepare-box3">
          <button className="prepare-download-btn" onClick={handleDownload}>
            <img className="prepare-download-icon" src={`${import.meta.env.BASE_URL}icons/download.svg`} alt="downloadIcon" />
          </button>

          <div className="prepare-title">
            <img src={`${import.meta.env.BASE_URL}icons/sparkle.svg`} alt="sparkleIcon" />
            <h1>Math<span>In</span></h1>
            <img src={`${import.meta.env.BASE_URL}icons/sparkle.svg`} alt="sparkleIcon" />
          </div>

          <button className="prepare-close-btn" onClick={handleClose}>
            <img src={`${import.meta.env.BASE_URL}icons/xMark.svg`} alt="closeIcon" />
          </button>
        </div>

        <div className="prepare-box4">
          <img src={`${import.meta.env.BASE_URL}content/mathInContent1.svg`} alt="mathInContent1" />
          <img src={`${import.meta.env.BASE_URL}content/mathInContent2.svg`} alt="mathInContent2" />
          <img src={`${import.meta.env.BASE_URL}content/mathInContent3.svg`} alt="mathInContent3" />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Prepare;
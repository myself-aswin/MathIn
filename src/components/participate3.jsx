// participate3.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FirebaseTestResult1 } from './firebase1';
import { FirebaseTestResult2 } from './firebase2';

import '../styles/participate3.css';
import Loader from './loader';
import Footer from './footer';
import Certificate from './certificate';

const Participate3 = ({ score, totalQuestions }) => {
  const navigate = useNavigate();
  const [testResultUpdated, setTestResultUpdated] = useState(false);
  const [certificateViewed, setCertificateViewed] = useState(false);
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const scorePercentage = ((score / totalQuestions) * 100).toFixed(1);

  const handleViewed = () => {
    setCertificateViewed(true);
  };

  const handleClose = () => {
    if (!certificateViewed) {
      window.alert('Be sure to fetch your certificate before leaving !');
    } else {
      navigate('/', { replace: true });
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!certificateViewed) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [certificateViewed]);

  useEffect(() => {
    if (scorePercentage >= 99) {
      handleTestResultUpdate();
    }
  }, [scorePercentage]);

  const handleTestResultUpdate = async () => {
    try {
      if (userData) {
        await FirebaseTestResult1(userData.email);
        await FirebaseTestResult2(userData.email, userData.name);
        setTestResultUpdated(true);
      }
    } catch (error) {
      console.error("Error occurred while updating test results: ", error);
      alert("Sorry, error occurred while updating test results. Try again later !");
    }
  };

  return (
    (scorePercentage >= 99) ? (!testResultUpdated ? (<Loader />) :
      (<>
        <div className="participate3-container">
          <div className="participate3-subcontainer1">
            <div className="participate3-main-title">
              <img src={`${import.meta.env.BASE_URL}icons/sparkle.svg`} alt="sparkleIcon" />
              <h1>Math<span>In</span></h1>
              <img src={`${import.meta.env.BASE_URL}icons/sparkle.svg`} alt="sparkleIcon" />
            </div>

            <button className="participate3-close-btn" onClick={handleClose}>
              <img src={`${import.meta.env.BASE_URL}icons/xMark.svg`} alt="closeIcon" />
            </button>
          </div>

          <div className="participate3-subcontainer2">
            <h2 className="participate3-header">MathIn Pro <span>- Certification</span></h2>
            <h1 className="participate3-subtitle1">🎉 Kudos !</h1>
            <div className="participate3-subtitle2 blink-animation">
              <img className="participate3-icon" src={`${import.meta.env.BASE_URL}icons/circleTick.svg`} alt="correctIcon" />
              <span>Test Passed</span>
            </div>
            <div className="participate3-result">You scored &nbsp;{score} / {totalQuestions} &nbsp;&nbsp;<span>({scorePercentage} %)</span></div>
            <Certificate onViewed={handleViewed} />
          </div>
        </div>

        <Footer />
      </>)) :

      (<>
        <div className="participate3-container">
          <div className="participate3-subcontainer1">
            <div className="participate3-main-title">
              <img src={`${import.meta.env.BASE_URL}icons/sparkle.svg`} alt="sparkleIcon" />
              <h1>Math<span>In</span></h1>
              <img src={`${import.meta.env.BASE_URL}icons/sparkle.svg`} alt="sparkleIcon" />
            </div>

            <button className="participate3-close-btn" onClick={() => navigate('/', { replace: true })}>
              <img src={`${import.meta.env.BASE_URL}icons/xMark.svg`} alt="closeIcon" />
            </button>
          </div>

          <div className="participate3-subcontainer2">
            <h2 className="participate3-header">MathIn Pro <span>- Certification</span></h2>
            <h1 className="participate3-subtitle1">🥺 Prepare well & try again !</h1>
            <div className="participate3-subtitle2 blink-animation">
              <img className="participate3-icon" src={`${import.meta.env.BASE_URL}icons/circleX.svg`} alt="wrongIcon" />
              <span>Test Failed</span>
            </div>
            <div className="participate3-result">You scored &nbsp;{score} / {totalQuestions} &nbsp;&nbsp;<span>({scorePercentage} %)</span></div>
          </div>
        </div>

        <Footer />
      </>)
  );
};

Participate3.propTypes = {
  score: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
};

export default Participate3;
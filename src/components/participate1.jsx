// participate1.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { FirebaseTestSetup } from './firebase0';
import Participate2 from './participate2';
import Countdown from './countdown';
import Footer from './footer';
import '../styles/participate1.css';

const Participate1 = ({ onBack }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameValid, setNameValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [showParticipate2, setShowParticipate2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(false);

  useEffect(() => {
    const nameInput = document.getElementById('name-field');
    if (nameInput) {
      nameInput.focus();
    }
  }, []);

  const handleNameChange = (event) => {
    const value = event.target.value;
    setName(value);
    setNameValid(event.target.checkValidity());
  };

  const handleEmailChange = (event) => {
    const value = event.target.value;
    setEmail(value);
    setEmailValid(event.target.checkValidity());
  };

  const isFormValid = nameValid && emailValid;

  const handleProceed = async (e) => {
    e.preventDefault();

    if (isFormValid) {
      if (!navigator.onLine) {
        alert("No internet connection. Please connect to the internet and try again !");
        return;
      }

      setLoading(true);

      try {
        const response = await FirebaseTestSetup(email, name);

        if (response.allowed) {
          sessionStorage.setItem("userData", JSON.stringify({ email, name }));
          setName('');
          setEmail('');
          setCountdown(true);
          setTimeout(() => {
            setCountdown(false);
            setShowParticipate2(true);
          }, 6000);
        } else {
          alert(response.message);
        }
      } catch (error) {
        alert("An error occurred while connecting to the server. Please try again !");
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please enter valid data to proceed !");
    }
  };

  const handleClose = () => {
    navigate('/', { replace: true });
  };

  return (
    showParticipate2 ? (<Participate2 />) : countdown ? (<Countdown />) : (
      <>
        <div className="participate1-container">
          <div className="participate1-subcontainer1">
            <button className='participate1-back-button' onClick={onBack} aria-label="Back">
              <img src={`${import.meta.env.BASE_URL}icons/arrowLeft.svg`} alt="backIcon" />
            </button>

            <div className="participate1-main-title">
              <img src={`${import.meta.env.BASE_URL}icons/sparkle.svg`} alt="sparkleIcon" />
              <h1>Math<span>In</span></h1>
              <img src={`${import.meta.env.BASE_URL}icons/sparkle.svg`} alt="sparkleIcon" />
            </div>

            <button className="participate1-close-btn" onClick={handleClose} aria-label="Close">
              <img src={`${import.meta.env.BASE_URL}icons/xMark.svg`} alt="closeIcon" />
            </button>
          </div>

          <div className="participate1-subcontainer2">
            <h2 className="participate1-subtitle1">MathIn Pro <span>- Certification</span></h2>
            <h3 className="participate1-subtitle2">Kindly provide your name and email address to continue to the test</h3>
            <form>
              <div className="input-area">
                <label htmlFor="name-field">Name : </label>
                <input
                  type="text"
                  id="name-field"
                  className="input-field"
                  title="Enter your name carefully"
                  maxLength={32}
                  pattern="[a-zA-Z\s]+"
                  required
                  onChange={handleNameChange}
                />
                <span>
                  {!nameValid && <img className="validation-tick" src={`${import.meta.env.BASE_URL}icons/tickOff.svg`} alt="tickOffIcon" />}
                  {nameValid && <img className="validation-tick" src={`${import.meta.env.BASE_URL}icons/tickOn.svg`} alt="tickOnIcon" />}
                </span>
              </div>

              <div className="input-area">
                <label htmlFor="email-field">Email : </label>
                <input
                  type="email"
                  id="email-field"
                  className="input-field"
                  title="Enter your Email address"
                  required
                  onChange={handleEmailChange}
                />
                <span>
                  {!emailValid && <img className="validation-tick" src={`${import.meta.env.BASE_URL}icons/tickOff.svg`} alt="tickOffIcon" />}
                  {emailValid && <img className="validation-tick" src={`${import.meta.env.BASE_URL}icons/tickOn.svg`} alt="tickOnIcon" />}
                </span>
              </div>
            </form>
          </div>

          {loading ? (
            <div className="participate1-loader-container">
              <div className="participate1-loader"></div>
            </div>
          ) : isFormValid ? (
            <button
              className='participate1-proceed-btn-enabled'
              type="submit"
              onClick={handleProceed}
            >
              <span>Proceed</span>
              <img className='participate1-proceed-icon' src={`${import.meta.env.BASE_URL}icons/arrowRight.svg`} alt="proceedIcon" />
            </button>
          ) : (
            <button className='participate1-proceed-btn-disabled' disabled={!isFormValid}>
              <span>Proceed</span>
            </button>
          )}
        </div>

        <Footer />
      </>
    )
  );
};

Participate1.propTypes = {
  onBack: PropTypes.func.isRequired,
};

export default Participate1;
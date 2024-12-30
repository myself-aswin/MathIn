// participate0.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Participate1 from './participate1';
import Loader from './loader';
import Footer from './footer';
import '../styles/participate0.css';

const squareTickHoverIcon = `${import.meta.env.BASE_URL}icons/squareTickHover.svg`;
const squareTickOnIcon = `${import.meta.env.BASE_URL}icons/squareTickOn.svg`;
const squareTickOffIcon = `${import.meta.env.BASE_URL}icons/squareTickOff.svg`;

const Participate0 = () => {
  const navigate = useNavigate();
  const [checkBoxIcon, setCheckBoxIcon] = useState(squareTickOffIcon);
  const [checkBoxOnStatus, setCheckBoxOnStatus] = useState(false);
  const [isParticipate1Open, setIsParticipate1Open] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const checkBoxClicked = () => {
    setCheckBoxOnStatus(!checkBoxOnStatus);
    setCheckBoxIcon(!checkBoxOnStatus ? squareTickOnIcon : squareTickHoverIcon);
  };

  const handleProceed = () => {
    setIsParticipate1Open(true);
  };

  const handleCloseParticipate1 = () => {
    setIsParticipate1Open(false);
  };

  const handleClose = () => {
    navigate('/', { replace: true });
  };

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  if (!isPageLoaded) {
    return <Loader />;
  }

  return (
    <>
      {isParticipate1Open ? (<Participate1 onBack={handleCloseParticipate1} />) :
        (<>
          <div className="participate0-container">
            <div className="participate0-subcontainer">
              <div className="participate0-main-title">
                <img src={`${import.meta.env.BASE_URL}icons/sparkle.svg`} alt="sparkleIcon" />
                <h1>Math<span>In</span></h1>
                <img src={`${import.meta.env.BASE_URL}icons/sparkle.svg`} alt="sparkleIcon" />
              </div>

              <button className="participate0-close-btn" onClick={handleClose}>
                <img src={`${import.meta.env.BASE_URL}icons/xMark.svg`} alt="closeIcon" />
              </button>
            </div>

            <div className="participate0-instructions-container">
              <h2 className='participate0-instructions-title'>MathIn Pro <span>- Certification</span></h2>

              <div className="participate0-instruction-item">
                <p><span>1.</span> Welcome to the <span className="participate0-highlight">MathIn Pro</span> Certification Test.</p>
              </div>

              <div className="participate0-instruction-item">
                <p><span>2.</span> The test consists of <span className="participate0-highlight">200 questions</span> -- (100 standard and 100 reverse). Each question is timed at <span className="participate0-highlight">6 seconds</span>, making the total test duration <span className="participate0-highlight">20 minutes</span>.</p>
              </div>

              <div className="participate0-instruction-item">
                <p><span>3.</span> To qualify for certification, you must score at least <span className="participate0-highlight">99%</span>. The certification is valid for <span className="participate0-highlight">4 months</span>.</p>
              </div>

              <div className="participate0-instruction-item">
                <p><span>4.</span> You are permitted <span className="participate0-highlight">2 attempts</span> per day to take the test.</p>
              </div>

              <div className="participate0-instruction-item">
                <p><span>5.</span> Please ensure you are fully prepared and avoid any unfair practices. Take the test with proper practice and full focus. <span className="participate0-highlight">&nbsp;Good luck !</span></p>
              </div>

              <button
                className='participate0-agreement'
                onMouseEnter={() => {
                  if (!checkBoxOnStatus) {
                    setCheckBoxIcon(squareTickHoverIcon);
                  }
                }}
                onMouseLeave={() => {
                  if (!checkBoxOnStatus) {
                    setCheckBoxIcon(squareTickOffIcon);
                  }
                }}
                onClick={checkBoxClicked}>
                <img src={checkBoxIcon} alt="checkBoxIcon" className="participate0-agreement-icon" />
                <span>I agree to the above Terms & Conditions and proceed to the test.</span>
              </button>
            </div>

            {checkBoxOnStatus ? (
              <button className="participate0-proceed-btn-enabled" onClick={handleProceed}>
                <span>Proceed</span>
                <img className="participate0-proceed-icon" src={`${import.meta.env.BASE_URL}icons/arrowRight.svg`} alt="proceedIcon" />
              </button>
            ) : (
              <button className="participate0-proceed-btn-disabled" disabled={!checkBoxOnStatus}>
                <span>Proceed</span>
              </button>
            )}
          </div>

          <Footer />
        </>)
      }
    </>
  );
};

export default Participate0;
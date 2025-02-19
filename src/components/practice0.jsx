// practice0.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/practice0.css';
import Loader from './loader';
import Footer from './footer';
import Practice1a from './practice1a';
import Practice2 from './practice2';

const Practice0 = () => {
  const navigate = useNavigate();
  const [currentPractice, setCurrentPractice] = useState(null);
  const [practiceDetails, setPracticeDetails] = useState({ fulltitle: [], screen: '' });
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const playOptions = [
    { title: 'Tables', subtitle: '(20x20)', screen: 'Tables20x20' },
    { title: 'Squares', subtitle: '(30)', screen: 'Squares30' },
    { title: 'Cubes', subtitle: '(12)', screen: 'Cubes12' },
    { title: 'Powers of 2', subtitle: '(12)', screen: 'Powersof2' },
    { title: 'Powers of 3', subtitle: '(6)', screen: 'Powersof3' },
    { title: 'Reciprocals', subtitle: '(12)', screen: 'Reciprocals12' },
  ];

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  const handlePracticeClick = (option) => {
    setPracticeDetails({ fulltitle: [option.title, option.subtitle], screen: option.screen });

    if (option.title === 'Tables') {
      setCurrentPractice('Practice1a');
    } else {
      setCurrentPractice('Practice2');
    }
  };

  const handleClose = () => {
    navigate('/', { replace: true });
  };

  if (!isPageLoaded) {
    return <Loader />;
  }

  return (
    currentPractice === null ? (
      <>
        <div className="practice0-container">
          <div className='practice0-subcontainer'>
            <div className="practice0-main-title">
              <img src={`${import.meta.env.BASE_URL}icons/sparkle.svg`} alt="sparkleIcon" />
              <h1>Math<span>In</span></h1>
              <img src={`${import.meta.env.BASE_URL}icons/sparkle.svg`} alt="sparkleIcon" />
            </div>

            <button className="practice0-close-btn" onClick={handleClose}>
              <img src={`${import.meta.env.BASE_URL}icons/xMark.svg`} alt="closeIcon" />
            </button>
          </div>

          <button className='practice0-subtitle-btn' onClick={() => handlePracticeClick({ title: 'Practice', subtitle: '(Full)', screen: 'Practice(Full)' })}>
            Practice (Full)
          </button>

          <div className="practice0-play-options">
            {playOptions.map((option) => (
              <button className="practice0-button" key={option.screen} onClick={() => handlePracticeClick(option)}>
                {option.title}&nbsp;{option.subtitle}
              </button>
            ))}
          </div>
        </div>

        <Footer />
      </>
    ) :

      (
        currentPractice === 'Practice1a' ? (
          <Practice1a
            onBackButtonClick={() => setCurrentPractice(null)}
          />
        ) : (
          <Practice2
            fulltitle={practiceDetails.fulltitle}
            screen={practiceDetails.screen}
            onBackButtonClick={() => setCurrentPractice(null)}
          />
        )
      )
  );
};

export default Practice0;
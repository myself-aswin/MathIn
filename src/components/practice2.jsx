// practice2.jsx

import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

import '../styles/practice2.css';
import Footer from './footer';

import MathInDB from '../assets/mathIn.json';

const Practice2 = ({ fulltitle, screen, onBackButtonClick }) => {
  const inputRef = useRef(null);
  const timeOutId = useRef(null);
  const timeLimit = (6 * 1000);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [reverseBtn, setReverseBtn] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showCorrectIcon, setShowCorrectIcon] = useState(false);
  const [showWrongIcon, setShowWrongIcon] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState();
  const [progress, setProgress] = useState(0);
  const [blink, setBlink] = useState(false);

  const fetchRandomQuestion = useCallback(() => {
    if (reverseBtn) {
      const values = Object.values(MathInDB[screen]);
      const randomIndex = Math.floor(Math.random() * values.length);
      setCurrentQuestion(values[randomIndex]);
    } else {
      const keys = Object.keys(MathInDB[screen]);
      const randomIndex = Math.floor(Math.random() * keys.length);
      setCurrentQuestion(keys[randomIndex]);
    }
    setUserInput('');
    setShowCorrectIcon(false);
    setShowWrongIcon(false);
    setAnswerSubmitted(false);
    setBlink(false);
  }, [reverseBtn, screen]);

  useEffect(() => {
    fetchRandomQuestion();
    inputRef.current.focus();
  }, [reverseBtn, fetchRandomQuestion]);

  useEffect(() => {
    if (!answerSubmitted) {
      setProgress(0);
      let start;

      const updateProgress = (timestamp) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const newProgress = Math.min((elapsed / timeLimit) * 100, 100);
        setProgress(newProgress);

        if (elapsed < timeLimit) {
          timeOutId.current = requestAnimationFrame(updateProgress);
        } else {
          handleSubmit();
        }
      };

      timeOutId.current = requestAnimationFrame(updateProgress);

      return () => {
        cancelAnimationFrame(timeOutId.current);
      };
    }
  }, [currentQuestion, answerSubmitted]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = useCallback(() => {
    cancelAnimationFrame(timeOutId.current);

    let correctAns;
    if (reverseBtn) {
      correctAns = [];
      const keys = Object.keys(MathInDB[screen]);
      for (const key of keys) {
        if (MathInDB[screen][key] === currentQuestion) {
          correctAns.push(key);
        }
      }
      setCorrectAnswers(correctAns.join(', '));

      const userInputArr = userInput.replace(/\s/g, "").toLowerCase().split(",");
      if (userInputArr.every(e => correctAns.includes(e))) {
        setShowCorrectIcon(true);
        setShowWrongIcon(false);
        triggerBlink();
      } else {
        setShowCorrectIcon(false);
        setShowWrongIcon(true);
        triggerBlink();
      }
    } else {
      correctAns = MathInDB[screen][currentQuestion];
      setCorrectAnswers(correctAns);
      if (userInput === correctAns) {
        setShowCorrectIcon(true);
        setShowWrongIcon(false);
        triggerBlink();
      } else {
        setShowCorrectIcon(false);
        setShowWrongIcon(true);
        triggerBlink();
      }
    }
    setAnswerSubmitted(true);
  }, [currentQuestion, reverseBtn, screen, userInput]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !answerSubmitted) {
      handleSubmit();
    } else if (e.key === 'Enter' && answerSubmitted) {
      handleReset();
    }
  };

  const handleButtonClick = () => {
    if (!answerSubmitted) {
      handleSubmit();
    } else {
      handleReset();
    }
    inputRef.current.focus();
  };

  const handleReset = () => {
    fetchRandomQuestion();
    setProgress(0);
  };

  const toggleReverse = () => {
    setReverseBtn((prev) => !prev);
    fetchRandomQuestion();
  };

  const triggerBlink = () => {
    setBlink(true);
    setTimeout(() => setBlink(false), 1200);
  };

  return (
    <>
      <div className="practice2-container">
        <div className='practice2-subcontainer1'>
          <button onClick={onBackButtonClick} className='practice2-back-button'>
            <img src={`${import.meta.env.BASE_URL}icons/arrowLeft.svg`} alt="backIcon" />
          </button>

          <div className="practice2-main-title">
            <img src={`${import.meta.env.BASE_URL}icons/sparkle.svg`} alt="sparkleIcon" />
            <h1>Math<span>In</span></h1>
            <img src={`${import.meta.env.BASE_URL}icons/sparkle.svg`} alt="sparkleIcon" />
          </div>
        </div>

        <div className='practice2-subcontainer2'>
          <div className='practice2-progress-bar'>
            <div className='practice2-progress' style={{ width: `${progress}%` }}></div>
          </div>

          <div className='practice2-header'>
            <h1 className='practice2-title'>
              <span>{fulltitle[0]}</span>&nbsp;
              <span>{fulltitle[1]}</span>
            </h1>

            {reverseBtn ? (
              <button className='practice2-toggleOnIcon' onClick={toggleReverse}>
                <img src={`${import.meta.env.BASE_URL}icons/toggleOn.svg`} alt="toggleOnIcon" />
              </button>
            ) : (
              <button className='practice2-toggleOffIcon' onClick={toggleReverse}>
                <img src={`${import.meta.env.BASE_URL}icons/toggleOff.svg`} alt="toggleOffIcon" />
              </button>
            )}
          </div>

          <div className="practice2-flexbox1">
            <h2 className="practice2-question">{currentQuestion}&nbsp;=&nbsp;?</h2>
            <div className="practice2-flexbox2">
              <input
                type="text"
                id="practice2-input"
                className="practice2-input"
                ref={inputRef}
                value={userInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
              />
              <button className="practice2-input-btn" onClick={handleButtonClick}>
                <img className="practice2-input-icon" src={`${import.meta.env.BASE_URL}icons/arrowRight.svg`} alt="arrowRightIcon" />
              </button>

              {(showCorrectIcon || showWrongIcon) ? (
                showCorrectIcon ? (
                  <img className={`practice2-correct-icon ${blink ? 'blink-animation' : ''}`} src={`${import.meta.env.BASE_URL}icons/circleTick.svg`} alt="circleTickIcon" />
                ) : (
                  <img className={`practice2-wrong-icon ${blink ? 'blink-animation' : ''}`} src={`${import.meta.env.BASE_URL}icons/circleX.svg`} alt="circleXIcon" />
                )
              ) : (
                <img style={{ visibility: 'hidden' }} className='practice2-correct-icon' src={`${import.meta.env.BASE_URL}icons/placeholder.svg`} alt="placeholderIcon" />
              )}
            </div>
          </div>

          <div className='practice2-flexbox3' style={{ display: answerSubmitted ? 'flex' : 'none' }}>
            <div className='practice2-answers1'><span>Correct Answer</span> :</div>
            <div className='practice2-answers2'>{correctAnswers}</div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

Practice2.propTypes = {
  fulltitle: PropTypes.array.isRequired,
  screen: PropTypes.string.isRequired,
  onBackButtonClick: PropTypes.func.isRequired,
};

export default Practice2;
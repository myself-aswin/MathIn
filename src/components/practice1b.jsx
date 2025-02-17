// practice1b.jsx

import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import '../styles/practice1b.css';

const Practice1b = ({ combinedObject, onBackButtonClick }) => {
  const inputRef = useRef(null);
  const timeOutId = useRef(null);
  const timeLimit = 6 * 1000; // 6 seconds
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
      const values = Object.values(combinedObject);
      const randomIndex = Math.floor(Math.random() * values.length);
      setCurrentQuestion(values[randomIndex]);
    } else {
      const keys = Object.keys(combinedObject);
      const randomIndex = Math.floor(Math.random() * keys.length);
      setCurrentQuestion(keys[randomIndex]);
    }
    setUserInput('');
    setShowCorrectIcon(false);
    setShowWrongIcon(false);
    setAnswerSubmitted(false);
    setBlink(false);
  }, [reverseBtn, combinedObject]);

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
      const keys = Object.keys(combinedObject);
      for (const key of keys) {
        if (combinedObject[key] === currentQuestion) {
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
      correctAns = combinedObject[currentQuestion];
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
  }, [currentQuestion, reverseBtn, userInput]);

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
      <div className="practice1b-container">
        <div className="practice1b-subcontainer1">
          <button onClick={onBackButtonClick} className="practice1b-back-button">
            <img src={`${import.meta.env.BASE_URL}icons/arrowLeft.svg`} alt="backIcon" />
          </button>

          <div className="practice1b-main-title">
            <img src={`${import.meta.env.BASE_URL}icons/sparkle.svg`} alt="sparkleIcon" />
            <h1>Math<span>In</span></h1>
            <img src={`${import.meta.env.BASE_URL}icons/sparkle.svg`} alt="sparkleIcon" />
          </div>
        </div>

        <div className="practice1b-subcontainer2">
          <div className="practice1b-progress-bar">
            <div className="practice1b-progress" style={{ width: `${progress}%` }}></div>
          </div>

          <div className="practice1b-header">
            <h1 className="practice1b-title">
              <span>Tables</span>&nbsp;
              <span>(20x20)</span>
            </h1>

            {reverseBtn ? (
              <button className="practice1b-toggleOnIcon" onClick={toggleReverse}>
                <img src={`${import.meta.env.BASE_URL}icons/toggleOn.svg`} alt="toggleOnIcon" />
              </button>
            ) : (
              <button className="practice1b-toggleOffIcon" onClick={toggleReverse}>
                <img src={`${import.meta.env.BASE_URL}icons/toggleOff.svg`} alt="toggleOffIcon" />
              </button>
            )}
          </div>

          <div className="practice1b-flexbox1">
            <h2 className="practice1b-question">{currentQuestion}&nbsp;=&nbsp;?</h2>
            <div className="practice1b-flexbox2">
              <input
                type="text"
                id="practice1b-input"
                className="practice1b-input"
                ref={inputRef}
                value={userInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
              />
              <button className="practice1b-input-btn" onClick={handleButtonClick}>
                <img className="practice1b-input-icon" src={`${import.meta.env.BASE_URL}icons/arrowRight.svg`} alt="arrowRightIcon" />
              </button>

              {(showCorrectIcon || showWrongIcon) ? (
                showCorrectIcon ? (
                  <img className={`practice1b-correct-icon ${blink ? 'blink-animation' : ''}`} src={`${import.meta.env.BASE_URL}icons/circleTick.svg`} alt="circleTickIcon" />
                ) : (
                  <img className={`practice1b-wrong-icon ${blink ? 'blink-animation' : ''}`} src={`${import.meta.env.BASE_URL}icons/circleX.svg`} alt="circleXIcon" />
                )
              ) : (
                <img style={{ visibility: 'hidden' }} className="practice1b-correct-icon" src={`${import.meta.env.BASE_URL}icons/placeholder.svg`} alt="placeholderIcon" />
              )}
            </div>
          </div>

          <div className="practice1b-flexbox3" style={{ display: answerSubmitted ? 'flex' : 'none' }}>
            <div className="practice1b-answers1"><span>Correct Answer</span> :</div>
            <div className="practice1b-answers2">{correctAnswers}</div>
          </div>
        </div>
      </div>
    </>
  );
};

Practice1b.propTypes = {
  combinedObject: PropTypes.object.isRequired,
  onBackButtonClick: PropTypes.func.isRequired,
};

export default Practice1b;
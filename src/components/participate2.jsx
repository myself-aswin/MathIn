// participate2.jsx

import { useState, useEffect, useRef, useCallback } from 'react';

import Participate3 from './participate3';
import Footer from './footer';
import '../styles/participate2.css';
import MathInDB from '../assets/mathIn.json';

const Participate2 = () => {
  const questionBankCount = 200;
  const timeLimit = (4.5 * 1000);
  const inactivityLimit = (10 * 60 * 1000);

  const inputRef = useRef(null);
  const timeOutId = useRef(null);
  const inactivityTimeoutId = useRef(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [questionBank, setQuestionBank] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userInput, setUserInput] = useState('');

  const prepareQuestionBank = useCallback(() => {
    const forwardQuestions = [];
    const reverseMap = {};
    const uniqueQuestionsSet = new Set();

    Object.entries(MathInDB["Practice(Full)"]).forEach(([question, answer]) => {
      const forwardQuestion = { question, answer: [answer] };
      if (!uniqueQuestionsSet.has(question)) {
        forwardQuestions.push(forwardQuestion);
        uniqueQuestionsSet.add(question);
      }
      reverseMap[answer] = reverseMap[answer] ? [...reverseMap[answer], question] : [question];
    });

    const reverseQuestions = Object.entries(reverseMap).map(([answer, questions]) => ({
      question: answer,
      answer: questions,
    }));

    reverseQuestions.forEach(({ question, answer }) => {
      if (!uniqueQuestionsSet.has(question)) {
        forwardQuestions.push({ question, answer });
        uniqueQuestionsSet.add(question);
      }
    });

    const preparedQuestionBank = forwardQuestions.sort(() => Math.random() - 0.5).slice(0, questionBankCount);
    setQuestionBank(preparedQuestionBank);
    setCurrentQuestionIndex(0);
    setScore(0);
  }, []);

  const fetchQuestion = useCallback(() => {
    if (questionBank.length > 0) {
      const question = questionBank[currentQuestionIndex]?.question || '';
      setCurrentQuestion(question);
      setUserInput('');
      setAnswerSubmitted(false);
      setQuestionNumber(currentQuestionIndex + 1);
    }
  }, [questionBank, currentQuestionIndex]);

  useEffect(() => {
    prepareQuestionBank();
  }, [prepareQuestionBank]);

  useEffect(() => {
    if (questionBank.length > 0) {
      fetchQuestion();
      inputRef.current.focus();
    }
  }, [fetchQuestion, questionBank]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };

    if (!showResult) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [showResult]);

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

  useEffect(() => {
    const handleInactivity = () => {
      setShowResult(true);
    };

    inactivityTimeoutId.current = setTimeout(handleInactivity, inactivityLimit);

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimeoutId.current);
      inactivityTimeoutId.current = setTimeout(handleInactivity, inactivityLimit);
    };

    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keypress', resetInactivityTimer);

    return () => {
      clearTimeout(inactivityTimeoutId.current);
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keypress', resetInactivityTimer);
    };
  }, []);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = useCallback(() => {
    cancelAnimationFrame(timeOutId.current);

    const correctAnswers = questionBank[currentQuestionIndex]?.answer || [];
    const userAnswers = userInput.split(',').map((ans) => ans.trim().toLowerCase());

    let isCorrect;

    if (userAnswers.length === 1) {
      isCorrect = correctAnswers.includes(userAnswers[0]);
    } else {
      isCorrect = userAnswers.every((userAns) => correctAnswers.includes(userAns));
    }

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    setAnswerSubmitted(true);
  }, [currentQuestionIndex, questionBank, userInput]);

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
    if (currentQuestionIndex + 1 < questionBank.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
    }
    setProgress(0);
  };

  const handleCloseTest = () => {
    if (window.confirm('Are you sure you want to close the test? Your progress will be lost !')) {
      setShowResult(true);
    }
  };

  return (
    <>
      {showResult ?
        (<Participate3 score={score} totalQuestions={questionBank.length} />) :
        (<>
          <div className="participate2-container">
            <div className='participate2-subcontainer1'>
              <div className="participate2-main-title">
                <img src={`${import.meta.env.BASE_URL}icons/sparkle.svg`} alt="sparkleIcon" />
                <h1>Math<span>In</span></h1>
                <img src={`${import.meta.env.BASE_URL}icons/sparkle.svg`} alt="sparkleIcon" />
              </div>

              <button className="participate2-close-btn" onClick={handleCloseTest}>
                <img src={`${import.meta.env.BASE_URL}icons/xMark.svg`} alt="closeIcon" />
              </button>
            </div>

            <div className='participate2-subcontainer2'>
              <div className='participate2-progress-bar'>
                <div className='participate2-progress' style={{ width: `${progress}%` }}></div>
              </div>

              <h2 className="participate2-title">MathIn Pro <span>- Certification</span></h2>

              <div className="participate2-flexbox0">
                <div className="participate2-questioncount">
                  <span>&#40;</span>{questionNumber}|{questionBankCount}<span>&#41;</span>
                </div>

                <div className="participate2-flexbox1">
                  <h2 className="participate2-question">{currentQuestion}&nbsp;=&nbsp;?</h2>
                  <div className="participate2-flexbox2">
                    <input
                      type="text"
                      id="participate2-input"
                      className="participate2-input"
                      ref={inputRef}
                      value={userInput}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyPress}
                      autoComplete="new-password"
                      autoCorrect="off"
                      autoCapitalize="off"
                    />
                    <button className="participate2-input-btn" onClick={handleButtonClick}>
                      <img className="participate2-input-icon" src={`${import.meta.env.BASE_URL}icons/arrowRight.svg`} alt="arrowRightIcon" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </>)
      }
    </>
  );
};

export default Participate2;
// practice1a.jsx

import { useState } from 'react';
import PropTypes from 'prop-types';

import '../styles/practice1a.css';
import Footer from './footer';
import Practice1b from './practice1b';

import MathInDB from '../assets/mathIn.json';

const Practice1a = ({ onBackButtonClick }) => {
  const allTables = [2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  const [selectedTables, setSelectedTables] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('practice1a');
  const [combinedObject, setCombinedObject] = useState({});

  const handleSelection = (table) => {
    setSelectedTables((prev) =>
      prev.includes(table) ? prev.filter((t) => t !== table) : [...prev, table]
    );
  };

  const handleSelectAll = () => {
    setSelectedTables((prev) => (prev.length === allTables.length ? [] : allTables));
    setSelectAll((prev) => !prev);
  };

  const prepareCombinedObject = () =>
    selectedTables.reduce((acc, table) => {
      const tableKey = `Table${table}`;
      return MathInDB[tableKey] ? { ...acc, ...MathInDB[tableKey] } : acc;
    }, {});

  const handleProceed = () => {
    setCombinedObject(prepareCombinedObject());
    setCurrentScreen('practice1b');
  };

  return (
    <>
      {currentScreen === 'practice1a' && (
        <div className="practice1a-container">
          <div className="practice1a-subcontainer1">
            <button onClick={onBackButtonClick} className="practice1a-back-button">
              <img src={`${import.meta.env.BASE_URL}icons/arrowLeft.svg`} alt="Back" />
            </button>

            <div className="practice1a-main-title">
              <img src={`${import.meta.env.BASE_URL}icons/sparkle.svg`} alt="Sparkle" />
              <h1>Math<span>In</span></h1>
              <img src={`${import.meta.env.BASE_URL}icons/sparkle.svg`} alt="Sparkle" />
            </div>
          </div>

          <div className="practice1a-flexbox">
            <div className="practice1a-subtitle"><span>Choose your tables !</span></div>

            <div className="practice1a-all-btn">
              <input type="checkbox" id="select-all" checked={selectAll} onChange={handleSelectAll} />
              <label htmlFor="select-all" className="select-all">All</label>
            </div>
          </div>

          <div className="practice1a-btn-grid">
            {allTables.map((num) => (
              <div key={num} className="table-item">
                <input
                  type="checkbox"
                  id={`table-${num}`}
                  checked={selectedTables.includes(num)}
                  onChange={() => handleSelection(num)}
                />
                <label htmlFor={`table-${num}`} className="table-label">
                  {num}
                </label>
              </div>
            ))}
          </div>

          {selectedTables.length ? (
            <button className="practice1a-proceed-btn-enabled" onClick={handleProceed}>
              <span>Proceed</span>
              <img className="practice1a-proceed-icon" src={`${import.meta.env.BASE_URL}icons/arrowRight.svg`} alt="proceedIcon" />
            </button>
          ) : (
            <button className="practice1a-proceed-btn-disabled" disabled={!selectedTables.length}>
              <span>Proceed</span>
            </button>
          )}
        </div>
      )}

      {currentScreen === 'practice1b' && <Practice1b combinedObject={combinedObject} onBackButtonClick={() => setCurrentScreen('practice1a')} />}

      <Footer />
    </>
  );
};

Practice1a.propTypes = {
  onBackButtonClick: PropTypes.func.isRequired
};

export default Practice1a;
// src/components/AptitudeQuiz.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './AptitudeQuiz.css'; // Create and style as needed

// Updated question set with 15 questions each
const questionsDB = {
  'time-and-distance': [
    { question: 'A train travels 60 km in 1 hour. What is the speed?', options: ['60 km/h', '30 km/h', '90 km/h', '120 km/h'], answer: '60 km/h' },
    { question: 'A car covers 150 km in 3 hours. What is its speed?', options: ['50 km/h', '45 km/h', '55 km/h', '60 km/h'], answer: '50 km/h' },
    { question: 'If speed is 40 km/h, what distance will be covered in 2 hours?', options: ['80 km', '60 km', '100 km', '70 km'], answer: '80 km' },
    { question: 'If a person walks at 5 km/h for 4 hours, what distance is covered?', options: ['20 km', '15 km', '25 km', '18 km'], answer: '20 km' },
    { question: 'Distance between two stations is 300 km. A train takes 5 hours. What is the speed?', options: ['60 km/h', '55 km/h', '50 km/h', '65 km/h'], answer: '60 km/h' },
    { question: 'Speed = 60 km/h and Time = 2.5 hrs. Find distance.', options: ['150 km', '140 km', '160 km', '120 km'], answer: '150 km' },
    { question: 'A cyclist covers 45 km in 3 hours. What is the speed?', options: ['15 km/h', '20 km/h', '18 km/h', '12 km/h'], answer: '15 km/h' },
    { question: 'If distance = 90 km and speed = 30 km/h, find time.', options: ['3 hours', '2 hours', '4 hours', '1.5 hours'], answer: '3 hours' },
    { question: 'A boy walks 12 km in 2 hours. Speed?', options: ['6 km/h', '5 km/h', '4 km/h', '3 km/h'], answer: '6 km/h' },
    { question: 'Bus takes 4 hours for 240 km. Speed?', options: ['60 km/h', '50 km/h', '55 km/h', '65 km/h'], answer: '60 km/h' },
    { question: 'If speed is doubled, time becomes?', options: ['Halved', 'Doubled', 'Same', 'Tripled'], answer: 'Halved' },
    { question: 'Distance = Speed × ?', options: ['Time', 'Distance', 'Speed', 'Rate'], answer: 'Time' },
    { question: 'If a car covers 100 km in 2 hours, avg speed is?', options: ['50 km/h', '60 km/h', '55 km/h', '70 km/h'], answer: '50 km/h' },
    { question: 'Boat goes 24 km downstream in 3 hrs. Speed?', options: ['8 km/h', '6 km/h', '10 km/h', '12 km/h'], answer: '8 km/h' },
    { question: '60 km/h speed for 0.5 hr. Distance?', options: ['30 km', '20 km', '25 km', '35 km'], answer: '30 km' }
  ],
  'profit-and-loss': [
    { question: 'If cost price is 100 and selling price is 120, what is the profit?', options: ['20', '10', '25', '30'], answer: '20' },
    { question: 'Profit = SP - ?', options: ['CP', 'Loss', 'Tax', 'None'], answer: 'CP' },
    { question: 'CP = 80, SP = 100. Profit %?', options: ['25%', '20%', '15%', '30%'], answer: '25%' },
    { question: 'Loss = CP - SP. CP=90, SP=70. Loss?', options: ['20', '10', '15', '25'], answer: '20' },
    { question: 'SP = 200, Profit = 50. CP?', options: ['150', '160', '140', '170'], answer: '150' },
    { question: 'Loss = 10, CP = 100. SP?', options: ['90', '100', '95', '85'], answer: '90' },
    { question: 'Profit % = (Profit / CP) × ?', options: ['100', '10', '50', '200'], answer: '100' },
    { question: 'SP = 180, Profit = 20%. CP?', options: ['150', '160', '140', '180'], answer: '150' },
    { question: 'CP = 250, Loss = 50. SP?', options: ['200', '220', '210', '230'], answer: '200' },
    { question: 'Profit of 10% on CP = 90. SP?', options: ['99', '100', '95', '110'], answer: '99' },
    { question: 'If CP = SP, then?', options: ['No profit no loss', 'Loss', 'Profit', 'None'], answer: 'No profit no loss' },
    { question: 'CP = 80, Profit = 25%. SP?', options: ['100', '105', '95', '90'], answer: '100' },
    { question: 'SP = 240, CP = 300. Loss?', options: ['60', '70', '80', '90'], answer: '60' },
    { question: 'Loss % = (Loss / CP) × ?', options: ['100', '10', '200', '50'], answer: '100' },
    { question: 'CP = 500, SP = 550. Profit %?', options: ['10%', '8%', '12%', '15%'], answer: '10%' }
  ],
   'speed-and-distance': [
    { question: 'A car travels 150 km in 3 hours. What is its speed?', options: ['40 km/h', '50 km/h', '60 km/h', '70 km/h'], answer: '50 km/h' },
    { question: 'Speed = Distance / ?', options: ['Area', 'Mass', 'Time', 'Acceleration'], answer: 'Time' },
    { question: 'If a train travels 180 km at 60 km/h, how much time does it take?', options: ['3 hours', '4 hours', '2 hours', '5 hours'], answer: '3 hours' },
    { question: 'If distance = 200 km and time = 4 hours, what is speed?', options: ['60 km/h', '50 km/h', '40 km/h', '30 km/h'], answer: '50 km/h' },
    { question: 'How long does it take to travel 90 km at 30 km/h?', options: ['3 hours', '2.5 hours', '2 hours', '1.5 hours'], answer: '3 hours' },
    { question: 'A cyclist covers 120 km in 4 hours. Find the speed.', options: ['25 km/h', '30 km/h', '35 km/h', '40 km/h'], answer: '30 km/h' },
    { question: 'Speed = ? / Time', options: ['Velocity', 'Distance', 'Force', 'Displacement'], answer: 'Distance' },
    { question: 'Time = Distance / ?', options: ['Speed', 'Mass', 'Volume', 'Area'], answer: 'Speed' },
    { question: 'Distance = Speed x ?', options: ['Mass', 'Time', 'Acceleration', 'Velocity'], answer: 'Time' },
    { question: 'A car moves at 90 km/h. How far will it go in 2 hours?', options: ['180 km', '90 km', '120 km', '150 km'], answer: '180 km' },
    { question: 'Train A runs at 60 km/h, Train B at 80 km/h. Who is faster?', options: ['Train A', 'Train B', 'Both equal', 'Can’t say'], answer: 'Train B' },
    { question: 'If speed increases, time to cover same distance will?', options: ['Increase', 'Decrease', 'Stay same', 'Double'], answer: 'Decrease' },
    { question: 'Time taken to cover 100 km at 50 km/h?', options: ['2 hours', '3 hours', '1.5 hours', '2.5 hours'], answer: '2 hours' },
    { question: 'A man covers 60 km in 1.5 hours. Speed?', options: ['40 km/h', '45 km/h', '50 km/h', '60 km/h'], answer: '40 km/h' },
    { question: 'To cover 200 km in 4 hours, required speed?', options: ['60 km/h', '50 km/h', '40 km/h', '30 km/h'], answer: '50 km/h' },
  ],

  'percentage': [
    { question: 'What is 20% of 150?', options: ['30', '25', '20', '35'], answer: '30' },
    { question: '50% of 200 is?', options: ['50', '100', '150', '200'], answer: '100' },
    { question: 'Increase 80 by 25%', options: ['90', '100', '105', '110'], answer: '100' },
    { question: 'What percent of 50 is 10?', options: ['10%', '20%', '30%', '40%'], answer: '20%' },
    { question: 'If a number is increased by 20%, it becomes 120. Original number?', options: ['100', '110', '90', '95'], answer: '100' },
    { question: 'Find 10% of 500.', options: ['50', '60', '40', '55'], answer: '50' },
    { question: '70 is what percent of 140?', options: ['25%', '50%', '75%', '100%'], answer: '50%' },
    { question: '20 is 25% of what number?', options: ['60', '70', '80', '90'], answer: '80' },
    { question: '60 increased by 10% is?', options: ['64', '66', '68', '70'], answer: '66' },
    { question: '30 decreased by 20% is?', options: ['20', '24', '25', '26'], answer: '24' },
    { question: '200 is increased by 15%. New value?', options: ['220', '225', '230', '235'], answer: '230' },
    { question: '15% of 300 is?', options: ['35', '40', '45', '50'], answer: '45' },
    { question: 'What percent of 80 is 64?', options: ['60%', '70%', '80%', '90%'], answer: '80%' },
    { question: 'Decrease 100 by 30%', options: ['60', '65', '70', '75'], answer: '70' },
    { question: 'What is 120% of 250?', options: ['300', '290', '280', '270'], answer: '300' },
  ],
};

const AptitudeQuiz = () => {
  const { topic } = useParams();
  const questions = questionsDB[topic] || [];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState('');
  const [showScore, setShowScore] = useState(false);

  const handleOptionClick = (option) => {
    setSelected(option);
    if (option === questions[currentQuestion].answer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelected('');
    } else {
      setShowScore(true);
    }
  };

  if (!questions.length) return <p>No questions available for this topic.</p>;

  return (
    <div className="quiz-container">
      <h2>{topic.replace(/-/g, ' ').toUpperCase()} Quiz</h2>
      {showScore ? (
        <div className="score-section">
          <h3>Quiz Completed!</h3>
          <p>Your score: {score} / {questions.length}</p>
        </div>
      ) : (
        <div className="question-card">
          <h4>Q{currentQuestion + 1}: {questions[currentQuestion].question}</h4>
          <div className="options">
            {questions[currentQuestion].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(option)}
                className={selected === option ? 'selected' : ''}
                disabled={!!selected}
              >
                {option}
              </button>
            ))}
          </div>
          {selected && (
            <button className="next-btn" onClick={nextQuestion}>Next</button>
          )}
        </div>
      )}
    </div>
  );
};

export default AptitudeQuiz;
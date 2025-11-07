import React, { useState } from "react";
import "./quiz.css";

const QuizCard = ({ question, index }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleOptionClick = (option) => {
    if (!showAnswer) {
      setSelectedOption(option);
      setShowAnswer(true);
    }
  };

  return (
    <div className="quiz-card">
      <h3 className="question-title">
        {index + 1}. {question.question}
      </h3>

      <div className="options">
        {question.options.map((option, i) => {
          const isCorrect = option === question.answer;
          const isSelected = option === selectedOption;

          let btnClass = "option-btn";
          if (showAnswer) {
            if (isCorrect) btnClass += " correct1";
            else if (isSelected) btnClass += " correct1";
            else btnClass += " disabled1";
          }

          return (
            <button
              key={i}
              onClick={() => handleOptionClick(option)}
              className={btnClass}
              disabled={showAnswer}
            >
              {String.fromCharCode(65 + i)}. {option}
            </button>
          );
        })}
      </div>

      {showAnswer && (
        <div className="answer-section fade-in">
          <p className="answer">✅ Correct Answer: {question.answer}</p>
          <p className="explanation">💡 {question.explanation}</p>
          <p className="difficulty">🔹 Difficulty: {question.difficulty}</p>
        </div>
      )}
    </div>
  );
};

export default QuizCard;

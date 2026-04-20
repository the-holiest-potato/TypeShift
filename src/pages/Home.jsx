import { useState, useEffect, useRef, useMemo } from "react";
import { generateWords } from "../wordGenerator";
import { useAuth } from "../context/AuthContext";

function Home() {
  const [testDuration, setTestDuration] = useState(30);
  const [currentText, setCurrentText] = useState(() => generateWords(100).join(" "));
  const [text, setText] = useState("");
  const [time, setTime] = useState(30);
  const [isTyping, setIsTyping] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [testFinished, setTestFinished] = useState(false);
  const [rawWpm, setRawWpm] = useState(0);
  const [lineOffset, setLineOffset] = useState(0);
  
  const { addTestResult } = useAuth();
  const inputRef = useRef(null);
  const wordsWrapperRef = useRef(null);
  const currentWordRef = useRef(null);

  // Split words for rendering - optimized with useMemo
  const splitWords = useMemo(() => currentText.split(" "), [currentText]);

  useEffect(() => {
    if (testFinished) {
      addTestResult({
        wpm,
        accuracy,
        rawWpm,
        mode: `time ${testDuration}`
      });
    }
  }, [testFinished]);

  useEffect(() => {
    let timer;
    if (isTyping) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            setIsTyping(false);
            setTestFinished(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTyping]);

  // Handle scrolling when the current word moves to a new line
  useEffect(() => {
    if (currentWordRef.current && wordsWrapperRef.current) {
      const currentWordTop = currentWordRef.current.offsetTop;
      const wrapperTop = wordsWrapperRef.current.offsetTop;
      const relativeTop = currentWordTop - wrapperTop;
      
      // If the word's top position is different from the current scroll offset,
      // it means we've moved to a new line (or it's the first line)
      if (relativeTop !== lineOffset) {
        setLineOffset(relativeTop);
      }
    }
  }, [text, splitWords]);

  const handleTyping = (e) => {
    if (testFinished) return;
    
    const value = e.target.value;
    
    // Infinite words: if we are near the end of current text, add more words
    if (value.length > currentText.length - 200) {
      const newWords = generateWords(50).join(" ");
      setCurrentText(prev => prev + " " + newWords);
    }

    if (!isTyping && value.length > 0) {
      setIsTyping(true);
    }

    setText(value);
    calculateStats(value);
  };

  const calculateStats = (inputText) => {
    const timeSpent = (testDuration - time) / 60; // in minutes
    if (timeSpent <= 0) return;

    let correctChars = 0;
    for (let i = 0; i < inputText.length; i++) {
      if (inputText[i] === currentText[i]) {
        correctChars++;
      }
    }

    const calculatedWpm = Math.round((correctChars / 5) / timeSpent);
    const calculatedRawWpm = Math.round((inputText.length / 5) / timeSpent);
    const calculatedAccuracy = inputText.length === 0 
      ? 100 
      : Math.round((correctChars / inputText.length) * 100);

    setWpm(calculatedWpm);
    setRawWpm(calculatedRawWpm);
    setAccuracy(calculatedAccuracy);
  };

  const restartTest = (duration = testDuration) => {
    setText("");
    setTime(duration);
    setIsTyping(false);
    setWpm(0);
    setRawWpm(0);
    setAccuracy(100);
    setTestFinished(false);
    setLineOffset(0);
    setCurrentText(generateWords(100).join(" "));
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const changeDuration = (duration) => {
    setTestDuration(duration);
    restartTest(duration);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        // We'll use a small trick: if Tab is pressed, we can wait for Enter
        // but most users expect Tab to just work. To follow "Tab + Enter":
        window._tabPressed = true;
      }
      if (e.key === "Enter" && window._tabPressed) {
        e.preventDefault();
        restartTest();
        window._tabPressed = false;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "Tab") {
        window._tabPressed = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [testDuration]); // Re-bind when duration changes to ensure restartTest uses correct state

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  if (testFinished) {
    return (
      <div className="container result-screen">
        <h1 className="title">Test Finished</h1>
        <div className="stats-grid">
          <div className="stat-box">
            <span className="stat-label">wpm</span>
            <span className="stat-value">{wpm}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">acc</span>
            <span className="stat-value">{accuracy}%</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">raw</span>
            <span className="stat-value">{rawWpm}</span>
          </div>
        </div>
        <button onClick={() => restartTest()} className="restart-btn">
          Restart Test
        </button>
      </div>
    );
  }

  // Calculate current word index to set the ref
  let charCount = 0;
  const currentWordIndex = splitWords.findIndex((word) => {
    const start = charCount;
    charCount += word.length + 1; // +1 for space
    return text.length <= start + word.length;
  });

  return (
    <div className="container" onClick={focusInput}>
      <header className="header">
        <div className="mode-selection">
          {[30, 60, 120].map((d) => (
            <button
              key={d}
              className={`mode-btn ${testDuration === d ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                changeDuration(d);
              }}
              disabled={isTyping}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="live-stats">
          <span className="main-stat">{time}s</span>
          <span>{wpm} wpm</span>
          <span>{accuracy}% acc</span>
        </div>
      </header>

      <div className="typing-area">
        <input
          ref={inputRef}
          type="text"
          className="hidden-input"
          value={text}
          onChange={handleTyping}
          autoFocus
        />
        <div className="words-window">
          <div 
            ref={wordsWrapperRef} 
            className="words-wrapper"
            style={{ transform: `translateY(-${lineOffset}px)` }}
          >
            {splitWords.map((word, wIdx) => {
              const globalWordStart = splitWords
                .slice(0, wIdx)
                .reduce((acc, curr) => acc + curr.length + 1, 0);

              const isCurrentWord = wIdx === currentWordIndex;

              return (
                <div 
                  key={wIdx} 
                  className={`word ${isCurrentWord ? "active" : ""}`}
                  ref={isCurrentWord ? currentWordRef : null}
                >
                  {word.split("").map((char, i) => {
                    const index = globalWordStart + i;
                    let state = "";
                    if (index < text.length) {
                      state = char === text[index] ? "correct" : "incorrect";
                    }
                    const isCurrent = index === text.length;

                    return (
                      <span
                        key={index}
                        className={`char ${state} ${isCurrent ? "current" : ""}`}
                      >
                        {isCurrent && <div className="caret"></div>}
                        {char}
                      </span>
                    );
                  })}
                  {wIdx < splitWords.length - 1 && (() => {
                    const index = globalWordStart + word.length;
                    let state = "";
                    if (index < text.length) {
                      state = " " === text[index] ? "correct" : "incorrect";
                    }
                    const isCurrent = index === text.length;
                    return (
                      <span
                        key={index}
                        className={`char ${state} ${isCurrent ? "current" : ""} space`}
                      >
                        {isCurrent && <div className="caret"></div>}
                        {"\u00A0"}
                      </span>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>Press <span className="key-hint">Tab</span> + <span className="key-hint">Enter</span> to quickly restart</p>
      </footer>
    </div>
  );
}

export default Home;

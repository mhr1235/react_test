import React, { useState, useEffect, useMemo, useCallback } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
  const [enemies, setEnemies] = useState([{ x: 5, y: 5 }]);

  const MAP = useMemo(() => [
      "##########",
      "#        #",
      "#        #",
      "#        #",
      "#        #",
      "#        #",
      "#        #",
      "##########",
  ], []);

  // Define movePlayer before useEffect
  const movePlayer = useCallback((dx, dy) => {
    setPlayerPosition((prev) => {
      const newX = prev.x + dx;
      const newY = prev.y + dy;

      if (
        newX >= 0 &&
        newX < MAP[0].length &&
        newY >= 0 &&
        newY < MAP.length &&
        MAP[newY][newX] !== '#'
      ) {
        return { x: newX, y: newY };
      }
      return prev;
    });
  }, [MAP]);

  // Keyboard event listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft': movePlayer(-1, 0); break;
        case 'ArrowRight': movePlayer(1, 0); break;
        case 'ArrowUp': movePlayer(0, -1); break;
        case 'ArrowDown': movePlayer(0, 1); break;
        default: break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);
  useEffect(() => {
    const interval = setInterval(() => {
      setEnemies((prevEnemies) =>
        prevEnemies.map((enemy) => {
          const dx = Math.floor(Math.random() * 3) - 1;
          const dy = Math.floor(Math.random() * 3) - 1;
          const newX = enemy.x + dx;
          const newY = enemy.y + dy;

          if (
            newX >= 0 &&
            newX < MAP[0].length &&
            newY >= 0 &&
            newY < MAP.length &&
            MAP[newY][newX] !== '#'
          ) {
            return { x: newX, y: newY };
          }
          return enemy;
        })
      );
    }, 500);

    return () => clearInterval(interval);
  }, [MAP]);

  const renderMap = () => {
    return MAP.map((row, y) => {
      let renderedRow = '';
      for (let x = 0; x < row.length; x++) {
        let cell = row[x];

        if (x === playerPosition.x && y === playerPosition.y) {
          cell = '@';
        }

        const enemy = enemies.find(
          (enemy) => enemy.x === x && enemy.y === y
        );
        if (enemy) {
          cell = 'E';
        }

        renderedRow += cell;
      }
      return renderedRow;
    }).join('\n');
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <p>Use arrow keys or buttons to move</p>
          <p>Player: @ | Enemy: E | Wall: #</p>
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: '16px', whiteSpace: 'pre', display: 'inline-block' }}>
          {renderMap()}
        </div>
        <div>
          <button onClick={() => movePlayer(-1, 0)}>Left</button>
          <button onClick={() => movePlayer(1, 0)}>Right</button>
          <button onClick={() => movePlayer(0, -1)}>Up</button>
          <button onClick={() => movePlayer(0, 1)}>Down</button>
        </div>
      </header>
    </div>
  );
}

export default App;


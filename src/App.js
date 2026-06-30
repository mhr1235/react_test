import React, { useState, useEffect, useMemo, useCallback } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
  const [enemies, setEnemies] = useState([{ x: 5, y: 5 }]);
  const [bouncing, setBouncing] = useState(false);
  const [flash, setFlash] = useState(false);

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
    if (bouncing) return;
    
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
        // Check for collision with enemies
        const enemyCollision = enemies.some(
          (enemy) => enemy.x === newX && enemy.y === newY
        );
        
        if (enemyCollision) {
          // Set bouncing and flash state
          setBouncing(true);
          setFlash(true);
          
          // Bounce back one step in the opposite direction
          setTimeout(() => {
            setPlayerPosition((prevPos) => {
              const bounceX = prevPos.x + (-dx);
              const bounceY = prevPos.y + (-dy);
              return { x: bounceX, y: bounceY };
            });
            setBouncing(false);
            // Reset flash after bounce
            setTimeout(() => setFlash(false), 300);
          }, 200);
          
          return prev;
        }
        
        return { x: newX, y: newY };
      }
      return prev;
    });
  }, [MAP, enemies, bouncing]);

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
          // Apply flash effect when bouncing
          if (flash) {
            renderedRow += '<span class="ascii-player flash">@</span>';
          } else {
            renderedRow += '<span class="ascii-player">@</span>';
          }
        } else {
          const enemy = enemies.find((enemy) => enemy.x === x && enemy.y === y);
          if (enemy) {
            renderedRow += 'E';
          } else {
            renderedRow += cell;
          }
        }
      }
      return renderedRow;
    }).join('\n');
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <p className="glow">Use arrow keys or buttons to move the player '@' around the map. Avoid running into enemies 'E' and walls '#'. Enjoy the game!</p>
          <p className="glow">Player: @ | Enemy: E | Wall: #</p>
        </div>
        <div className={`game-area ${bouncing ? 'bouncing' : ''}`}>
          <div className="ascii-text" dangerouslySetInnerHTML={{ __html: renderMap() }}></div>
        </div>
        <div>
          <button className="button-gradient" onClick={() => movePlayer(-1, 0)}>Left</button>
          <button className="button-gradient" onClick={() => movePlayer(1, 0)}>Right</button>
          <button className="button-gradient" onClick={() => movePlayer(0, -1)}>Up</button>
          <button className="button-gradient" onClick={() => movePlayer(0, 1)}>Down</button>
        </div>
        {bouncing && (
          <div className="bounce-effect">
            <p className="glow">Collision! Bouncing back...</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;

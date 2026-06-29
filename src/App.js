import React, { useState, useEffect, useMemo } from 'react';
import logo from './logo.svg';

function App() {
  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
  const [enemies, setEnemies] = useState([{ x: 5, y: 5 }]);

  // Memoize the MAP array to prevent unnecessary re-renders
  const MAP = useMemo(() => {
    return [
      "##########",
      "#        #",
      "#        #",
      "#        #",
      "#        #",
      "#        #",
      "#        #",
      "##########",
    ];
  }, []);

  // Move player
  const movePlayer = (dx, dy) => {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    // Check if the new position is within the map
    if (
      newX >= 0 &&
      newX < MAP[0].length &&
      newY >= 0 &&
      newY < MAP.length
    ) {
      setPlayerPosition({ x: newX, y: newY });
    }
  };

  // Move enemies
  useEffect(() => {
    const interval = setInterval(() => {
      setEnemies((prevEnemies) =>
        prevEnemies.map((enemy) => {
          const dx = Math.floor(Math.random() * 3) - 1;
          const dy = Math.floor(Math.random() * 3) - 1;
          const newX = enemy.x + dx;
          const newY = enemy.y + dy;

          // Check if the new position is within the map
          if (
            newX >= 0 &&
            newX < MAP[0].length &&
            newY >= 0 &&
            newY < MAP.length
          ) {
            return { x: newX, y: newY };
          }
          return enemy;
        })
      );
    }, 500);

    return () => clearInterval(interval);
  }, [MAP]); // Now MAP is a memoized value and only changes when dependencies change

  // Render the map
  const renderMap = () => {
    const mapGrid = [];

    for (let y = 0; y < MAP.length; y++) {
      for (let x = 0; x < MAP[y].length; x++) {
        let cell = MAP[y][x];

        // Check if player is here
        if (x === playerPosition.x && y === playerPosition.y) {
          cell = '@';
        }

        // Check if enemy is here
        const enemy = enemies.find(
          (enemy) => enemy.x === x && enemy.y === y
        );
        if (enemy) {
          cell = 'E';
        }

        mapGrid.push(cell);
      }
    }

    return mapGrid.join('');
  };

  return (
    <div className="App">
      <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />

        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Hello Mark
        </a>
      </header>
      <div style={{ whiteSpace: 'pre' }}>{renderMap()}</div>
      <div>
        <button onClick={() => movePlayer(-1, 0)}>Left</button>
        <button onClick={() => movePlayer(1, 0)}>Right</button>
        <button onClick={() => movePlayer(0, -1)}>Up</button>
        <button onClick={() => movePlayer(0, 1)}>Down</button>
      </div>
    </div>
  );
}

export default App;

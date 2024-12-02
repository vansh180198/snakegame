import React, { useEffect, useState, useRef } from "react";

const Snakegame = ({ gridsize = 10 }) => {
  const [grid, setGrid] = useState(
    Array.from({ length: gridsize }, () =>
      Array.from({ length: gridsize }).fill("")
    )
  );
  const [snakeboard, setSnakeboard] = useState([[3, 2]]);
  const [food, setFood] = useState(randomCell());
  const [score, setScore] = useState(0);

  const changeDirection = useRef(1); // 1: Right, 2: Down, 3: Up, 4: Left

  function randomCell() {
    let x, y;
    do {
      x = Math.floor(Math.random() * gridsize);
      y = Math.floor(Math.random() * gridsize);
    } while (snakeboard.some(([snakeX, snakeY]) => snakeX === x && snakeY === y)); // Ensure no overlap
    return [x, y];
  }

  useEffect(() => {
    const id = setInterval(() => {
      setSnakeboard((prev) => {
        let arr = [...prev];
        const head = arr[0];
        let newHead;

        if (changeDirection.current === 1) {
          newHead = [head[0] + 1, head[1]]; // Move Right
        } else if (changeDirection.current === 2) {
          newHead = [head[0], head[1] + 1]; // Move Down
        } else if (changeDirection.current === 3) {
          newHead = [head[0], head[1] - 1]; // Move Up
        } else if (changeDirection.current === 4) {
          newHead = [head[0] - 1, head[1]]; // Move Left
        }

        // Check collision with walls or self
        if (
          newHead[0] < 0 ||
          newHead[0] >= gridsize ||
          newHead[1] < 0 ||
          newHead[1] >= gridsize ||
          arr.some(([x, y]) => x === newHead[0] && y === newHead[1])
        ) {
          alert("Game Over! Your score: " + score);
          setScore(0);
          changeDirection.current = 1;
          return [[3, 2]];
        }

        arr.unshift(newHead);

        // Check if food is eaten
        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setScore(score + 10);
          setFood(randomCell());
        } else {
          arr.pop(); // Remove tail if no food is eaten
        }

        return arr;
      });
    }, 200);

    return () => clearInterval(id);
  }, [food, score, gridsize]);

  const handleDirectionChange = (dir) => {
    if (dir === "up" && changeDirection.current !== 2) changeDirection.current = 3;
    if (dir === "down" && changeDirection.current !== 3) changeDirection.current = 2;
    if (dir === "left" && changeDirection.current !== 1) changeDirection.current = 4;
    if (dir === "right" && changeDirection.current !== 4) changeDirection.current = 1;
  };

  function checkSnake(x, y) {
    return snakeboard.some(([sx, sy]) => sx === x && sy === y);
  }

  return (
    <>
      <div className="score">Score: {score}</div>
      <div className="game">
        {grid.map((row, y) => (
          <div className="row" key={y}>
            {row.map((_, x) => (
              <div
                key={x}
                className={`cell ${
                  checkSnake(x, y) ? "snake" : food[0] === x && food[1] === y ? "food" : ""
                }`}
              ></div>
            ))}
          </div>
        ))}
      </div>

      <div className="controls">
        <button onClick={() => handleDirectionChange("up")}>Up</button>
        <div>
          <button onClick={() => handleDirectionChange("left")}>Left</button>
          <button onClick={() => handleDirectionChange("right")}>Right</button>
        </div>
        <button onClick={() => handleDirectionChange("down")}>Down</button>
      </div>
    </>
  );
};

export default Snakegame;

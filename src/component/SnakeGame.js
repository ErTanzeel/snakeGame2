import React, { useState, useEffect, useRef } from 'react';
import './snake.css'

const GRID_SIZE = 21;
const CELL_SIZE = 21;

const SnakeGame = () => {

// Move generateFood function definition here
    const generateFood = () => {
        const randomX = Math.floor(Math.random() * GRID_SIZE);
        const randomY = Math.floor(Math.random() * GRID_SIZE);

        return { x: randomX, y: randomY };
    };

    const [food, setFood] = useState(generateFood());
    const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
    const [direction, setDirection] = useState('RIGHT');
    const [gameOver, setGameOver] = useState(false);
    const [myScore, setmyScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isGameRunning, setIsGameRunning] = useState(true);

    const canvasRef = useRef(null);

    useEffect(() => {
        const handleKeyPress = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    if (direction !== 'DOWN') {
                        setDirection('UP');
                    }
                    break;
                case 'ArrowDown':
                    if (direction !== 'UP') {
                        setDirection('DOWN');
                    }
                    break;
                case 'ArrowLeft':
                    if (direction !== 'RIGHT') {
                        setDirection('LEFT');
                    }
                    break;
                case 'ArrowRight':
                    if (direction !== 'LEFT') {
                        setDirection('RIGHT');
                    }
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [direction]); 


    useEffect(() => {
        if (!gameOver) {
            const moveSnake = () => {
                const newSnake = [...snake];
                const head = { ...newSnake[0] };

                switch (direction) {
                    case 'UP':
                        head.y -= 1;
                        break;
                    case 'DOWN':
                        head.y += 1;
                        break;
                    case 'LEFT':
                        head.x -= 1;
                        break;
                    case 'RIGHT':
                        head.x += 1;
                        break;
                    default:
                        break;
                }

                if (checkCollision(head)) {
                    setGameOver(true);
                    return;
                }

                newSnake.unshift(head);

                // Check if the snake ate the food
                if (head.x === food.x && head.y === food.y) {

                    setFood(generateFood());
                    console.log('food')
                    setmyScore(myScore + 5)
                } else {
                    newSnake.pop();
                }

                setSnake(newSnake);
            };

            const gameLoop = setInterval(moveSnake, 200);

            return () => clearInterval(gameLoop);
        }
    }, [snake, direction, food, gameOver]);


    const startGame = () => {
        setSnake([{ x: 5, y: 5 }]);
        setDirection('RIGHT');
        setFood(generateFood());
        setGameOver(false);
        setmyScore(0);
        setIsGameRunning(true);
    };

    const stopGame = () => {
        setIsGameRunning(false);
        setHighScore(Math.max(highScore, myScore));

        setGameOver(true);
    };
    
    useEffect(() => {
        // Update high score when the game is over
        if (gameOver) {
            setHighScore(Math.max(highScore, myScore));
        }
    }, [gameOver, myScore, highScore]);
    
    




    const checkCollision = (head) => {

        return (
            head.x < 0 ||
            head.y < 0 ||
            head.x >= GRID_SIZE ||
            head.y >= GRID_SIZE ||
            snake.some((segment) => segment.x === head.x && segment.y === head.y)
        );
    };

    const drawGrid = (ctx) => {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);
    };

    const drawSnake = (ctx) => {
        ctx.fillStyle = 'green';
        snake.forEach((segment) => {
            ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        });
    };

    const drawFood = (ctx) => {

        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    };

    const drawGameOver = (ctx) => {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', 100, 250);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        drawGrid(ctx);
        drawSnake(ctx);
        drawFood(ctx);

        if (gameOver) {
            drawGameOver(ctx);
        }
    }, [snake, food, gameOver]);



    return (
        <div>
            <header className='header'>
                <div className='icon'>Snake<span style={{color:"red",fontSize:"36px"}}>G</span>ame</div>
                <div className='result'>
                    <div> High score: {highScore} </div>
                    <div> Your score: {myScore} </div>

                </div>
                <button className='buttonStyle' onClick={isGameRunning && !gameOver ? stopGame : startGame}>
                    {isGameRunning && !gameOver ? 'Stop Game' : 'Start Game'}
                </button>
            </header>

            <canvas ref={canvasRef} width={GRID_SIZE * CELL_SIZE} height={GRID_SIZE * CELL_SIZE}></canvas>
        </div>
    );
};

export default SnakeGame;

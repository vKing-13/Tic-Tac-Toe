import { useState } from "react";
import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import Logs from "./components/Logs";
import { WINNING_COMBINATIONS } from "./winning_combination";
import GameOver from "./components/GameOver";

const PLAYERS={
  X:" Player 1",
  O: "Player 2",
}

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function derivedGameBoard(gameTurns){
  let gameBoard = [...initialGameBoard.map(array => [...array])];

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, column } = square;
    gameBoard[row][column] = player;
  }
  return gameBoard
}

function derivedWinner(gameBoard,player){
  let winner = null;

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];

    if (firstSquareSymbol && firstSquareSymbol === secondSquareSymbol && firstSquareSymbol === thirdSquareSymbol) {
      winner = player[firstSquareSymbol];
      break; // Stop checking if we found a winner
    }
  }
  return winner
}

function App() {
  const [player, setPlayers] = useState(PLAYERS)
  const [gameTurns, setGameTurns] = useState([]);
  const [activePlayer, setActivePlayer] = useState("X");

  const gameBoard=derivedGameBoard(gameTurns)

  const winner = derivedWinner(gameBoard,player) 

  const hasDraw= gameTurns.length === 9 && !winner

  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      const updatedTurns = [
        { square: { row: rowIndex, column: colIndex }, player: activePlayer },
        ...prevTurns
      ];
      return updatedTurns;
    });

    // Toggle the active player AFTER the game turns are updated
    setActivePlayer((curActivePlayer) => curActivePlayer === "X" ? "O" : "X");
  }

  function handleRestart(){
    setGameTurns([])
    setActivePlayer("X")
  }

  function handlePlayerNameChange(symbol, newName){
    setPlayers(prevPlayers=>{
      return{
        ...prevPlayers,
        [symbol]: newName
      }
    })
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player initialName="Player 1" symbol="X" isActive={activePlayer === "X"} onChangeName={handlePlayerNameChange}/>
          <Player initialName="Player 2" symbol="O" isActive={activePlayer === "O"} onChangeName={handlePlayerNameChange}/>
        </ol>
        {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart}/>}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
      </div>
      <Logs turns={gameTurns} />
    </main>
  );
}

export default App;
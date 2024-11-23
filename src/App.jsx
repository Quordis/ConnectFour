import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Menu from './components/menu/Menu'
import Game from './components/game/Game'
import PrepStage from './components/prepStage/PrepStage'

function App() {
  const [playState, setPlayState] = useState(false);
  const [prepStage, setPrepStage] = useState(false);
  const [player1Name, setPlayer1Name] = useState("Player1");
  const [player2Name, setPlayer2Name] = useState("Player2");

  const handlePlayState = () => {
    setPlayState(prev => !prev);
  }

  const handlePrepStage = () => {
    setPrepStage(prev => !prev);
  }

  const getPlayerNames = (player1, player2) => {
      if (player1) {
        setPlayer1Name(player1);
      }
      if (player2) {
        setPlayer2Name(player2);
      }
  }

  return (
    <>
      {(!prepStage && !playState) && <Menu startGame={handlePrepStage}/>}
      {prepStage && <PrepStage goBack={handlePrepStage} setPlayerNames={getPlayerNames} startGame={handlePlayState}/>}
      {playState && <Game player1={player1Name} player2={player2Name} goBack={handlePlayState}/>}
    </>
  )
}

export default App

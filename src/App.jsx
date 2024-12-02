import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Menu from './components/menu/Menu'
import Game from './components/game/Game'
import PrepStage from './components/prepStage/PrepStage'
import OnlinePrepStage from './components/onlinePrepStage/OnlinePrepStage'
import Room from './components/Room/Room'
import OnlineGame from './components/game/OnlineGame'

function App() {
  const [playState, setPlayState] = useState(false);
  const [onlinePlayState, setOnlinePlayState] = useState(false);
  const [prepStage, setPrepStage] = useState(false);
  const [onlinePrepStage, setOnlinePrepStage] = useState(false);
  const [room, setRoom] = useState(false);
  const [player1Name, setPlayer1Name] = useState("Player1");
  const [player2Name, setPlayer2Name] = useState("Player2");
  const [roomPlayer, setRoomPlayer] = useState(null);
  const [roomID, setRoomID] = useState(null);
  const [roomInfo, setRoomInfo] = useState(null);
  const [alert, setAlert] = useState("");

  const handlePlayState = () => {
    setPlayState(prev => !prev);
  }

  const handlePrepStage = () => {
    setPrepStage(prev => !prev);
  }

  const handleOnlinePrepStage = () => {
    setOnlinePrepStage(prev => !prev);
  }

  const handleRoom = (player, id) => {
    setOnlinePrepStage(prev => !prev);
    setRoom(prev => !prev);
    setRoomPlayer(player);
    setRoomID(id);
  }
  
  const handleOnlinePlayState = (onlineRoom) => {
    setOnlinePlayState(prev => !prev);
    setRoom(prev => !prev);
    setRoomInfo(onlineRoom);
  }

  const handleLeaveGame = (message = null) => {
    setOnlinePlayState(prev => !prev);
    if (message) {
      showAlert("Not enough players to continue");
    }
  }
  
  const showAlert = (message) => {
    setAlert(message);
    setTimeout(() => {
      setAlert("");
    }, 5000)
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
      {(!prepStage && !playState && !onlinePrepStage && !room && !onlinePlayState) && <Menu startGame={handlePrepStage} startOnlineGame={handleOnlinePrepStage}/>}
      {onlinePrepStage && <OnlinePrepStage menu={handleOnlinePrepStage} room={handleRoom}/>}
      {prepStage && <PrepStage goBack={handlePrepStage} setPlayerNames={getPlayerNames} startGame={handlePlayState}/>}
      {playState && <Game player1={player1Name} player2={player2Name} goBack={handlePlayState}/>}
      {room && <Room menu={handleRoom} player={roomPlayer} id={roomID} startGame={handleOnlinePlayState} />}
      {onlinePlayState && <OnlineGame currentPlayer={roomPlayer} room={roomInfo} id={roomID} goBack={handleLeaveGame} />}
      {alert && <p className='alert'>{alert}</p>}
    </>
  )
}

export default App

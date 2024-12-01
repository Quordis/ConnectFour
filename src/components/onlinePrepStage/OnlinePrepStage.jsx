import { useState } from 'react';
import './onlinePrepStage.css';
import ListOfRooms from './listOfRooms/ListOfRooms';
import MakeARoom from './makeARoom/MakeARoom';

const OnlinePrepStage = (props) => {
    const [playerName, setPlayerName] = useState("");
    const [prepStage, setPrepStage] = useState(true);
    const [listStage, setListStage] = useState(false);
    const [roomStage, setRoomStage] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (playerName == "") {
            setPlayerName("Player");
        }
    }

    const handleList = () => {
        setPrepStage(prev => !prev);
        setListStage(prev => !prev);
    }
    
    const handleRoom = () => {
        setPrepStage(prev => !prev);
        setRoomStage(prev => !prev);
    }

    return (
        <div className='onlinePrepStage'>
            <h1>Connect<div className='logoDot'>.</div>Four</h1>
            {prepStage && 
            <>
            <form onSubmit={handleSubmit}>
                <div className='inputOption'>
                    <label htmlFor="Playername">Enter your name</label>
                    <input type="text" id='Playername' name='Playername' placeholder='Player' maxLength={15} value={playerName} onChange={(e) => {setPlayerName(e.target.value)}} />
                </div>
                <button id='btn-listOfRooms' onClick={handleList}>List of Rooms</button>
                <button id='btn-makeARoom' onClick={handleRoom}>Make a Room</button>
            </form>
            </>}
            {listStage && <ListOfRooms room={props.room} player2={playerName} />}
            {roomStage && <MakeARoom player1={playerName} room={props.room} />}
            <div className='buttonsContainer'>
                <button onClick={(prepStage && props.menu) || (listStage && handleList) || (roomStage && handleRoom)}>Go back</button>
            </div>
        </div>
    )
}

export default OnlinePrepStage;
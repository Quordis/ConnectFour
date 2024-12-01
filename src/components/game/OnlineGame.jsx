import { useState } from 'react';
import './game.css';
import { useEffect } from 'react';
import checkForWinner from './checkForWinner';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const OnlineGame = (props) => {
    const [activePlayer, setActivePlayer] = useState("player1");
    const [currentPlayer, setCurrentPlayer] = useState(props.currentPlayer);
    const [timer, setTimer] = useState(30);
    const [board, setBoard] = useState([
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
    ])
    const [winner, setWinner] = useState(null);
    const [firstPlayerPoints, setFirstPlayerPoints] = useState(0);
    const [secondPlayerPoints, setSecondPlayerPoints] = useState(0);
    const [noResult, setNoResult] = useState(false);

    let start = true;

    useEffect(() => {
        if (start) {
            //handleTimer();
            console.log(props.room);
            console.log(props.currentPlayer);
            const synchBoard = board;
            for (let i = 0; i <= 5; i++) {
                for (let j = 0; j <= 6; j++) {
                    synchBoard[i][j] = {
                        "owner": 0,
                        "ref": document.getElementById("c" + (j + 1) + "-" + "r" + (i + 1))
                    }
                    if (i == 5 && activePlayer == currentPlayer) {
                        synchBoard[i][j].ref?.classList.add("possibly-p1");
                    }
                }
            }
            start = false;
        }
        const unsubscribe = onSnapshot(doc(db, "rooms", props.id), (snapshot) => {
            let column = snapshot.data().previousMoveColumn;
            let row = snapshot.data().previousMoveRow;
            let previousPlayer = snapshot.data().previousPlayer;
            board[row][column].owner = previousPlayer;
            board[row][column].ref?.classList.add("p" + previousPlayer);
            let player = previousPlayer == 1 ? "player2" : "player1";
            let result = checkForWinner(previousPlayer, board);

            if (result) {
                if (player == 2) {
                    setFirstPlayerPoints(prev => prev + 1);
                }
                else {
                    setSecondPlayerPoints(prev  => prev + 1);
                }
                handleWinnerState("add", result);
                setWinner(activePlayer);
                setActivePlayer(null);
            }
            
            if (result == false) {
                setActivePlayer(player);
            }
            });

        return () => {
            unsubscribe()
        };
    }, []);

    useEffect(() => {
        if (timer == 0 && winner == null) {
            handleActivePlayer();
        }
    }, [timer]);
    
    useEffect(() => {
        console.log(activePlayer, currentPlayer);
        const synchBoard = board;
        let wayToWin = false;
        let player = currentPlayer == "player1" ? 1 : 2;
        for (let j = 6; j >= 0; j--) {
            for (let i = 5; i >= 0; i--) {
                if (synchBoard[i][j].owner == 0) {
                    wayToWin = true;
                    if (activePlayer == currentPlayer) {
                        synchBoard[i][j].ref?.classList.add("possibly-p" + player);
                    }
                    else {
                        synchBoard[i][j].ref?.classList.remove("possibly-p" + player);
                    }
                    break;
                }
            }
        }
        if (wayToWin == false) {
            setWinner("Draw");
            setActivePlayer(null);
            setNoResult(true);
            return handleWinnerState("add");
        }
        setTimer(30);
        let timerSupport = 30;
        const timerInterval = setInterval(() => {
            setTimer(prev => prev - 1);
            timerSupport -= 1;
            if (timerSupport == 0) {
                clearInterval(timerInterval);
            }
        }, 1000);
        return(() => {
            clearInterval(timerInterval);
        })
    }, [activePlayer]);

    const handleActivePlayer = () => {
        if (activePlayer == "player1") {
            return setActivePlayer("player2");
        }
        return setActivePlayer("player1");
    }

    const handleTimer = () => {
        setTimer(30);
        let timerSupport = 30;
        const timerInterval = setInterval(() => {
            setTimer(prev => prev - 1);
            timerSupport -= 1;
            if (timerSupport == 0) {
                clearInterval(timerInterval);
            }
        }, 1000);
    }

    const handleColumn = async (e) => {
        const column = e.currentTarget.classList[1].split('')[7] - 1;

        const player = activePlayer == "player1" ? 1 : 2;

        let rightRow = false;

        for (let i = 5; i >= 0; i--) {
            if (board[i][column].owner == 0) {
                board[i][column].owner = player;
                board[i][column].ref?.classList.add("p" + player);
                board[i][column].ref?.classList.remove("possibly-p" + player);
                rightRow = true;
                
                try {
                    await updateDoc(doc(db, "rooms", props.id), {
                        previousMoveRow: i,
                        previousMoveColumn: column,
                        previousPlayer: player
                    })
                }
                catch (err) {
                    console.log(err);
                }
                break;
            }
        }

        if (rightRow == false) {
            return;
        }

        let result = checkForWinner(player, board);

        if (result) {
            if (player == 1) {
                setFirstPlayerPoints(prev => prev + 1);
            }
            else {
                setSecondPlayerPoints(prev  => prev + 1);
            }
            handleWinnerState("add", result);
            setWinner(activePlayer);
            setActivePlayer(null);
        }
        
        if (result == false) {
            handleActivePlayer();
        }
    }

    const handleWinnerState = (action, ref = null) => {
        if (action == "add") {
            const synchBoard = board;
            for (let j = 6; j >= 0; j--) {
                for (let i = 5; i >= 0; i--) {
                    synchBoard[i][j].ref?.classList.add("end");
                }
            }
        }
        else {
            const synchBoard = board;
            for (let j = 6; j >= 0; j--) {
                for (let i = 5; i >= 0; i--) {
                    synchBoard[i][j].ref?.classList.remove("end");
                    synchBoard[i][j].ref?.classList.remove("winner");
                    synchBoard[i][j].ref?.classList.remove("possibly-p1");
                    synchBoard[i][j].ref?.classList.remove("possibly-p2");
                    synchBoard[i][j].ref?.classList.remove("p1");
                    synchBoard[i][j].ref?.classList.remove("p2");
                    synchBoard[i][j].owner = 0;
                }
            }
        }
        if (ref) {
            ref.forEach(item => {
                item.classList.remove("end");
                item.classList.add("winner");
            })
        }
    }

    const handleReset = () => {
        let player = winner == "player1" ? "player2" : "player1";
        handleWinnerState("remove");
        setActivePlayer(player);
        setWinner(null);
        setNoResult(false);
    }
    
    return (
        <div className='game'>
            <div className='game-top'>
                <div className='logo-container'>
                    <h1>Connect<div className='logoDot'>.</div>Four</h1>
                </div>
                <div className='players-container'>
                    <div className={'player ' + (winner == "player2" ? "disabled" : (winner == "player1" ? "winner" : ""))}>
                        <p>{props.room.player1}</p>
                        <div className='player-points'>{firstPlayerPoints}</div>
                    </div>
                    {activePlayer == "player1" && <div className='active-player-1'>
                        <div className='timer'>{timer + "s"}</div>
                    </div>}
                    <div className={'player ' + (winner == "player1" ? "disabled" : (winner == "player2" ? "winner" : ""))}>
                        <p>{props.room.player2}</p>
                        <div className='player-points'>{secondPlayerPoints}</div>
                    </div>
                    {activePlayer == "player2" && <div className="active-player-2">
                        <div className='timer'>{timer + "s"}</div>
                    </div>}
                </div>
            </div>
            <div className='game-center'>
                <div className={'board ' + (activePlayer == null ? "disabled" : "")}>
                    <div className='column column-1' onClick={activePlayer == currentPlayer && handleColumn}>
                        <div className="item"><div className='circle' id='c1-r1'></div></div>
                        <div className="item"><div className='circle' id='c1-r2'></div></div>
                        <div className="item"><div className='circle' id='c1-r3'></div></div>
                        <div className="item"><div className='circle' id='c1-r4'></div></div>
                        <div className="item"><div className='circle' id='c1-r5'></div></div>
                        <div className="item"><div className='circle' id='c1-r6'></div></div>
                        {activePlayer == currentPlayer && <div className='active-column' style={currentPlayer == "player1" ? {backgroundColor: "#FF8225"} : {backgroundColor: "#88D66C"}}>
                            <div className="triangle-outer">
                                <div className='triangle-inner'></div>
                            </div>
                        </div>}
                    </div>
                    <div className='column column-2' onClick={activePlayer == currentPlayer && handleColumn}>
                        <div className="item"><div className='circle' id='c2-r1'></div></div>
                        <div className="item"><div className='circle' id='c2-r2'></div></div>
                        <div className="item"><div className='circle' id='c2-r3'></div></div>
                        <div className="item"><div className='circle' id='c2-r4'></div></div>
                        <div className="item"><div className='circle' id='c2-r5'></div></div>
                        <div className="item"><div className='circle' id='c2-r6'></div></div>
                        {activePlayer == currentPlayer && <div className='active-column' style={currentPlayer == "player1" ? {backgroundColor: "#FF8225"} : {backgroundColor: "#88D66C"}}>
                            <div className="triangle-outer">
                                <div className='triangle-inner'></div>
                            </div>
                        </div>}
                    </div>
                    <div className='column column-3' onClick={activePlayer == currentPlayer && handleColumn}>
                        <div className="item"><div className='circle' id='c3-r1'></div></div>
                        <div className="item"><div className='circle' id='c3-r2'></div></div>
                        <div className="item"><div className='circle' id='c3-r3'></div></div>
                        <div className="item"><div className='circle' id='c3-r4'></div></div>
                        <div className="item"><div className='circle' id='c3-r5'></div></div>
                        <div className="item"><div className='circle' id='c3-r6'></div></div>
                        {activePlayer == currentPlayer && <div className='active-column' style={currentPlayer == "player1" ? {backgroundColor: "#FF8225"} : {backgroundColor: "#88D66C"}}>
                            <div className="triangle-outer">
                                <div className='triangle-inner'></div>
                            </div>
                        </div>}
                    </div>
                    <div className='column column-4' onClick={activePlayer == currentPlayer && handleColumn}>
                        <div className="item"><div className='circle' id='c4-r1'></div></div>
                        <div className="item"><div className='circle' id='c4-r2'></div></div>
                        <div className="item"><div className='circle' id='c4-r3'></div></div>
                        <div className="item"><div className='circle' id='c4-r4'></div></div>
                        <div className="item"><div className='circle' id='c4-r5'></div></div>
                        <div className="item"><div className='circle' id='c4-r6'></div></div>
                        {activePlayer == currentPlayer && <div className='active-column' style={currentPlayer == "player1" ? {backgroundColor: "#FF8225"} : {backgroundColor: "#88D66C"}}>
                            <div className="triangle-outer">
                                <div className='triangle-inner'></div>
                            </div>
                        </div>}
                    </div>
                    <div className='column column-5' onClick={activePlayer == currentPlayer && handleColumn}>
                        <div className="item"><div className='circle' id='c5-r1'></div></div>
                        <div className="item"><div className='circle' id='c5-r2'></div></div>
                        <div className="item"><div className='circle' id='c5-r3'></div></div>
                        <div className="item"><div className='circle' id='c5-r4'></div></div>
                        <div className="item"><div className='circle' id='c5-r5'></div></div>
                        <div className="item"><div className='circle' id='c5-r6'></div></div>
                        {activePlayer == currentPlayer && <div className='active-column' style={currentPlayer == "player1" ? {backgroundColor: "#FF8225"} : {backgroundColor: "#88D66C"}}>
                            <div className="triangle-outer">
                                <div className='triangle-inner'></div>
                            </div>
                        </div>}
                    </div>
                    <div className='column column-6' onClick={activePlayer == currentPlayer && handleColumn}>
                        <div className="item"><div className='circle' id='c6-r1'></div></div>
                        <div className="item"><div className='circle' id='c6-r2'></div></div>
                        <div className="item"><div className='circle' id='c6-r3'></div></div>
                        <div className="item"><div className='circle' id='c6-r4'></div></div>
                        <div className="item"><div className='circle' id='c6-r5'></div></div>
                        <div className="item"><div className='circle' id='c6-r6'></div></div>
                        {activePlayer == currentPlayer && <div className='active-column' style={currentPlayer == "player1" ? {backgroundColor: "#FF8225"} : {backgroundColor: "#88D66C"}}>
                            <div className="triangle-outer">
                                <div className='triangle-inner'></div>
                            </div>
                        </div>}
                    </div>
                    <div className='column column-7' onClick={activePlayer == currentPlayer && handleColumn}>
                        <div className="item"><div className='circle' id='c7-r1'></div></div>
                        <div className="item"><div className='circle' id='c7-r2'></div></div>
                        <div className="item"><div className='circle' id='c7-r3'></div></div>
                        <div className="item"><div className='circle' id='c7-r4'></div></div>
                        <div className="item"><div className='circle' id='c7-r5'></div></div>
                        <div className="item"><div className='circle' id='c7-r6'></div></div>
                        {activePlayer == currentPlayer && <div className='active-column' style={currentPlayer == "player1" ? {backgroundColor: "#FF8225"} : {backgroundColor: "#88D66C"}}>
                            <div className="triangle-outer">
                                <div className='triangle-inner'></div>
                            </div>
                        </div>}
                    </div>
                    {noResult && <div className='draw'>Draw</div>}
                </div>
            </div>
            <div className='game-bottom'>
                <button onClick={props.goBack} id='btn-backtomenu'>Back to menu</button>
                {winner && <button onClick={handleReset} id='btn-resetgame'>Reset Game</button>}
            </div>
        </div>
    )
}

export default OnlineGame;
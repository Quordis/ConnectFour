import { useState } from 'react';
import './game.css';
import { useEffect } from 'react';
import checkForWinner from './checkForWinner';

const Game = (props) => {
    const [activePlayer, setActivePlayer] = useState("Player1");
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
            const synchBoard = board;
            for (let i = 0; i <= 5; i++) {
                for (let j = 0; j <= 6; j++) {
                    synchBoard[i][j] = {
                        "owner": 0,
                        "ref": document.getElementById("c" + (j + 1) + "-" + "r" + (i + 1))
                    }
                    if (i == 5) {
                        synchBoard[i][j].ref?.classList.add("possibly-p1");
                    }
                }
            }
            start = false;
        }
    }, []);

    useEffect(() => {
        if (timer == 0 && winner == null) {
            handleActivePlayer();
        }
    }, [timer]);
    
    useEffect(() => {
        const synchBoard = board;
        let wayToWin = false;
        let player = activePlayer == "Player1" ? 1 : 2;
        let previousPlayer = player == 1 ? 2 : 1;
        for (let j = 6; j >= 0; j--) {
            for (let i = 5; i >= 0; i--) {
                if (synchBoard[i][j].owner == 0) {
                    wayToWin = true;
                    synchBoard[i][j].ref?.classList.remove("possibly-p" + previousPlayer);
                    synchBoard[i][j].ref?.classList.add("possibly-p" + player);
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
        if (activePlayer == "Player1") {
            return setActivePlayer("Player2");
        }
        return setActivePlayer("Player1");
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

    const handleColumn = (e) => {
        const column = e.currentTarget.classList[1].split('')[7] - 1;

        const player = activePlayer == "Player1" ? 1 : 2;

        let rightRow = false;

        for (let i = 5; i >= 0; i--) {
            if (board[i][column].owner == 0) {
                board[i][column].owner = player;
                board[i][column].ref?.classList.add("p" + player);
                board[i][column].ref?.classList.remove("possibly-p" + player);
                rightRow = true;
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
        let player = winner == "Player1" ? "Player2" : "Player1";
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
                    <div className={'player ' + (winner == "Player2" ? "disabled" : (winner == "Player1" ? "winner" : ""))}>
                        <p>{props.player1}</p>
                        <div className='player-points'>{firstPlayerPoints}</div>
                    </div>
                    {activePlayer == "Player1" && <div className='active-player-1'>
                        <div className='timer'>{timer + "s"}</div>
                    </div>}
                    <div className={'player ' + (winner == "Player1" ? "disabled" : (winner == "Player2" ? "winner" : ""))}>
                        <p>{props.player2}</p>
                        <div className='player-points'>{secondPlayerPoints}</div>
                    </div>
                    {activePlayer == "Player2" && <div className="active-player-2">
                        <div className='timer'>{timer + "s"}</div>
                    </div>}
                </div>
            </div>
            <div className='game-center'>
                <div className={'board ' + (activePlayer == null ? "disabled" : "")}>
                    <div className='column column-1' onClick={activePlayer && handleColumn}>
                        <div className="item"><div className='circle' id='c1-r1'></div></div>
                        <div className="item"><div className='circle' id='c1-r2'></div></div>
                        <div className="item"><div className='circle' id='c1-r3'></div></div>
                        <div className="item"><div className='circle' id='c1-r4'></div></div>
                        <div className="item"><div className='circle' id='c1-r5'></div></div>
                        <div className="item"><div className='circle' id='c1-r6'></div></div>
                        <div className='active-column' style={activePlayer == "Player1" ? {backgroundColor: "#FF8225"} : {backgroundColor: "#88D66C"}}>
                            <div className="triangle-outer">
                                <div className='triangle-inner'></div>
                            </div>
                        </div>
                    </div>
                    <div className='column column-2' onClick={activePlayer && handleColumn}>
                        <div className="item"><div className='circle' id='c2-r1'></div></div>
                        <div className="item"><div className='circle' id='c2-r2'></div></div>
                        <div className="item"><div className='circle' id='c2-r3'></div></div>
                        <div className="item"><div className='circle' id='c2-r4'></div></div>
                        <div className="item"><div className='circle' id='c2-r5'></div></div>
                        <div className="item"><div className='circle' id='c2-r6'></div></div>
                        <div className='active-column' style={activePlayer == "Player1" ? {backgroundColor: "#FF8225"} : {backgroundColor: "#88D66C"}}>
                            <div className="triangle-outer">
                                <div className='triangle-inner'></div>
                            </div>
                        </div>
                    </div>
                    <div className='column column-3' onClick={activePlayer && handleColumn}>
                        <div className="item"><div className='circle' id='c3-r1'></div></div>
                        <div className="item"><div className='circle' id='c3-r2'></div></div>
                        <div className="item"><div className='circle' id='c3-r3'></div></div>
                        <div className="item"><div className='circle' id='c3-r4'></div></div>
                        <div className="item"><div className='circle' id='c3-r5'></div></div>
                        <div className="item"><div className='circle' id='c3-r6'></div></div>
                        <div className='active-column' style={activePlayer == "Player1" ? {backgroundColor: "#FF8225"} : {backgroundColor: "#88D66C"}}>
                            <div className="triangle-outer">
                                <div className='triangle-inner'></div>
                            </div>
                        </div>
                    </div>
                    <div className='column column-4' onClick={activePlayer && handleColumn}>
                        <div className="item"><div className='circle' id='c4-r1'></div></div>
                        <div className="item"><div className='circle' id='c4-r2'></div></div>
                        <div className="item"><div className='circle' id='c4-r3'></div></div>
                        <div className="item"><div className='circle' id='c4-r4'></div></div>
                        <div className="item"><div className='circle' id='c4-r5'></div></div>
                        <div className="item"><div className='circle' id='c4-r6'></div></div>
                        <div className='active-column' style={activePlayer == "Player1" ? {backgroundColor: "#FF8225"} : {backgroundColor: "#88D66C"}}>
                            <div className="triangle-outer">
                                <div className='triangle-inner'></div>
                            </div>
                        </div>
                    </div>
                    <div className='column column-5' onClick={activePlayer && handleColumn}>
                        <div className="item"><div className='circle' id='c5-r1'></div></div>
                        <div className="item"><div className='circle' id='c5-r2'></div></div>
                        <div className="item"><div className='circle' id='c5-r3'></div></div>
                        <div className="item"><div className='circle' id='c5-r4'></div></div>
                        <div className="item"><div className='circle' id='c5-r5'></div></div>
                        <div className="item"><div className='circle' id='c5-r6'></div></div>
                        <div className='active-column' style={activePlayer == "Player1" ? {backgroundColor: "#FF8225"} : {backgroundColor: "#88D66C"}}>
                            <div className="triangle-outer">
                                <div className='triangle-inner'></div>
                            </div>
                        </div>
                    </div>
                    <div className='column column-6' onClick={activePlayer && handleColumn}>
                        <div className="item"><div className='circle' id='c6-r1'></div></div>
                        <div className="item"><div className='circle' id='c6-r2'></div></div>
                        <div className="item"><div className='circle' id='c6-r3'></div></div>
                        <div className="item"><div className='circle' id='c6-r4'></div></div>
                        <div className="item"><div className='circle' id='c6-r5'></div></div>
                        <div className="item"><div className='circle' id='c6-r6'></div></div>
                        <div className='active-column' style={activePlayer == "Player1" ? {backgroundColor: "#FF8225"} : {backgroundColor: "#88D66C"}}>
                            <div className="triangle-outer">
                                <div className='triangle-inner'></div>
                            </div>
                        </div>
                    </div>
                    <div className='column column-7' onClick={activePlayer && handleColumn}>
                        <div className="item"><div className='circle' id='c7-r1'></div></div>
                        <div className="item"><div className='circle' id='c7-r2'></div></div>
                        <div className="item"><div className='circle' id='c7-r3'></div></div>
                        <div className="item"><div className='circle' id='c7-r4'></div></div>
                        <div className="item"><div className='circle' id='c7-r5'></div></div>
                        <div className="item"><div className='circle' id='c7-r6'></div></div>
                        <div className='active-column' style={activePlayer == "Player1" ? {backgroundColor: "#FF8225"} : {backgroundColor: "#88D66C"}}>
                            <div className="triangle-outer">
                                <div className='triangle-inner'></div>
                            </div>
                        </div>
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

export default Game;
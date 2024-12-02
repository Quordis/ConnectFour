import { deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import './room.css';
import { db } from '../../lib/firebase';
import { useEffect, useState } from 'react';

const Room = (props) => {
    const [startGame, setStartGame] = useState(false);
    const [timer, setTimer] = useState(5);
    const [room, setRoom] = useState(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "rooms", props.id), (snapshot) => {
            if (snapshot.data().player2) {
                setStartGame(true);
                setRoom(snapshot.data());
                const startTimer = setInterval(() => {
                    setTimer(prev => prev - 1);
                }, 1000)
                return () => {
                    unsubscribe()
                    clearInterval(startTimer);
                };
            }
        });
        
        const dots = document.getElementById("dots");
        let counter = 1;
        const dotsAppear = setInterval(() => {
            counter++;
            if (counter == 4) {
                counter = 1;
                dots.innerHTML = "";
            }
            dots.innerHTML += ".";
        }, 500)
    
        return () => {
            unsubscribe()
            clearInterval(dotsAppear);
        };
    }, []);

    useEffect(() => {
        if (timer == 0) {
            props.startGame(room);
        }
    }, [timer]);

    const handleLeave = async () => {
        if (props.player == "player1") {
            try {
                await deleteDoc(doc(db, "rooms", props.id));
                props.menu();
            } catch (err) {
                console.log(err);
            }
        }
        if (props.player == "player2") {
            try {
                await updateDoc(doc(db, "rooms", props.id), {
                    player2: ""
                })
                props.menu();
            } catch (err) {
                console.log(err);
                props.menu();
            }
        }
    }

    return (
        <div className='room'>
            <h1>Connect<div className='logoDot'>.</div>Four</h1>
            {!startGame && <div>
                <p>Waiting for other player to join<span id='dots'></span></p>
                <div className='buttonsContainer'>
                    <button onClick={handleLeave}>Go back</button>
                </div>
            </div>
            }
            {startGame && <p>The game starts in {timer}</p>}
        </div>
    )
}

export default Room;
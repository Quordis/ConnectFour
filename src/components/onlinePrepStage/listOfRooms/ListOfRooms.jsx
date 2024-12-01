import './listOfRooms.css';
import { db } from '../../../lib/firebase';
import { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, updateDoc } from 'firebase/firestore';

const ListOfRooms = (props) => {
    const [rooms, setRooms] = useState([]);
    const [passwordInput, setPasswordInput] = useState(false);
    const [password, setPassword] = useState("");
    const [currentRoom, setCurrentRoom] = useState(null);

    useEffect(() => {
        const date = Date.now();
        const unsubscribe = onSnapshot(collection(db, "rooms"), (snapshot) => {
            snapshot.docs.forEach(async (room) => {
                if (date - room.data().createdAt?.toMillis() > 2 * 60 * 60 * 1000) {
                    console.log("Usunięto pokój " + room.id);
                    await deleteDoc(doc(db, "rooms", room.id));
                }
            })

            const updatedRooms = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRooms(updatedRooms);
        });
    
        return () => unsubscribe();
    }, [])

    const handlePlay = async (e) => {
        try {
            await updateDoc(doc(db, "rooms", e.target.value), {
                player2: props.player2 || "Player2"
            })
            props.room("player2", e.target.value);
        } catch (err) {
            console.log(err);
        }
    }

    const handlePlayWithPassword = async (e = null) => {
        if (passwordInput == false) {
            setPasswordInput(true);
            const room = rooms.filter(room => room.id === e.target.value);
            console.log(room[0].id);
            setCurrentRoom(room[0]);
            return;
        }
        if (passwordInput == true && password === currentRoom.password) {
            try {
                await updateDoc(doc(db, "rooms", currentRoom.id), {
                    player2: props.player2 || "Player2"
                })
                props.room("player2", currentRoom.id);
            } catch (err) {
                console.log(err);
            }
        }
        else {
            document.querySelector("#roomPassword").nextElementSibling.classList.add("invalid");
        }
    }

    const handlePassword = () => {
        setPasswordInput(false);
        setCurrentRoom(null);
    }


    return (
        <div className='listOfRooms'>
            <table>
                <thead>
                    <tr>
                        <th>Room name</th>
                        <th>Creator</th>
                        <th>Members</th>
                        <th>Play</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        rooms?.map((room, index) => {
                            console.log(room.id);
                            return <tr key={index}>
                                <td>{room.name}</td>
                                <td>{room.player1}</td>
                                <td>{room.player2 ? "2/2" : "1/2"}</td>
                                <td>
                                    {room.player2 ? "Full" : <button onClick={room.password ? handlePlayWithPassword : handlePlay} value={room.id}>Play</button>}
                                    {room.password && <img src="\key.png" alt="key" />}
                                </td>
                            </tr>
                        })
                    }
                    {rooms.length == 0 && <tr>
                        <td colSpan={5}>Sadly, there are no rooms</td></tr>}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={5}>
                            <img src="\key.png" alt="key" /> - Room contains password
                        </td>
                    </tr>
                </tfoot>
            </table>
            {passwordInput &&
             <div id='password-input-container'>
                <div className="password-input-wrap">
                    <div className="input-item">
                        <label htmlFor='roomPassword'>Enter password</label>
                        <input type='password' id="roomPassword" name="roomPassword" value={password} onChange={(e) => {setPassword(e.target.value)}}></input>
                        <p>Password is not correct</p>
                    </div>
                    <div className="btns-container">
                        <button onClick={handlePassword} id='btn-backToList'>Back to list</button>
                        <button onClick={handlePlayWithPassword} id='btn-onlinePlay'>Play</button>
                    </div>
                </div>
             </div>}
        </div>
    )
}

export default ListOfRooms;
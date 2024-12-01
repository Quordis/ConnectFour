import { collection, deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import './makeARoom.css';
import { db } from '../../../lib/firebase';

const MakeARoom = (props) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const { RoomName, RoomPassword = ""} = Object.fromEntries(formData);
        console.log(RoomName, RoomPassword);
        const roomsRef = collection(db, "rooms");

        try {
            const newRoomRef = doc(roomsRef);

            await setDoc(newRoomRef, {
                player1: props.player1 || "Player",
                name: RoomName,
                password: RoomPassword,
                createdAt: serverTimestamp()
            })

            setTimeout(async () => {
                await deleteDoc(newRoomRef);
            }, 5000)

            console.log(newRoomRef.id);

            props.room("player1", newRoomRef.id);
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <div className='makeARoom'>
            <form onSubmit={handleSubmit}>
                <div className='inputOption'>
                    <label htmlFor="RoomName">Enter room name*</label>
                    <input type="text" id='RoomName' name='RoomName' placeholder='Room name' maxLength={15} required />
                </div>
                <div className='inputOption'>
                    <label htmlFor="RoomPassword">Type a password</label>
                    <input type="password" id='RoomPassword' name='RoomPassword' placeholder='Room password' maxLength={15} />
                </div>
                <button>Make a Room</button>
            </form>
        </div>
    )
}

export default MakeARoom;
import { deleteDoc } from "firebase/firestore";

const automaticDeletion = (room) => {
    setTimeout(async () => {
        await deleteDoc(room);
    }, 5000)
}

export default automaticDeletion;
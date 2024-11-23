import './prepStage.css';

const PrepStage = (props) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(e.target);
        const formData = new FormData(e.target);
        console.log(formData);
        const { Player1name, Player2name } = Object.fromEntries(formData);
        console.log(Player1name, Player2name);
        props.setPlayerNames(Player1name, Player2name);
        props.startGame();
        props.goBack();
    }

    return (
        <div className='prepStage'>
            <h1>Connect<div className='logoDot'>.</div>Four</h1>
            <form onSubmit={handleSubmit}>
                <div className='inputOption'>
                    <label htmlFor="Player1name">Enter name for first player</label>
                    <input type="text" id='Player1name' name='Player1name' placeholder='Player1' maxLength={15} />
                </div>
                <div className='inputOption'>
                    <label htmlFor="Player2Name">Enter name for second player</label>
                    <input type="text" id='Player2name' name='Player2name' placeholder='Player2' maxLength={15} />
                </div>
                <button>Play</button>
            </form>
            <div className='buttonsContainer'>
                <button onClick={props.goBack}>Go back</button>
            </div>
        </div>
    )
}

export default PrepStage;
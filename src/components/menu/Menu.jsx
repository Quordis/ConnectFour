import './menu.css';

const Menu = (props) => {
    return (
        <div className='menu'>
            <h1>Connect<div className='logoDot'>.</div>Four</h1>
            <div className="buttonsContainer">
                <button id='playLocally-button' onClick={props.startGame}>Play Locally</button>
                <button onClick={props.startGame}>Play Online</button>
                <button id='rules-button'>Rules</button>
            </div>
        </div>
    )
}

export default Menu;
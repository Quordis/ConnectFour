import { useState } from 'react';
import './menu.css';
import Rules from './rules/Rules';

const Menu = (props) => {
    const [showRules, setShowRules] = useState(false);

    const handleRules = () => {
        setShowRules(prev => !prev);
    }

    return (
        <div className='menu'>
            <h1>Connect<div className='logoDot'>.</div>Four</h1>
            <div className="buttonsContainer">
                <button id='playLocally-button' onClick={props.startGame}>Play Locally</button>
                <button onClick={props.startGame}>Play Online</button>
                <button id='rules-button' onClick={handleRules}>Rules</button>
            </div>
            {showRules && <Rules menu={handleRules}/>}
        </div>
    )
}

export default Menu;
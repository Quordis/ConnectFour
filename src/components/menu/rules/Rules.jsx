import './rules.css';

const Rules = (props) => {
    return (
        <div className='rules'>
            <h1>Rules</h1>
            <div className="rules-content">
                <div className='rules-item'>
                    <h2>Objective</h2>
                    <p>The goal of the game is to connect four of your pieces in a row (horizontally, vertically, or diagonally) before your opponent does.</p>
                </div>
                <div className='rules-item'>
                    <h2>Gameplay</h2>
                    <ul>
                        <li>The game alternates turns between two players.</li>
                        <li>On your turn, drop one of your pieces into any column of the board.</li>
                        <li>Pieces fall to the lowest available spot in the chosen column.</li>
                    </ul>
                </div>
                <div className='rules-item'>
                    <h2>Winning the Game</h2>
                    <ul>
                        <li>A player wins by connecting four of their pieces in a straight line.</li>
                        <li>If the board fills up completely without a winner, the game ends in a draw.</li>
                    </ul>
                </div>
                <div className='rules-item'>
                    <h2>Invalid Moves</h2>
                    <ul>
                        <li>You cannot place a piece in a column that is already full.</li>
                        <li>If all columns are full, the game will automatically end in a draw.</li>
                    </ul>
                </div>
                <div className='rules-item'>
                    <h2>Game Etiquette</h2>
                    <ul>
                        <li>Play fairly and respect your opponent.</li>
                        <li>Avoid unnecessary delays during your turn.</li>
                    </ul>
                </div>
            </div>
            <button onClick={props.menu}>Menu</button>
        </div>
    )
}

export default Rules;
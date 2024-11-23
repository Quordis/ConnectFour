const checkForWinner = (player, board) => {
    let count = 0;
    let countRef = [];
    //Sprawdzanie w poziomie
    for (let i = 0; i <= 5; i++) {
        count = 0;
        countRef = [];
        for (let j = 0; j <= 6; j++) {
            if (board[i][j].owner == player) {
                count++;
                countRef.push(board[i][j].ref);
                    if (count == 4) {
                        console.log("Wygrywa gracz " + player);
                        console.log(countRef);
                        return countRef;
                }
            }
            else {
                count = 0;
                countRef = []
            }
        }
    }
    //Sprawdzanie w pionie
    for (let j = 0; j <= 6; j++) {
        count = 0;
        countRef = [];
        for (let i = 0; i <=5; i++) {
            if (board[i][j].owner == player) {
                count++;
                countRef.push(board[i][j].ref);
                if (count == 4) {
                    console.log("Wygrywa gracz " + player);
                    return countRef;
                }
            }
            else {
                count = 0;
                countRef = [];
            }
        }
    }
    //Sprawdzanie po przekątnej od lewej do połowy
    for (let j = 0; j <= 6; j++) {
        count = 0;
        countRef = [];
        let column = j;
        for (let i = 0; i <= 5; i++) {
            if (column < 0) {
                break;
            }
            if (board[i][column].owner == player) {
                count++;
                countRef.push(board[i][column].ref);
                if (count == 4) {
                    console.log("Wygrywa gracz " + player);
                    return countRef;
                }
            }
            else {
                count = 0;
                countRef = [];
            }
            column--;
        }
    }
    //Sprawdzanie po przekątnej od lewej do drugiej połowy
    for (let i = 5; i >= 0; i--) {
        count = 0;
        countRef = [];
        let row = i;
        for (let j = 6; j >= 0; j--) {
            if (row > 5) {
                break;
            }
            if (board[row][j].owner == player) {
                count++;
                countRef.push(board[row][j].ref);
                if (count == 4) {
                    console.log("Wygrywa gracz " + player);
                    return countRef;
                }
            }
            else {
                count = 0;
                countRef = [];
            }
            row++;
        }
    }
    //Sprawdzanie przekątnej od prawej do połowy
    for (let j = 6; j >= 0; j--) {
        count = 0;
        countRef = [];
        let column = j;
        for (let i = 0; i <= 5; i++) {
            if (column > 6) {
                break;
            }
            if (board[i][column].owner == player) {
                count++;
                countRef.push(board[i][column].ref);
                if (count == 4) {
                    console.log("Wygrywa gracz " + player);
                    return countRef;
                }
            }
            else {
                count = 0;
                countRef = [];
            }
            column++;
        }
    }
    //Sprawdzanie przekątnej od prawej do drugiej połowy
    for (let i = 5; i >= 0; i--) {
        count = 0;
        countRef = [];
        let row = i;
        for (let j = 0; j <= 6; j++) {
            if (row > 5) {
                break;
            }
            if (board[row][j].owner == player) {
                count++;
                countRef.push(board[row][j].ref);
                if (count == 4) {
                    console.log("Wygrywa gracz " + player);
                    return countRef;
                }
            }
            else {
                count = 0;
                countRef = [];
            }
            row++;
        }
    }
    return false;
}

export default checkForWinner;
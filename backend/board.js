class Board 
{
    constructor() 
    {
        this.board = [
            [0,0,0],
            [0,0,0],
            [0,0,0]
        ];
        this.valids = [0,1,2];
        this.moves = 0;
    }

    update(row,col,value) 
    {
        const rS = row in this.valids;
        const cS = col in this.valids;
        const vS = value in this.valids;
        const bE = this.board[row][col] === 0;

        if(rS&&cS&&vS&&bE)
         {
            this.board[row][col] = value;
            this.moves += 1;
            return true;
        }

        return false;
    }

    #checkRow(player,i)
    {
        return this.board[i][0] === player
            && this.board[i][1] === player
            && this.board[i][2] === player;
    }
    #checkCol(player,i)
    {
        return this.board[0][i] === player
            && this.board[1][i] === player
            && this.board[2][i] === player;
    }
    #checkWin(p)
    {       
        if (p && ( 
            this.#checkRow(p,0) || this.#checkRow(p,1) || this.#checkRow(p,2) ||
            this.#checkCol(p,0) || this.#checkCol(p,1) || this.#checkCol(p,2) ||
            ( 
                this.board[1][1] == p && 
                (
                    (this.board[0][0] == p && this.board[2][2] == p) ||
                    (this.board[0][2] == p && this.board[2][0] == p)
                )
            )
        )) return true;
        return false;
    }

    serialize(updateStatus,player)
    {
        const data = {};

        if(updateStatus != null)
            data.update = updateStatus? "success" : "fail";

        if(this.#checkWin(player))
            data.winner = player == 1 ? 'X' : 'O';

        if(this.moves >= 9)
            data.winner = 'draw';

        data.game_status = ('winner' in data) ? 'finished' : 'ongoing';

        data.board = this.board;

        return JSON.stringify(data);
    }
};

module.exports = Board;


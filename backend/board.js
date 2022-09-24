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
        const win = this.board[i][0] === player
                && this.board[i][1] === player
                && this.board[i][2] === player;
        if(!win) return false;

        this.winPath = [[i,0],[i,1],[i,2]];
        return true;
    }
    #checkCol(player,i)
    {
        const win =  this.board[0][i] === player
                && this.board[1][i] === player
                && this.board[2][i] === player;
        
        if(!win) return false;

        this.winPath = [[0,i],[1,i],[2,i]];
        return true;
    }

    #checkDiagonals(player)
    {
        //middle must be player filled
        if(this.board[1][1] !== player) return false;

        if(this.board[0][0] == player && this.board[2][2] == player )
        {
            this.winPath = [[0,0],[1,1],[2,2]];
            return true;
        }

        if(this.board[0][2] == player && this.board[2][0] == player )
        {
            this.winPath = [[0,2],[1,1],[2,0]];
            return true;
        }

        return false;
    }

    //returns true if player p won and sets this.winPath accordingly
    #checkWin(p)
    {       
        if (p && ( 
            this.#checkRow(p,0) || this.#checkRow(p,1) || this.#checkRow(p,2) ||
            this.#checkCol(p,0) || this.#checkCol(p,1) || this.#checkCol(p,2) ||
            this.#checkDiagonals(p)
        )) return true;
        return false;
    }

    serialize(updateStatus,player)
    {
        const data = {};

        if(updateStatus != null)
            data.update = updateStatus? "success" : "fail";
            
        if(this.moves >= 9)
            data.winner = 'draw';

        if(this.#checkWin(player))
            data.winner = player == 1 ? 'X' : 'O';

        data.game_status = ('winner' in data) ? 'finished' : 'ongoing';

        if(this.winPath) data.winPath = this.winPath;

        data.board = this.board;

        return data;
    }
};

module.exports = Board;


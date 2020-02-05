import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    let className = "square";

    if(props.winnerCombination) {
      if(props.winnerCombination.includes(props.numberSquare)) {
        className = "square square__winner"
      }
    }

    return (
      <button
        className={className}
        onClick={props.onClick}
      >
        {props.value}
      </button>
    );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      const winner = {
        sign: squares[a],
        combination: lines[i]
      }

      return winner;
    }
  }
  return null;
}


class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        winnerCombination={this.props.winner ? this.props.winner.combination : ''}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        numberSquare={i}
        key={i}
        />
    );
  }

  render() {
    const ROW_NUMBER = 3;
    const COLUMN_NUMBER = 3;

    return (
      <div>
        {Array(ROW_NUMBER)
          .fill('')
          .map((row, indexColumn) =>
            <div className="board-row" key={indexColumn}>
              {Array(COLUMN_NUMBER)
                  .fill('')
                  .map((square, indexSquare) => this.renderSquare(indexSquare + (indexColumn * ROW_NUMBER)))}
            </div>
          )
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      columnNumber: null,
      rowNumber: null,
      isReverse: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const columnNumber = (i + 3) % 3 + 1;
    const rowNumber = Math.floor(i / 3) + 1;

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{
        squares: squares,
        columnNumber: columnNumber,
        rowNumber: rowNumber,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Ход № ' + move + ', строка: ' + step.rowNumber + ', колонка: ' + step.columnNumber:
        'К началу игры';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Выйграл ' + winner.sign;
    } else if (this.state.stepNumber === 9) {
      status = `Ничья`
    } else {
      status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winner={winner}
            squares={current.squares}
            onClick={(i) => {
              this.handleClick(i)}
              }
/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button 
            onClick={() => this.setState({
              isReverse: !this.state.isReverse
            })}
          >
            Сортировка - {this.state.isReverse ? "↑" : "↓"}
          </button>
          <ol>{this.state.isReverse ? moves.reverse() : moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
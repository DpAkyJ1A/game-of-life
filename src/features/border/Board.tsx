import { useAppSelector } from '../../app/hooks';
import styles from './Board.module.css';
import { Cell } from '../cell/Cell';
import { selectBoard } from './boardSlice';

export function Board() {
  const state = useAppSelector(selectBoard);

  return (
    <div style={{ width: `calc(${state.config.width} * 20px)`, height: `calc(${state.config.height} * 20px)` }} className={styles.board}>
      {state.board.map((cell, i) => (
        <Cell isAlive={cell === 1 ? true : false} coord={i} key={i} />
      ))}
    </div>
  );
}

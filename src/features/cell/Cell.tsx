import { useAppDispatch } from '../../app/hooks';
import { setStateOfCell,  } from '../border/boardSlice';
import styles from './Cell.module.css';

interface CellProps {
  isAlive: boolean;
  coord: number;
}

export function Cell(props: CellProps) {
  const dispatch = useAppDispatch();

  return (
    <button
      onMouseDown={() => dispatch(setStateOfCell(props.coord))}
      onMouseOver={(e: React.MouseEvent) => e.buttons === 1 && dispatch(setStateOfCell(props.coord))}
      className={`${props.isAlive ? styles.aliveCell : styles.deadCell} ${styles.cell}`}>
    </button>
  );
}

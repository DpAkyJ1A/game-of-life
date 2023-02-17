import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectBoard, step, setRandomStates, clear, setBirth, setSurvive, possibleNumNeighbors } from '../border/boardSlice';
import style from './Controls.module.css';

export default function Controls() {
  const dispatch = useDispatch();
  const board = useSelector(selectBoard);
  const [start, setStart] = useState(true);
  const [startID, setStartID] = useState(null as NodeJS.Timer | null);

  const startBtnClick = () => {
    setStart(!start);
    if (start) {
      let counter = 0;
      let time = performance.now();
      setStartID(
        setInterval(() => {
          dispatch(step());
          counter++;
          if (counter === 10) {
            time = performance.now() - time;
            console.log('Время выполнения 10 итераций = ', Math.floor(time / 10) / 100 + 's');
            console.log('Это ' + Math.floor((10 * 1000 / time) * 100) / 100 + ' итераций в секунду');
          }
        }, 100)
      );
    } else {
      startID && clearInterval(startID);
    }
  }

  const event = (e: React.ChangeEvent) => {
    const target = e.currentTarget as HTMLInputElement;
    const newValue = new Set();
    target.value.split('').map((v) => {
      if ([0, 1, 2, 3, 4, 5, 6, 7, 8].includes(+v)) newValue.add(v);
    })
    target.value = Array.from(newValue).join('');
  }

  return (
    <header className={style.header}>
      <div className={style.rules}>
        <p>Rules:</p>
        <div style={{display: "flex", flexDirection: 'column', alignItems: 'center', gap: '0.2rem'}}>
          <div style={{display: "flex", gap: '0.5rem'}}>
            <p>B</p>
            <input
              onChange={(e: React.ChangeEvent) => {
                event(e);
                dispatch(setBirth((e.currentTarget as HTMLInputElement).value.split('').map((i) => +i) as possibleNumNeighbors[]))
              }}
              value={board.config.birth.toString().replace(/,/g, '')}
              maxLength={9}
            />
          </div>
          <div style={{display: "flex", gap: '0.5rem'}}>
            <p>S</p>
            <input
              onChange={(e: React.ChangeEvent) => {
                event(e);
                dispatch(setSurvive((e.currentTarget as HTMLInputElement).value.split('').map((i) => +i) as possibleNumNeighbors[]))
              }}
              value={board.config.survive.toString().replace(/,/g, '')}
              maxLength={9}
            />
          </div>
        </div>
      </div>
      <button onClick={startBtnClick} className={style.btn}>
        <svg xmlns="http://www.w3.org/2000/svg" className={`${style.icon} ${!start && style.disabled}`} viewBox="0 0 512 512"><title>Start</title><path d="M190.06 414l163.12-139.78a24 24 0 000-36.44L190.06 98c-15.57-13.34-39.62-2.28-39.62 18.22v279.6c0 20.5 24.05 31.56 39.62 18.18z" /></svg>
        <svg xmlns="http://www.w3.org/2000/svg" className={`${style.icon} ${start && style.disabled}`} viewBox="0 0 512 512"><title>Pause</title><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M176 96h16v320h-16zM320 96h16v320h-16z"/></svg>
      </button>
      <button onClick={() => dispatch(step())} className={style.btn}>
        <svg xmlns="http://www.w3.org/2000/svg" className={style.icon} viewBox="0 0 512 512"><title>Make a step</title><path d="M200 246.84c8.81 58.62-7.33 90.67-52.91 97.41-50.65 7.49-71.52-26.44-80.33-85.06-11.85-78.88 16-127.94 55.71-131.1 36.14-2.87 68.71 60.14 77.53 118.75zM223.65 409.53c3.13 33.28-14.86 64.34-42 69.66-27.4 5.36-58.71-16.37-65.09-49.19s17.75-34.56 47.32-40.21 55.99-20.4 59.77 19.74zM312 150.83c-8.81 58.62 7.33 90.67 52.9 97.41 50.66 7.49 71.52-26.44 80.33-85.06 11.86-78.89-16-128.22-55.7-131.1-36.4-2.64-68.71 60.13-77.53 118.75zM288.35 313.53c-3.13 33.27 14.86 64.34 42 69.66 27.4 5.36 58.71-16.37 65.09-49.19s-17.75-34.56-47.32-40.22-55.99-20.4-59.77 19.75z" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32"/></svg>
      </button>
      <p>Gen: {board.generation}</p>
      <button onClick={() => dispatch(setRandomStates())} className={`${style.btn} ${style.textBtn}`}>Random</button>
      <button onClick={() => dispatch(clear())} className={`${style.btn} ${style.textBtn}`}>Clear</button>
    </header>
  )
}

import './App.css';
import { Board } from './features/border/Board';
import Controls from './features/controls/Controls';

function App() {
  return (
    <div className='app'>
      <Controls />
      <Board />
    </div>
  );
}

export default App;

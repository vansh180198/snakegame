import logo from './logo.svg';
import './App.css';
import Snakegame from './Snakegame';

function App() {
  return (
    <div className="App">
      <Snakegame gridsize={15}/>
    </div>
  );
}

export default App;

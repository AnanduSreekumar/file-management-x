import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Home from './components/home/Home.js';

import util from './util/helpers';

function App() {
  // you are not authenticated to use this application!
  // if (!util.isLoggedIn()) {
  //   window.location = "/auth";
  //   return;
  // }

  return (
    <div className="App">
      <Home></Home>
    </div>
  );
}

export default App;

import React from 'react';
import logo from './logo.svg';
import { HashRouter as Router, Route, Link } from "react-router-dom";
import './App.css';

function Index(){
  return <h2>Home</h2>;
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          what is react
        </p>
        <p>Oh my god why doesn't this have proper text highlighting</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

function AppRouter(){
  return (
  <Router>
    <div>
      <nav>
        <ul>
          <li>
          <Link to="/">Home</Link>
          </li>
        </ul>
      </nav>
      <Route path="/" exact component={App} />
    </div>
  </Router>);
}

export default AppRouter;


import "./App.css";
import Home from "./components/Home/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
=======
import React from 'react';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

const App = () => {
  return (
    <div>
      <SignIn>
      
    </SignIn>
    <SignUp>
      
    </SignUp>
    </div>
    
  );
};


export default App;

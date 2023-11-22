
import "./App.css";
import Home from "./components/Home/Home";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp"
import { BrowserRouter, Route, Routes } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<SignIn />}></Route>
        <Route path="/register" element={<SignUp />}></Route>
      </Routes>
    </BrowserRouter>
  );
}


export default App;

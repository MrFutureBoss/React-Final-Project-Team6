import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import SignIn from "./components/Login/SignIn";
import SignUp from "./components/Login/SignUp";
import UserProfile from "./components/Profile/UserProfile";
import UpdateUser from "./components/Setting/UpdateUser";
import Footer from "./components/Home/Footer";

function App() {
  const userName = localStorage.getItem("userName");
  return (
    <BrowserRouter>
    
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<SignIn/>}> </Route>
        <Route path="/register" element={<SignUp/>}> </Route>
        <Route path={`/@${userName}`} element={<UserProfile/>}> </Route>
        <Route path="/settings" element={<UpdateUser/>}></Route>
      </Routes>
    <Footer/>
    </BrowserRouter>
  );
}
export default App;

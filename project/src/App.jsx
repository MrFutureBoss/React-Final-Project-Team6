import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import SignIn from "./components/Login/SignIn";
import SignUp from "./components/Login/SignUp";
import UserProfile from "./components/Profile/UserProfile";
import UpdateUser from "./components/Setting/UpdateUser";
import ArticleDetail from "./components/ArticleDetail";
import NewArticle from "./components/Article/NewArticle";
import Footer from "./components/Home/Footer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/settings" element={<UpdateUser/>}></Route>
        <Route path="/article/:slug" element={<ArticleDetail/>}/>
        <Route path="/login" element={<SignIn />}></Route>
        <Route path="/register" element={<SignUp />}></Route>
        <Route path="/:pusername" element={<UserProfile />}></Route>
        <Route path="/:pusername/favorites" element={<UserProfile />}></Route>
        <Route path="/settings" element={<UpdateUser />}></Route>
        <Route path="/editor" element={<NewArticle />}></Route>
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}
export default App;

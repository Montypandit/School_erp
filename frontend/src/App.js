import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './Home'
import AdminLogin from './admin/AdminLogin';
import AdminHome from './admin/AdminHome';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/admin/login' element={<AdminLogin/>}/>
        <Route path='/admin/home' element = {<AdminHome/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './Home'
import AdminLogin from './admin/AdminLogin';
import AdminHome from './admin/AdminHome';
import CoordinatorLogin from './component/coordinator/CoordinatorLogin';
import CoordinatorHome from './component/coordinator/CoordinatorHome';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/admin/login' element={<AdminLogin/>}/>
        <Route path='/admin/home' element = {<AdminHome/>}/>
        <Route path='/coordinator/login' element={<CoordinatorLogin/>}/>
        <Route path='/coordinator/home' element={<CoordinatorHome/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

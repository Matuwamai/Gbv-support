import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignUp from './pages/singup'
import Login from './pages/login'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dahboard'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes >
        <Route path='/' element={<SignUp/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route  element={<Navbar/>} >
        <Route path='/dashboard' element={<Login/>}/>
        </Route>
      </Routes> 
    </Router>
  </StrictMode>,
)

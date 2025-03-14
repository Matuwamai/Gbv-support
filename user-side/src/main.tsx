import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthContextProvider } from './context/authContext'
import SignUp from './pages/singup'
import Login from './pages/login'
import Layout from './components/Layout'
import NewPost from './components/Createpost'

import Dashboard from './pages/Dahboard'
createRoot(document.getElementById('root')!).render(

  <StrictMode>
  <AuthContextProvider >

    <Router>
      <Routes >
        <Route path='/' element={<SignUp/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route  element={<Layout/>} >
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/newpost' element={<NewPost/>}/>

        </Route>
      </Routes> 
    </Router>
  </AuthContextProvider >

  </StrictMode>

)

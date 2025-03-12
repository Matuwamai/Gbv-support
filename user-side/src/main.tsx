import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignUp from './pages/singup'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes >
        <Route path='/' element={<SignUp/>}/>
      </Routes>
    </Router>
  </StrictMode>,
)

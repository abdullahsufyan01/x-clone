import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/auth/login/Login'
import SignUp from './pages/auth/signup/SignUp'
import Home from './pages/auth/Home/Home'

function App() {

  return (
    <>
    <div className='flex max-w-6xl mx-auto'>
      <Routes>
        <Route path='/' element = {<Home/>}/>
        <Route path='/login' element = {<Login/>}/>
        <Route path='/register' element = {<SignUp/>}/>
      </Routes>
    </div>
    </>
  )
}

export default App

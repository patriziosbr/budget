import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import Container from 'react-bootstrap/Container';
import Aside from './components/layout/Aside';

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NotaSpese from './pages/NotaSpese.jsx'
import DashboardNotaSpese from './pages/DashboardSchedaSpese.jsx'
import SchedaSpesaDettaglio from './pages/SchedaSpesaDettaglio.jsx'

function App() {

  

  return (
    <>
      <Router>
        <Header />
        {/* <div className='d-flex'> */}
        <Aside />
          <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
          <Routes>
            <Route exact path='/login' element={<Login />} />
            <Route exact path='/register' element={<Register />} />
            <Route exact path='/' element={<Home />} />
            <Route exact path='/notaSpese' element={<NotaSpese />} />
            <Route exact path='/DashboardNotaSpese' element={<DashboardNotaSpese />} />
            <Route exact path='/DashboardNotaSpese/:id' element={<SchedaSpesaDettaglio />} />
          </Routes>
        </main>
        {/* </div> */}
      </Router>
      <ToastContainer />
    </>
  )
}

export default App

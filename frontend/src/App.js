import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import Container from 'react-bootstrap/Container';

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
        <div>
        <Container style={{marginTop:"10px"}}>
          <Routes>
            <Route exact path='/login' element={<Login />} />
            <Route exact path='/register' element={<Register />} />
            <Route exact path='/' element={<Home />} />
            <Route exact path='/notaSpese' element={<NotaSpese />} />
            <Route exact path='/DashboardNotaSpese' element={<DashboardNotaSpese />} />
            <Route exact path='/DashboardNotaSpese/:id' element={<SchedaSpesaDettaglio />} />
          </Routes>
        </Container>
        </div>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App

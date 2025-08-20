import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/layout/Header.jsx'
import Container from 'react-bootstrap/Container';
import Aside from './components/layout/Aside';

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NotaSpese from './pages/NotaSpese.jsx'
import DashboardNotaSpese from './pages/DashboardSchedaSpese.jsx'
import SchedaSpesaDettaglio from './pages/SchedaSpesaDettaglio.jsx'
import DashboardPublic from './components/dashboards/DashboardPublic.jsx'
import DashboardUser from './components/dashboards/DashboardUser'
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
function App() {

  

  return (
    <>
      <Router>
        {/* <div className='d-flex'> */}
        <Aside />
          {/* <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg "> */}
          <main className="vh-100 main-content position-relative max-height-vh-100 h-100 border-radius-lg ps ps--active-x ps--active-y">
          <Header />
          <Routes>
            <Route exact path='/login' element={<Login />} />
            <Route exact path='/register' element={<Register />} />
            <Route exact path='/' element={<Home />} />
            <Route exact path='/dashboard' element={<DashboardPublic />} />
            <Route exact path='/dashboardPrivate' element={<DashboardUser />} />
            {/* <Route exact path='/notaSpese' element={<NotaSpese />} /> */}
            <Route exact path='/note-spese' element={<DashboardNotaSpese />} />
            <Route exact path='/note-spese/:id' element={<SchedaSpesaDettaglio />} />
            <Route exact path='/forgot-password' element={<ForgotPassword />} />
            <Route exact path='/reset-password' element={<ResetPassword />} />
          </Routes>
        </main>
        {/* </div> */}
      </Router>
      <ToastContainer />
    </>
  )
}

export default App

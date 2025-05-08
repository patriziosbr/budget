import { FaSignInAlt, FaSignOutAlt, FaUser, FaDollarSign, FaList } from 'react-icons/fa'
import { useNavigate, NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'


import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';

function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  return (
    <>
      <Container fluid className="header-container">
        <Navbar className='container'>
          {/* Desktop view */}
          <div className="d-none d-md-block w-100">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex">
                <Navbar.Brand href='/' className='d-flex align-items-center'>
                  <FaDollarSign className="mr-1" />
                  Budget
                </Navbar.Brand>
                <Nav className="me-auto">
                  {user && (
                    <NavLink
                      style={{ marginRight: '10px', textDecoration: "none" }}
                      className="text-dark nav-item"
                      activeclassname="active"
                      to='/DashboardNotaSpese'
                    >
                      <FaList /> Expense List
                    </NavLink>
                  )}
                </Nav>
              </div>
              <div>
                {user ? (
                  <button className='btn nav-item' onClick={onLogout}>
                    <FaSignOutAlt /> Logout
                  </button>
                ) : (
                  <>
                    <NavLink to='/login' style={{ marginRight: '10px', textDecoration: "none" }} className="nav-item">
                      <FaSignInAlt /> Login
                    </NavLink>
                    <NavLink to='/register' style={{ textDecoration: "none" }} className="nav-item">
                      <FaUser /> Register
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Mobile view */}
          <div className="d-md-none w-100">
            
            <div className="mobile-nav">
              <NavLink to='/' style={{ textDecoration: "none" }} className="nav-item">
                <FaDollarSign />
                <span>Budget</span>
              </NavLink>
              
              {user && (
                <NavLink
                  style={{ textDecoration: "none" }}
                  className="text-dark nav-item"
                  activeclassname="active"
                  to='/DashboardNotaSpese'
                >
                  <FaList />
                  <span>Expenses</span>
                </NavLink>
              )}
              
              {user ? (
                <button className='nav-item border-0' onClick={onLogout} style={{ background: "none" }}>
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              ) : (
                <>
                  <NavLink to='/login' style={{ textDecoration: "none"}} className="nav-item">
                    <FaSignInAlt />
                    <span>Login</span>
                  </NavLink>
                  <NavLink to='/register' style={{ textDecoration: "none" }} className="nav-item">
                    <FaUser />
                    <span>Register</span>
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </Navbar>
      </Container>
    </>
  )
}

export default Header


// import { FaSignInAlt, FaSignOutAlt, FaUser, FaDollarSign } from 'react-icons/fa'
// import { useNavigate, NavLink } from 'react-router-dom'
// import { useSelector, useDispatch } from 'react-redux'
// import { logout, reset } from '../features/auth/authSlice'

// import Navbar from 'react-bootstrap/Navbar';
// import Nav from 'react-bootstrap/Nav';

// import Container from 'react-bootstrap/Container';


// function Header() {
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
//   const { user } = useSelector((state) => state.auth)

//   const onLogout = () => {
//     dispatch(logout())
//     dispatch(reset())
//     navigate('/')
//   }

//   return (
//     <>
//     <Container fluid className="bg-body-tertiary" style={{position:"fixed", top:"0", height:'60px', zIndex: 999}}>
//       <Navbar className='container' >
//         <Navbar.Brand href='/' className='d-flex align-items-center'>
//             <FaDollarSign className="mr-1"/>
//             Budget
//           </Navbar.Brand>
//           <Nav className="me-auto">
//             {user && (<NavLink style={{marginRight:'10px', textDecoration:"none"}} className="text-dark" activeclassname="active" to='/DashboardNotaSpese'>Expence List</NavLink> )}
//           </Nav>
//           <Navbar.Toggle />
//           <Navbar.Collapse className="justify-content-end">
//             <Navbar.Text>
//               {user ? (
//                 <button className='btn' onClick={onLogout}>
//                   <FaSignOutAlt /> Logout
//                 </button>
//               ) : (
//                 <>
//                   <NavLink to='/login' style={{marginRight:'10px', textDecoration:"none"}} >
//                     <FaSignInAlt /> Login
//                   </NavLink>
//                   <NavLink to='/register' style={{marginRight:'10px', textDecoration:"none"}}>
//                     <FaUser /> Register
//                   </NavLink>
//                 </>
//               )}
//             </Navbar.Text>
//           </Navbar.Collapse>
//       </Navbar>
      
//     </Container>
 
//     </>
//   )
// }

// export default Header

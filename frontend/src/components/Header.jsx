import { useState, useEffect } from 'react';
import { FaSignInAlt, FaSignOutAlt, FaUser, FaDollarSign, FaList, FaHome } from 'react-icons/fa'
import { useNavigate, NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'
import { toggleMenu } from '../features/utils/menuSlice';


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

  const [isSidenavOpen, setIsSidenavOpen] = useState(false);

  const toggleSidenav = () => {
    console.log("Toggle sidenav", isSidenavOpen);
    
    setIsSidenavOpen(!isSidenavOpen);
  };

  useEffect(() => {
    if (isSidenavOpen) {
      document.body.classList.add('g-sidenav-show');
    } else {
      document.body.classList.remove('g-sidenav-show');
    }
  }, [isSidenavOpen]);
const showMenu = useSelector((state) => state.menu) // or state.utils.menu if combined under utils
  return (
    <>
    <nav className="navbar navbar-main navbar-expand-lg px-0 mx-3 shadow-none border-radius-xl" id="navbarBlur" data-scroll="true">
      <div className="container-fluid py-1 px-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
            <li className="breadcrumb-item text-sm"><a className="opacity-5 text-dark" href=" ">Pages</a></li>
            <li className="breadcrumb-item text-sm text-dark active" aria-current="page">Dashboard </li>
          </ol>
        </nav>
        <div className="d-flex mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
          <div className="ms-md-auto pe-md-3 d-flex align-items-center">
            <div className="input-group input-group-outline">
              <label className="form-label">Type here...</label>
              <input type="text" className="form-control"/>
            </div>
          </div>
          <ul className="d-flex align-items-center  justify-content-end">
            <li className="nav-item d-flex align-items-center">
              <a className="btn btn-outline-primary btn-sm mb-0 me-3" target="_blank" href="https://www.creative-tim.com/builder?ref=navbar-material-dashboard">Online Builder</a>
            </li>
            <li className="mt-1">
              <a className="github-button" href="https://github.com/creativetimofficial/material-dashboard" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star creativetimofficial/material-dashboard on GitHub">Star</a>
            </li>
            <li className="nav-item d-xl-none ps-3 d-flex align-items-center">
   
              <a role="button" className="nav-link text-body p-0" id="iconNavbarSidenav" onClick={()=> dispatch(toggleMenu())}>
                <div className="sidenav-toggler-inner">
                  <i className="sidenav-toggler-line"></i>
                  <i className="sidenav-toggler-line"></i>
                  <i className="sidenav-toggler-line"></i>
                </div>
              </a>
            </li>
            <li className="nav-item px-3 d-flex align-items-center">
              <a href=" " className="nav-link text-body p-0">
                {/* <i className="material-symbols-rounded fixed-plugin-button-nav">settings</i> */}
                setteings
              </a>
            </li>
            <li className="nav-item dropdown pe-3 d-flex align-items-center">
              <a href=" " className="nav-link text-body p-0" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="material-symbols-rounded">notifications</i>
              </a>
              <ul className="dropdown-menu  dropdown-menu-end  px-2 py-3 me-sm-n4" aria-labelledby="dropdownMenuButton">
                <li className="mb-2">
                  <a className="dropdown-item border-radius-md" href=" ">
                    <div className="d-flex py-1">
                      <div className="my-auto">
                      </div>
                      <div className="d-flex flex-column justify-content-center">
                        <h6 className="text-sm font-weight-normal mb-1">
                          <span className="font-weight-bold">New message</span> from Laur
                        </h6>
                        <p className="text-xs text-secondary mb-0">
                          <i className="fa fa-clock me-1"></i>
                          13 minutes ago
                        </p>
                      </div>
                    </div>
                  </a>
                </li>
                <li className="mb-2">
                  <a className="dropdown-item border-radius-md" href=" ">
                    <div className="d-flex py-1">
                      <div className="my-auto">
                      </div>
                      <div className="d-flex flex-column justify-content-center">
                        <h6 className="text-sm font-weight-normal mb-1">
                          <span className="font-weight-bold">New album</span> by Travis Scott
                        </h6>
                        <p className="text-xs text-secondary mb-0">
                          <i className="fa fa-clock me-1"></i>
                          1 day
                        </p>
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <a className="dropdown-item border-radius-md" href=" ">
                    <div className="d-flex py-1">
                      <div className="avatar avatar-sm bg-gradient-secondary  me-3  my-auto">

                      </div>
                      <div className="d-flex flex-column justify-content-center">
                        <h6 className="text-sm font-weight-normal mb-1">
                          Payment successfully completed
                        </h6>
                        <p className="text-xs text-secondary mb-0">
                          <i className="fa fa-clock me-1"></i>
                          2 days
                        </p>
                      </div>
                    </div>
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item d-flex align-items-center">
              <a href="../pages/sign-in.html" className="nav-link text-body font-weight-bold px-0">
                <i className="material-symbols-rounded">account_circle</i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    </>
    // <>
    //   <Container fluid className="header-container">
    //     <Navbar className='container'>
    //       Desktop view
    //       <div className="d-none d-md-block w-100">
    //         <div className="d-flex justify-content-between align-items-center">
    //           <div className="d-flex">
    //             <Navbar.Brand href='/' className='d-flex align-items-center'>
    //               <FaDollarSign className="mr-1" />
    //               Budget
    //             </Navbar.Brand>
    //             <Nav className="me-auto">
    //               {user && (
    //                 <NavLink
    //                   style={{ marginRight: '10px', textDecoration: "none" }}
    //                   className="text-dark nav-item"
    //                   activeclassname="active"
    //                   to='/DashboardNotaSpese'
    //                 >
    //                   <FaList /> Expense List
    //                 </NavLink>
    //               )}
    //             </Nav>
    //           </div>
    //           <div>
    //             {user ? (
    //               <button className='btn nav-item' onClick={onLogout}>
    //                 <FaSignOutAlt /> Logout
    //               </button>
    //             ) : (
    //               <>
    //                 <NavLink to='/login' style={{ marginRight: '10px', textDecoration: "none" }} className="nav-item">
    //                   <FaSignInAlt /> Login
    //                 </NavLink>
    //                 <NavLink to='/register' style={{ textDecoration: "none" }} className="nav-item">
    //                   <FaUser /> Register
    //                 </NavLink>
    //               </>
    //             )}
    //           </div>
    //         </div>
    //       </div>
          
    //       Mobile view
    //       <div className="d-md-none w-100">
            
    //         <div className="mobile-nav">
    //           <NavLink to='/' style={{ textDecoration: "none" }} className="nav-item">
    //             <FaHome />
    //             <span>Home</span>
    //           </NavLink>
              
    //           {user && (
    //             <NavLink
    //               style={{ textDecoration: "none" }}
    //               className="text-dark nav-item"
    //               activeclassname="active"
    //               to='/DashboardNotaSpese'
    //             >
    //               <FaList />
    //               <span>Expenses</span>
    //             </NavLink>
    //           )}
              
    //           {user ? (
    //             <button className='nav-item border-0' onClick={onLogout} style={{ background: "none" }}>
    //               <FaSignOutAlt />
    //               <span>Logout</span>
    //             </button>
    //           ) : (
    //             <>
    //               <NavLink to='/login' style={{ textDecoration: "none"}} className="nav-item">
    //                 <FaSignInAlt />
    //                 <span>Login</span>
    //               </NavLink>
    //               <NavLink to='/register' style={{ textDecoration: "none" }} className="nav-item">
    //                 <FaUser />
    //                 <span>Register</span>
    //               </NavLink>
    //             </>
    //           )}
    //         </div>
    //       </div>
    //     </Navbar>
    //   </Container>
    // </>
  )
}

export default Header
import { useState, useEffect } from "react";
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
  FaDollarSign,
  FaList,
  FaHome,
} from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import { useNavigate, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import { toggleMenu, closeMenu } from "../features/utils/menuSlice";
import { FaRegUserCircle } from "react-icons/fa";
import RandomColorCircle from "./utils/RandomColorCircle.js";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  return (
    <>
      <nav
        className="navbar navbar-main navbar-expand-lg px-0 shadow-none border-radius-xl"
        id="navbarBlur"
        data-scroll="true"
      >
        <div className="container-fluid py-3">
          <div>
            <ul className="navbar-nav d-flex flex-row">
              <li
                role="button"
                className="d-flex flex-column justify-content-center align-items-center d-xl-none nav-link"
                onClick={() => dispatch(toggleMenu())}
              >
                <FaBars size="18" className="text-body p-0" />
                <small>Menu</small>
              </li>
            </ul>
          </div>
          {/* da fare un componente di breadcrumbs */}
          <nav aria-label="breadcrumb">
            {/* <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-0 px-0">
            <li className="breadcrumb-item text-sm">
              <NavLink className="text-decoration-none opacity-5 text-dark" to='/'>Home</NavLink>
            </li>
          </ol> */}
          </nav>
          {/* da fare un componente di breadcrumbs */}
          <div>
            <ul className="navbar-nav d-flex flex-row">
              <li
                onClick={(e) => {
                  dispatch(closeMenu());
                }}
              >
                <NavLink
                  role="button"
                  to={`${user ? "/profileTODO" : "/login"}`}
                  className="d-flex flex-column justify-content-center align-items-center ps-3 ps-sm-5 nav-link"
                >
                  {user ? (
                    <>
                      <RandomColorCircle
                        letter={user.email[0]}
                        tooltip={user.email}
                        email={user.email}
                      />
                      {/* <small className=""></small> */}
                    </>
                  ) : (
                    <>
                      <FaRegUserCircle size="20" className="text-body p-0" />
                      <small className="">Profile</small>
                    </>
                  )}
                </NavLink>
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
    //                   to='/note-spese'
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
    //               to='/note-spese'
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
  );
}

export default Header;

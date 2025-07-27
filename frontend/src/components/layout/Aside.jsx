import { Link } from "react-router-dom";
import { FaSignInAlt, FaSignOutAlt, FaUser, FaDollarSign, FaList, FaHome } from 'react-icons/fa'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { logout, reset } from '../../features/auth/authSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, NavLink } from 'react-router-dom'


const Aside = () => {
      const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    // Safely access menu from state, fallback to false if undefined
    const showMenu = useSelector((state) => state.menuShow.value);
    const onLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate('/')
    }

    return (
        <div className={`bg-gray-100 ${showMenu ? 'g-sidenav-show ' : ''}`}>
            <aside className="sidenav navbar navbar-vertical navbar-expand-xs border-radius-lg fixed-start ms-2  bg-white my-2" id="sidenav-main">
                <div className="sidenav-header">
                <i className="fas fa-times p-3 cursor-pointer text-dark opacity-5 position-absolute end-0 top-0 d-none d-xl-none" aria-hidden="true" id="iconSidenav"></i>
                <a className="navbar-brand px-4 py-3 m-0" href=" https://demos.creative-tim.com/material-dashboard/pages/dashboard " target="_blank">
                    <FaDollarSign className="mr-1" />
                    <span className="ms-1 text-sm text-dark">Budgetz</span>
                </a>
                </div>
                
                <div className="collapse navbar-collapse  w-auto " id="sidenav-collapse-main">
                <ul className="navbar-nav">
                    {/* <li className="nav-item">
                    <a className="nav-link active bg-gradient-dark text-white" href="../pages/dashboard.html">
                    
                        <span className="nav-link-text ms-1">Dashboard</span>
                    </a>
                    </li> */}
                    <li className="nav-item">
                    <a className="nav-link text-dark" href="../pages/tables.html">
                        
                        <span className="nav-link-text ms-1">Tables</span>
                    </a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link text-dark" href="../pages/billing.html">
                        
                        <span className="nav-link-text ms-1">Billing</span>
                    </a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link text-dark" href="../pages/virtual-reality.html">
                        
                        <span className="nav-link-text ms-1">Virtual Reality</span>
                    </a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link text-dark" href="../pages/rtl.html">
                        <span className="nav-link-text ms-1">RTL</span>
                    </a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link text-dark" href="../pages/notifications.html">
                        <span className="nav-link-text ms-1">Notifications</span>
                    </a>
                    </li>
                    <li className="nav-item mt-3">
                    <h6 className="ps-4 ms-2 text-uppercase text-xs text-dark font-weight-bolder opacity-5">Account pages</h6>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link text-dark" href="../pages/profile.html">
        
                        <span className="nav-link-text ms-1">Profile</span>
                    </a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link text-dark" href="../pages/sign-in.html">
    
                        <span className="nav-link-text ms-1">Sign In</span>
                    </a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link text-dark" href="../pages/sign-up.html">
                        
                        <span className="nav-link-text ms-1">Sign Up</span>
                    </a>
                    </li>
                </ul>
                </div>

                <div className="sidenav-footer position-absolute w-100 bottom-0 ">
                    <div className="mx-3">
                    {user ? (
                        <button className="btn btn-outline-dark mt-4 w-100" onClick={onLogout}>
                            <FaSignOutAlt /> Logout
                        </button>
                    ) : (
                        <>
                        <NavLink to='/login' className="btn btn-outline-dark mt-4 w-100" type="button">
                            <FaSignInAlt /> Login
                        </NavLink>
                        <NavLink to='/register' className="btn bg-gradient-dark text-white w-100">
                            <FaUser /> Register
                        </NavLink>
                        </>
                    )}
                    </div>
                </div>
            </aside>
        </div>
    )
}
export default Aside;
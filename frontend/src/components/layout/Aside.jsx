import { Link } from "react-router-dom";
import { FaSignInAlt, FaSignOutAlt, FaUser, FaDollarSign, FaList, FaHome } from 'react-icons/fa'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { logout, reset } from '../../features/auth/authSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, NavLink } from 'react-router-dom'
import { toggleMenu } from '../../features/utils/menuSlice';

const Aside = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)

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
                    <NavLink to='/' className="navbar-brand px-4 py-3 m-0" type="button" onClick={()=> dispatch(toggleMenu())}>
                        <FaDollarSign className="mr-1" />
                        <span className="ms-1 text-sm text-dark">Budget</span>
                    </NavLink>
                </div>
                
                <div className="collapse navbar-collapse  w-auto " id="sidenav-collapse-main">
                <ul className="navbar-nav">
                    <li className="nav-item">
                    <NavLink className="nav-link text-dark" to={`${user ? '/dashboardPrivate' : '/dashboard'}`} onClick={()=> dispatch(toggleMenu())}>
                        <span className="nav-link-text ms-1">Dashboard</span>
                    </NavLink>
                    </li>
                    <li className="nav-item">
                    {user && <NavLink className="nav-link text-dark" to='/DashboardNotaSpese' onClick={()=> dispatch(toggleMenu())}>
                        <span className="nav-link-text ms-1">Expence list</span>
                    </NavLink>}
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
                        <NavLink to='/login' className="btn btn-outline-dark mt-4 w-100" type="button" onClick={()=> dispatch(toggleMenu())}>
                            <FaSignInAlt /> Login
                        </NavLink>
                        <NavLink to='/register' className="btn bg-gradient-dark text-white w-100" onClick={()=> dispatch(toggleMenu())}>
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
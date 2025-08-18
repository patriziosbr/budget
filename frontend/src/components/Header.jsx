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
  );
}

export default Header;

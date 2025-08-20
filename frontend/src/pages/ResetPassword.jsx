import { useState, useEffect } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { login, reset } from "../features/auth/authSlice";
import Spinner from "../components/utils/Spinner";
import { toggleMenu, closeMenu } from "../features/utils/menuSlice";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import { useParams } from "react-router-dom";
// import { requestPasswordReset } from '../../../backend/controllers/userController';
import { useSearchParams } from "react-router-dom";

const API_URL =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_BASE_URL + "/api/users/"
    : "/api/users/";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState({});
  const [formData, setFormData] = useState({
    password: "",
    password2: "",
  });
  const { password, password2 } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    const paramId = searchParams.get("id");
    const paramToken = searchParams.get("token");
    e.preventDefault();

    if (password !== password2) {
      toast.error("Passwords do not match");
    } else {
      const userData = {
        password,
        paramId,
        paramToken,
      };
      resetPasswordAction(userData);
    }
  };

  const resetPasswordAction = (userData) => {
    axios
      .post(`${API_URL}resetPassword`, { userData })
      .then((res) => {
        toast.success(<Msg />, {
          toastId: "err1",
          autoClose: false,
          closeOnClick: true,
          draggable: false,
          pauseOnHover: true,
          onClose: () => goToLogin(),
        });
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error.message, "evvore");
      });
  };

  const goToLogin = () => {
    navigate("/login");
  };

  function Msg() {
    return (
      <div>
        <span>
          A password reset link has been sent to your email. Please check your
          inbox,
          <span
            className="text-primary"
            role="button"
            onClick={() => goToLogin()}
          >
            <u>login</u>
          </span>{" "}
          to continue
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="container my-auto mt-5">
        <div className="row">
          <div className="col-lg-6 col-md-8 col-12 mx-auto">
            <div className="card z-index-0 fadeIn3 fadeInBottom">
              <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div className="bg-gradient-dark shadow-dark border-radius-lg py-3 pe-1">
                  <h4 className="text-white font-weight-bolder text-center my-2">
                    Reset your password
                  </h4>
                </div>
              </div>

              <div className="card-body">
                <Form className="text-start my-3" onSubmit={onSubmit}>
                  <Form.Group className=" mb-3">
                    <Form.Label>New password</Form.Label>
                    <Form.Control
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      placeholder=""
                      onChange={onChange}
                    />
                  </Form.Group>
                  <Form.Group className=" mb-3">
                    <Form.Label>Confirm password</Form.Label>
                    <Form.Control
                      type="password2"
                      id="password2"
                      name="password2"
                      value={password2}
                      placeholder=""
                      onChange={onChange}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="btn bg-gradient-dark w-100 my-4 mb-2 p-2"
                  >
                    Reset password
                  </Button>
                  <div>
                    <p className="mt-4 text-sm text-center">
                      Don't have an account?
                      <NavLink
                        className="text-primary text-gradient font-weight-bold"
                        to="/register"
                      >
                        <span className="nav-link-text ms-1">Register</span>
                      </NavLink>
                    </p>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;

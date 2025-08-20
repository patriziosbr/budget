import { useState, useEffect } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { login, reset } from "../features/auth/authSlice";
import { toggleMenu, closeMenu } from "../features/utils/menuSlice";
import { countDownParser } from "../components/utils/dateParser";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import { useRef } from "react";
// import { requestPasswordReset } from '../../../backend/controllers/userController';

const API_URL =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_BASE_URL + "/api/users/"
    : "/api/users/";

function ForgotPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
  });
  const { email } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Validate form data
    if (!email) {
      toast.error("Please fill in all fields");
      return;
    }
    resetPasswordAction(email);
  };

  function Msg() {
    return (
      <div>
        <span>
          A password reset link has been sent to your email. Please check your
          inbox,
          <br />
          <br />
          <span
            className="text-primary"
            role="button"
            onClick={() => navigate("/login")}
          >
            <u>login</u>
          </span>{" "}
          to continue
        </span>
      </div>
    );
  }

  const [time, setTime] = useState(20);
  const [sendMailDisabled, setSendMailDisabled] = useState(false);
  const timerRef = useRef(null);

  const startCountDown = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTime(20); // Always reset time
    const now = Date.now();
    const resendAllowedAt = now + 5 * 1000;
    localStorage.setItem("mailResendAllowedAt", resendAllowedAt);

    timerRef.current = setInterval(() => {
      setTime((currTime) => {
        if (currTime === 0) {
          clearInterval(timerRef.current);
          localStorage.removeItem("mailResendAllowedAt");
          return 0;
        } else {
          return currTime - 1;
        }
      });
    }, 1000);
  };

  useEffect(() => {
    const allowed =
      Date.now() < Number(localStorage.getItem("mailResendAllowedAt"));
    setSendMailDisabled(allowed);
  }, [time]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const resetPasswordAction = (mail) => {
    setSendMailDisabled(true)
    axios
      .post(`${API_URL}requestPasswordReset`, { mail })
      .then((res) => {
        toast.success(<Msg />, {
          toastId: "err1",
          autoClose: false,
          closeOnClick: false,
          draggable: false,
          pauseOnHover: true,
        });
        startCountDown();
      })
      .catch((error) => {
        console.log(error, "evvore");
        toast.error(error);
      });
  };

  return (
    <>
      <div className="container my-auto mt-5">
        <div className="row">
          <div className="col-lg-6 col-md-8 col-12 mx-auto">
            <div className="card z-index-0 fadeIn3 fadeInBottom">
              <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div className="bg-gradient-dark shadow-dark border-radius-lg py-3 pe-1">
                  <h4 className="text-white font-weight-bolder text-center my-2">
                    Forgot password?
                  </h4>
                </div>
              </div>

              <div className="card-body">
                <p className="mb-0">
                  Don't worry, we'll send you a link to your email address to
                  reset it.
                </p>
                <Form className="text-start my-3" onSubmit={onSubmit}>
                  <Form.Group className=" mb-3">
                    <Form.Label>Your email</Form.Label>
                    <Form.Control
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      placeholder=""
                      onChange={onChange}
                    />
                  </Form.Group>
                  { sendMailDisabled && <small className="mb-0 text-danger">You can resend the next email to reset you password in {countDownParser(time)} seconds</small>}
                  <Button
                    type="submit"
                    className="btn bg-gradient-dark w-100 my-4 mb-2 p-2"
                    disabled={sendMailDisabled}
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

export default ForgotPassword;

import { useSelector, useDispatch } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import RandomColorCircle from "../components/utils/RandomColorCircle";
import { logout, reset, updateUser, deleteUser } from "../features/auth/authSlice";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import { FaPencilAlt } from "react-icons/fa";
import axios from "axios";
import { useRef, useEffect } from "react";
import { countDownParser } from "../components/utils/dateParser";

import Modal from "react-bootstrap/Modal";

const API_URL =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_BASE_URL + "/api/users/"
    : "/api/users/";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: user.name,
  });
  const { name } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (name === user.name) {
      // toast.error("Change at least one field");
      setOpenEdit(false);
      return;
    } else {
      if (name.length < 3) {
        return toast.error("Insert at least 3 character");
      }

      const userData = {
        id: user._id,
        name,
      };
      try {
        await dispatch(updateUser(userData)).unwrap();
        toast.success("User successfully updated");
        setOpenEdit(false);
      } catch (error) {
        toast.error(error.message || "Error");
        console.error(error);
      }
    }
  };

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  const [modalState, setModalState] = useState({
    deleteModal: false,
  });
    const handleShow = (modalType) => {
    setModalState((prevState) => ({
      ...prevState,
      [modalType]: true,
    }));
  };
  const handleClose = (modalType) => {
  setModalState((prevState) => ({
    ...prevState,
    [modalType]: false,
  }));}

const handleDeleteUser = async () => {
  try {
    await dispatch(deleteUser(user._id)).unwrap();
    toast.success("Goodbye");
  } catch (error) {
    console.error(error, "delete user error");
    toast.error(error.message || "Errore");
  } finally {
    dispatch(logout());
    dispatch(reset());
    handleClose("deleteUser"); // Close modal if open
    navigate("/");
  }
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
    setSendMailDisabled(true);
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
        toast.error(error.message || "Error");
        setSendMailDisabled(false);
      });
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

  const [openEdit, setOpenEdit] = useState(false);

  return (
    <div className="container m-auto">
      <div className="row">
        <div className="col-12">
          <div className="d-flex align-items-center mb-4 mt-0">
            <h3 className="mb-0 h4 font-weight-bolder">Profile</h3>
          </div>
        </div>
      </div>

      <div className="row gutters-sm">
        <div className="col-12 col-lg-6 col-xl-4 mb-3">
          <div className="p-3 h-100">
            <div className="card-body">
              <div className="d-flex flex-column align-items-center text-center">
                <div className="mt-3">
                  <RandomColorCircle
                    letter={user?.email}
                    email={user?.email}
                    className={"circle-large"}
                  />
                  <h4 className="mt-4">{user.name}</h4>
                  <p className="text-muted font-size-sm">{user.email}</p>
                  <button
                    className="btn btn-outline-dark"
                    onClick={() => onLogout()}
                  >
                    Logout
                  </button>
                  {/*<button className="btn btn-outline-danger">Delete</button> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {!openEdit && (
          <div className="col-12 col-lg-6 col-xl-8 mb-3">
            <div className="card h-100">
              <div className="card-body ">
                <div className="row">
                  <div className="col-6 col-sm-4">
                    <h6 className="mb-0">Full Name</h6>
                    <div className="text-secondary">{user.name}</div>
                  </div>
                  <div className="col-6 col-sm-8 d-flex justify-content-end">
                    <button
                      className="btn btn-outline-dark"
                      onClick={() => setOpenEdit(true)}
                    >
                      <FaPencilAlt size={15} />
                    </button>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-6 col-sm-4">
                    <h6 className="mb-0">Email</h6>
                    <div className="text-secondary">{user.email}</div>
                  </div>
                  <div className="col-6 col-sm-8 d-flex justify-content-end"></div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-6 col-sm-4">
                    <h6 className="mb-0">Password</h6>
                    <div className="text-secondary">°°°°°°°°°</div>
                  </div>
                  <div className="col-6 col-sm-8 d-flex justify-content-end">
                    <button
                      disabled={sendMailDisabled}
                      className="btn btn-outline-dark"
                      onClick={() => resetPasswordAction(user.email)}
                    >
                      Send reset link
                    </button>
                  </div>
                  <div className="text-secondary">
                    {sendMailDisabled && (
                      <small className="mb-0 text-danger">
                        You can resend the next email to reset you password in{" "}
                        {countDownParser(time)} seconds
                      </small>
                    )}
                  </div>
                </div>
                <hr />

                <div className="row align-items-center">
                  <div className="col-6 col-sm-5">
                    <h6 className="text-danger mb-0">Danger zone</h6>
                    <div className="text-secondary">
                      This action can't be undone
                    </div>
                  </div>
                  <div className="col-6 col-sm-7 d-flex justify-content-end">
                    <button className="btn btn-outline-danger mb-0" onClick={()=>{    handleShow("deleteUser")}}>
                      Delete account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {openEdit && (
          <>
            <div className="col-md-8 mb-3">
              <div className="card h-100 p-3">
                <Form className="mb-3" onSubmit={onSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      id="name"
                      name="name"
                      value={name}
                      placeholder="Name"
                      onChange={onChange}
                    />
                  </Form.Group>
                  <div className="d-flex align-item-center justify-content-end text-center gap-3">
                    <button
                      type="button"
                      className="btn btn-outline-dark"
                      onClick={() => setOpenEdit(false)}
                    >
                      <p className="m-0">Cancel</p>
                    </button>
                    <button
                      type="submit"
                      className="btn bg-gradient-dark w-25 "
                    >
                      <p className="m-0">Edit</p>
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          </>
        )}
      </div>

      {/* <div className="row mt-4">
        <div className="col-sm-6 mb-3">
          <div className="card h-100">
            <div className="card-body"></div>
          </div>
        </div>
        <div className="col-sm-6 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="d-flex align-items-center mb-3">
                <i className="material-icons text-info mr-2">assignment</i>
                Project Status
              </h6>
            </div>
          </div>
        </div>
      </div> */}

      {/* <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body p-3">
              <div className="row">
                <div className="col-12 d-flex justify-content-center">



                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <Modal
        show={modalState.deleteUser}
        onHide={() => handleClose("deleteUser")}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <b>
              Confirm to delete: <i>{user.name}</i>?
            </b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure to delete your account,
            <br /> <b>this action can be undone</b>{" "}
          </p>
          <div className="row mt-4 mb-3">
            <div className="col-4">
              <button
                className=" text-dark btn btn-outline-dark btn-sm mb-0 w-100"
                onClick={() => handleClose("deleteUser")}
              >
                <p className="mb-0 ">cancel</p>
              </button>
            </div>
            <div className="col-8">
              <button
                className="text-danger btn border border-1 border-danger w-100 "
                // onClick={() => dispatch(deleteSchedaSpese(scheda._id))}
                onClick={() => handleDeleteUser()}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Profile;

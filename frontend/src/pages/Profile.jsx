import { useSelector, useDispatch } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import RandomColorCircle from "../components/utils/RandomColorCircle";
import { logout, reset, updateUser } from "../features/auth/authSlice";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import { FaPencilAlt } from "react-icons/fa";


const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });
  const { name, email, password, password2 } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (name === user.name && email === user.email) {
      toast.error("Change at least one field");
    } else {
      if (!validateEmail(email)) {
        return toast.error("Insert a valid mail");
      }
      if (name.length < 3) {
        return toast.error("Insert at least 3 character");
      }
      
      const userData = {
        id: user._id,
        name,
        email,
      };
      try {
        await dispatch(updateUser(userData)).unwrap()
        toast.success("User successfully updated")
      } catch (error) {
        toast.error(error.message || "Error")
        console.error(error)
      }
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  const [openEdit, setOpenEdit] = useState(false);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex align-items-center mb-4 mt-0">
            <h3 className="mb-0 h4 font-weight-bolder">Profile</h3>
          </div>
        </div>
      </div>

      <div className="row gutters-sm">
        <div className="col-12 col-md-4 mb-3">
          <div className="card h-100">
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
          <div className="col-12 col-md-8 mb-3">
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
                    <h6 className="mb-0">Password</h6>
                    <div className="text-secondary">°°°°°°°°°</div>
                  </div>
                  <div className="col-6 col-sm-8 d-flex justify-content-end">
                    <button className="btn btn-outline-dark">
                      Send reset link
                    </button>
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
                    <button className="btn btn-outline-danger mb-0">
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
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      placeholder="Email"
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
    </div>
  );
};

export default Profile;

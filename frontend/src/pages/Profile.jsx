import { useSelector, useDispatch } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import RandomColorCircle from "../components/utils/RandomColorCircle";
import { logout, reset } from "../features/auth/authSlice";

const Profile = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const onLogout = () => {
      dispatch(logout())
      dispatch(reset())
      navigate('/')
  }


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
                  <button className="btn btn-outline-dark" onClick={()=>onLogout()}>Logout</button>
                  {/*<button className="btn btn-outline-danger">Delete</button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-8 mb-3">
          <div className="card h-100">
            <div className="card-body ">
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">Full Name</h6>
                </div>
                <div className="col-sm-9 text-secondary">{user.name}</div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">Email</h6>
                </div>
                <div className="col-sm-9 text-secondary">{user.email}</div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">Password</h6>
                </div>
                <div className="col-sm-9 text-secondary">°°°°°°°°°</div>
              </div>
              <hr />

              <div className="row">
                <div className="col-sm-12">
                  <button className="btn bg-dark text-white me-2">Edit</button>
                  <button className="btn btn-outline-danger">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
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

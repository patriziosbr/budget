import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSchedaSpese } from "../features/schedaSpese/schedaSpeseSlice";
import SingleScheda from "./SingleScheda";
import { useNavigate, NavLink } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import { logout } from "../features/auth/authSlice";
import Spinner from "./Spinner";

const GestioneError = {
  message: "Cannot read properties of null (reading 'token')",
};

function SchedaSpese({ handleShow }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { schedaSpese, isLoading, isError, message } = useSelector(
    (state) => state.schedaSpese
  );
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (user) {
      dispatch(getSchedaSpese())
        .unwrap()
        .then((response) => {
          console.log("tuttook");
        })
        .catch((error) => {
          if (error.includes("500")) {
            toast.error("Service unavailable, try again later");
          }
          console.error("Error Response:", error); // Debugging
        });
    }
  }, []);
  //è per il margine inferiore della pagina
  const isLastElement = (arr) => {
    const lastElement = arr[arr.length - 1];
    return lastElement._id;
  };

  let isClosing = false;
  const goToLogin = () => {
    isClosing = true;
    dispatch(logout());
    navigate("/login");
  };

  function Msg() {
    return (
      <div>
        <span>
          Error: Please{" "}
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

  if (isLoading) {
    return (
    <>
      <Spinner/>
    </>
    )
  }
  if (isError) {
    return (
      <p className="text-danger">
        Error: {message}
        <br />
        Please
        <span
          className="text-primary"
          role="button"
          onClick={() => goToLogin()}
        >
          <u>login </u>
        </span>
        to continue
      </p>
    );
  }

  if (GestioneError.message === message) {
    toast.error(<Msg />, {
      toastId: "err1",
      autoClose: false,
      closeOnClick: true,
      draggable: false,
      pauseOnHover: true,
      onClose: () => goToLogin(),
    });
    return <>{isClosing && <p>Loading...</p>}</>;
  }

  return (
    <>
      <section>
        <div className="d-flex justify-content-between align-items-center mb-4 mt-0">
          <h2 className="mb-0 align-self-center">Expence list</h2>
          {schedaSpese.length > 0 && (
            <div className=" btn bg-gradient-dark mb-0" onClick={handleShow}>
              <p className="mb-0">Create list</p>
            </div>
          )}
        </div>

        {schedaSpese.length > 0 ? (
          // {{schedaSpese.slice(-1)}}
          schedaSpese.map((scheda, i, arr) => (
            // <div  style={{ marginBottom: '100px'}} key={scheda._id}>
            <div
              style={{
                marginBottom:
                  isLastElement(schedaSpese) === scheda._id ? "120px" : "",
              }}
              key={scheda._id}
            >
              <SingleScheda key={scheda._id} scheda={scheda} />
            </div>
          ))
        ) : (
          <>
            {user ? (
              <>
                <h5>Create a new list</h5>
                <p>Expence list is empty, create a list to start your budget</p>
                <div className="col-3">
                  <div className="btn bg-gradient-dark" onClick={handleShow}>
                    <p className="mb-0">Create list</p>
                  </div>
                </div>
              </>
            ) : (
              <p>
                Please
                <span
                  className="text-primary"
                  role="button"
                  onClick={() => goToLogin()}
                >
                  <u> login </u>
                </span>
                to continue
              </p>
            )}
          </>
        )}
      </section>
    </>
  );
}

export default SchedaSpese;

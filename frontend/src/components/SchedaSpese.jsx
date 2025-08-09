import { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { getSchedaSpese } from "../features/schedaSpese/schedaSpeseSlice";
import SingleScheda from "./SingleScheda";
import { useNavigate, NavLink } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import { toast } from 'react-toastify'
import { logout } from '../features/auth/authSlice';

const GestioneError = {
  message: "Cannot read properties of null (reading 'token')"
};

function SchedaSpese({ handleShow }) {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { schedaSpese, isLoading, isError, message } = useSelector(
    (state) => state.schedaSpese
  )
  const { user } = useSelector((state) => state.auth)
  useEffect(() => {
    if (user) {
      dispatch(getSchedaSpese()).unwrap()
        .then((response) => {
          console.log("tuttook");
        })
        .catch((error) => {
          if (error.includes('500')) {
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
  }


  let isClosing = false;
  const goToLogin = () => {
    isClosing = true;
    dispatch(logout());
    navigate('/login');
  }

  function Msg() {
    return (
      <div>
        <span>
          Error: Please <span className='text-primary' role="button" onClick={() => goToLogin()}><u>login</u></span> to continue
        </span>
      </div>
    );
  }

  if (isLoading) return <p>Loading...</p>;
  if (isError) {
    return (
      <p className="text-danger">Error: {message}
        <br />
        Please
        <span className='text-primary' role="button" onClick={() => goToLogin()}>
          <u>login </u>
        </span>
        to continue
      </p>
    )
  }

  if (GestioneError.message === message) {
    toast.error(
      <Msg />,
      { toastId: 'err1', autoClose: false, closeOnClick: true, draggable: false, pauseOnHover: true, onClose: () => goToLogin() }
    );
    return (
      <>
        {isClosing && <p>Loading...</p>}
      </>
    )
  }

  return (
    <>
      <section>
        {schedaSpese.length > 0 ? (
          // {{schedaSpese.slice(-1)}}
          schedaSpese.map((scheda, i, arr) => (
            // <div  style={{ marginBottom: '100px'}} key={scheda._id}>
            <div style={{ marginBottom: isLastElement(schedaSpese) === scheda._id ? '120px' : '' }} key={scheda._id}>
              {/* {JSON.stringify(scheda)} */}
              {/* {getTotale(scheda)} */}
              <SingleScheda key={scheda._id} scheda={scheda} />
            </div>
          ))
        ) : (
          <>
            {user ?
              (<>

              <h5>Create a new list</h5>
              <p>Expence list is empty, create a list to start your budget</p>
              <div className="col-3">
                <div className="btn bg-gradient-dark" onClick={handleShow}>
                  <p className="mb-0">
                    Create list
                  </p>
                </div>
              </div>
              </>) :
              (<p>
                Please
                <span className='text-primary' role="button" onClick={() => goToLogin()}>
                  <u> login </u>
                </span>
                to continue
              </p>)}
          </>
        )}
      </section>
    </>
  );
}

export default SchedaSpese


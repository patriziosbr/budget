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

function SchedaSpese() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { schedaSpese, isLoading, isError, message } = useSelector(
    (state) => state.schedaSpese
  )

  useEffect(() => {
    dispatch(getSchedaSpese()).unwrap();
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
    navigate('/');
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
        Please <span className='text-primary' role="button" onClick={() => goToLogin()}>
          <u>login</u>
        </span> to continue
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
          <p>No schede available.</p>
        )}
      </section>
    </>
  );
}

export default SchedaSpese


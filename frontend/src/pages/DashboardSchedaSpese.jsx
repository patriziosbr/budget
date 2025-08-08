import { FaPlus } from 'react-icons/fa';
import { useState } from 'react'
import { useSelector } from "react-redux";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import SchedaSpeseForm from '../components/SchedaSpeseForm';
import SchedaSpese from '../components/SchedaSpese';


function DashboardSchedaSpese() {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const { user } = useSelector((state) => state.auth);
  const { schedaSpese, isLoading, isError, message } = useSelector(
    (state) => state.schedaSpese
  )
  const handleClose = () => {
    setShow(false); // Reset Redux state when closing the modal
  };

  return (
    <>
      {user &&
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-8 m-auto">
              <div className='d-flex justify-content-between align-items-center mb-4 mt-0'>
                <h2 className='mb-0 align-self-center mt-sm-4'>Expence list</h2>
                <div className=" btn bg-gradient-dark mb-0" onClick={handleShow}>
                  <p className="mb-0">
                    Create list
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      {schedaSpese.length > 0 ?
        (
          <div className="container ">
            <div className="row">
              <div className="col-12 col-md-8 m-auto">
                <><SchedaSpese /></>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="container">
              <div className="row">
                  <h5>Create a new list</h5>
                  <p>Expence list are empty, create a list to start your budget</p>
                  <div className="col-3">
                    <div className="btn bg-gradient-dark" onClick={handleShow}>
                      <p className="mb-0">
                        Create list
                      </p>
                    </div>
                  </div>
              </div>
            </div>
          </>
        )}


      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title><b>Create new list</b></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SchedaSpeseForm onSuccess={handleClose} />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default DashboardSchedaSpese
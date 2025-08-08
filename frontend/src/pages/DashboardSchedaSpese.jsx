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
      <div className="container-fluid">
        <div className='d-flex justify-content-between align-items-center mb-4 mt-0'>
          <h2 className='mb-0 align-self-center mt-sm-4'>Expence list</h2>

          {/* <Button variant="outline-secondary" className='d-flex align-items-center mt-sm-4' onClick={handleShow}>
            <FaPlus className="me-2"/>
            Scheda
          </Button> */}
          <div className="d-flex align-items-center btn bg-gradient-dark mb-0" onClick={handleShow}>
              <FaPlus className="me-2"/>
              <p className="mb-0">
                Create list
              </p>
          </div>
        </div>
      </div>
      }
{schedaSpese.length < 0 ? (<><SchedaSpese/></>) : 
(
<>
      <div className="container-fluid">
        <div className="row">
          <h5>Create a new list</h5>
          <p>Expence list are empty, create a list to start your budget</p>
          <div className="col-3">
            <div className="d-flex align-items-center btn bg-gradient-dark mb-0" onClick={handleShow}>
                <FaPlus className="me-2"/>
                <p className="mb-0">
                  Create list
                </p>
            </div>
          </div>
        </div>
      </div>
</>)  }
      
      
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
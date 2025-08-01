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

  const handleClose = () => {
    setShow(false); // Reset Redux state when closing the modal
  };

  return (
    <>
      {user && 
      <div className="container-fluid">
        <div className='d-flex justify-content-between mb-4 mt-0'>
          <h2 className='mb-0 align-self-center mt-sm-4'>Expence list</h2>

          <Button variant="outline-secondary" className='d-flex align-items-center mt-sm-4' onClick={handleShow}>
            <FaPlus className="me-2"/>
            Scheda
          </Button>
        </div>
      </div>
      }

      <SchedaSpese/>
      
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title><b>Crea scheda</b></Modal.Title>
        </Modal.Header>
        <Modal.Body>            
          <SchedaSpeseForm onSuccess={handleClose} />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default DashboardSchedaSpese
import { FaPlus } from 'react-icons/fa';
import { FaRegCheckCircle } from "react-icons/fa";
import { FaRegTimesCircle } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import NotaSpeseForm from '../components/NotaSpeseForm';
import Table from 'react-bootstrap/Table';
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import useLongPress from "./utils/useLongPress.js";
import { useSelector, useDispatch } from 'react-redux'
import RandomColorCircle from './utils/RandomColorCircle.js';
import { getSchedaSpese, updateSchedaSpese, deleteSchedaSpese, singleSchedaSpeseGet } from '../features/schedaSpese/schedaSpeseSlice'
import EmailShareList from './utils/EmailShareList';
import { useNavigate, NavLink } from 'react-router-dom'


function SingleScheda({scheda}) {
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
    const [modalState, setModalState] = useState({
        creaNotaModal: false,
        shareModal: false,
        deleteModal: false,
    });
    const [longPressCount, setlongPressCount] = useState(0)
    const [formData, setFormData] = useState({titolo: scheda.titolo })
    const { titolo } = formData
    const dispatch = useDispatch()
    const sharedUserLetter = scheda.condivisoConList.length > 0 ? true : false

    const [sharedUserUpdateForm, setSharedUserUpdateForm] = useState({
        titolo: scheda.titolo,
        condivisoConList: [],
        removedEmails: [],
    })
  
    const { condivisoConList } = sharedUserUpdateForm


    // Add a state to track if the form has been modified
    const [isFormModified, setIsFormModified] = useState(false);
    
    // // Track original list on modal open
    // const [originalEmailList, setOriginalEmailList] = useState([]);

    const removeSharedUser = (userMail) => {
        setSharedUserUpdateForm((f) => ({
            ...f,
            removedEmails: [...f.removedEmails, {mail: userMail.email, mailId: userMail._id}],
        }));
        // debugger
        setIsFormModified(true);
    }

    const addEmail = (newEmailEntry) => {
        setSharedUserUpdateForm((f) => ({
            ...f,
            condivisoConList: [...f.condivisoConList, newEmailEntry],
        }));
        console.log("newEmailEntry", newEmailEntry);
        
        setIsFormModified(true);
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    const removeEmail = (email) => {
        setSharedUserUpdateForm((prev) => ({
        ...prev,
        condivisoConList: prev.condivisoConList.filter((entry) => entry.email !== email),
        }));
    };

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
        }));
        setIsFormModified(false); // Reset form modified state
    };

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
          href=""
          ref={ref}
          onClick={e => {
            e.preventDefault();
            onClick(e);
          }}
        >
          {children}
          <span className="threedots" />
        </a>
      ));
      
      const onLongPress = () => {
        setlongPressCount(longPressCount + 1)
      };

      const defaultOptions = {
        shouldPreventDefault: true,
        delay: 500,
      };
      const longPressEvent = useLongPress(onLongPress, defaultOptions);

      const updateSchedataTitolo = async () => {
        const updatePayload = { titolo: titolo };
        
        await dispatch(updateSchedaSpese({ schedaId: scheda._id, ...updatePayload })).unwrap();
        await dispatch(getSchedaSpese()).unwrap();
      }
    
      const parseDate = (dateString) => { 
        const date = new Date(dateString);
        const day = String(date.getUTCDate()).padStart(2, '0'); 
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); 
        const year = date.getUTCFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate
    } 

    const editSharedUserSubmit = async (e) => {
        e.preventDefault();
        
        const updatePayload = { 
            titolo: sharedUserUpdateForm.titolo,
            condivisoConList: sharedUserUpdateForm.condivisoConList,
            removedEmails: sharedUserUpdateForm.removedEmails  
        };
        await dispatch(updateSchedaSpese({schedaId: scheda._id, ...updatePayload})).unwrap()
        .then((payload) => console.log('fulfilled', payload))
        await dispatch(getSchedaSpese()).unwrap();
        // handleClose("shareModal")
    }

    const getTotale = (notaSpese) => {
        const initialValue = 0;
        const importoArray = [];
        notaSpese.map((spesa) => {
          importoArray.push(spesa.importo);
        })
    
        const importoSummed = importoArray.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          initialValue,
        );
        
        return importoSummed.toFixed(2);
      }

    const goToDettagolioScheda = (schedaID) => {
        navigate(`/DashboardNotaSpese/${schedaID}`);

    }

    return (
        < >
        <div className="row" >
        {/* {console.log("user", user)} */}
            <div className='col-12 d-flex justify-content-between align-items-center py-4'>
                {longPressCount < 1 &&
                    <div className='col-6'  >
                        <div
                            className='d-flex align-items-center'
                            onClick={()=>goToDettagolioScheda(scheda._id)}
                            {...longPressEvent}
                            style={{height: "50px", cursor: "pointer"}}>
                            <h6 style={{textTransform: "capitalize", textDecoration:"underline"}} 
                                role="button" 
                                className='mb-0 w-100'
                                >
                                {scheda.titolo}
                            </h6>
                        </div>
                        {/* <div 
                            style={{height: "50px", width: "50px", cursor: "pointer"}} 
                            className='d-flex justify-content-center align-items-center me-2' 
                            onClick={()=>goToDettagolioScheda(scheda._id)}>
                            <FaArrowRight className="mb-0"/>
                        </div> */}
                        {/* <div 
                            style={{height: "50px", width: "50px", cursor: "pointer"}} 
                            className='d-flex justify-content-center align-items-center'>
                            {sharedUserLetter && ( <FaUserFriends className="" onClick={()=>handleShow("shareModal")} /> )}
                        </div> */}
                        {/* {scheda.condivisoCon.length > 0 && ( <RandomColorCircle letter={sharedUserLetter} tooltip={sharedUserMail} className="ms-4"/> )} */}
                    </div>
                }
                {longPressCount > 0 && 
                <div className='col-12 col-md-6 d-grid d-grid' style={{gridTemplateColumns: '2fr 1fr 1fr', height: "50px"}} >
                    <div className="rounded">
                        <input className='w-100 h-100 rounded' maxlength="20" name="titolo" type='text' value={titolo} onChange={onChange}/> 
                    </div>
                    <div className='d-flex align-items-center justify-content-center '>
                        <FaRegCheckCircle size={20} onClick={()=> updateSchedataTitolo()}/>
                    </div>
                    <div className='d-flex justify-content-center align-items-center '>
                        <FaRegTimesCircle size={20} onClick={() => setlongPressCount(longPressCount - 1)} />
                    </div>
                </div>
                }
                {longPressCount < 1 &&
                <>
                    <div className='col-6 col-md-4 col-lg-3 col-xl-2 col-xxl-1'>
                        <div  style={{gridTemplateColumns: '1fr 1fr 1fr'}} className="d-grid">
                        <div
                            style={{height: "50px", cursor: "pointer"}} 
                            className='d-flex justify-content-center align-items-center text-danger ' 
                            onClick={()=>handleShow("deleteModal")}>
                            <FaTrash/>
                        </div>
                        <div 
                            style={{height: "50px", cursor: "pointer"}} 
                            className='d-flex justify-content-center align-items-center ' 
                            onClick={()=>handleShow("shareModal")}>
                            <FaUserPlus/>
                        </div>
                        <div 
                            style={{height: "50px", cursor: "pointer"}} 
                            className='d-flex justify-content-center align-items-center ' 
                            onClick={()=>handleShow("creaNotaModal")}>
                            <FaPlus/>
                        </div>
                        </div>
                    </div>
                </>
                }
            </div>
        </div>
        <div className="row">
            <div style={{gridTemplateColumns: '1fr 1fr'}} className="d-grid gap-4 mb-3">
                <div className='py-2'> 
                    <h6>Spesa maggiore:</h6>
                    <p className='m-0'><i>nome utente</i></p>
                    <p className='m-0'><i>333</i></p>
                </div>
                <div className='py-2'> 
                    <h6>Total</h6>
                    <p className='m-0'>&nbsp;</p>
                    <p className='m-0'>{getTotale(scheda.notaSpese)}</p>
                </div>
            </div>
        </div>
        <div className="row">
            <Table striped className="">
                {scheda.notaSpese.length > 0 ? (
                    <>
                        <thead>
                            <tr>
                                <th>Utente</th>
                                <th>Titolo</th>
                                <th>Data</th>
                                <th>Importo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scheda.notaSpese.map((notaSpesa) => (
                                notaSpesa.testo && (
                                    <tr key={notaSpesa._id}>
                                        <td>{notaSpesa.inserimentoUser?.name} {notaSpesa.inserimentoUser?.id === user._id ? "(you)" : ""}</td>
                                        <td>{notaSpesa.testo ? notaSpesa.testo : null}</td>
                                        <td>{parseDate(notaSpesa.inserimentoData)}</td>
                                        <td>{notaSpesa.importo}</td>
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </>
                ) : (
                    <thead>
                        <tr>
                            <td role="button" colSpan="3" onClick={()=>handleShow("creaNotaModal")}>Nessuna nota spese presente</td>
                        </tr>
                    </thead>
                )}
            </Table>
        </div>
        <div className="row">
            <div className="col-6 col-md-3">
                <Button 
                    variant="link"
                    style={{height: "50px", cursor: "pointer"}} 
                    className='d-flex justify-content-center align-items-center p-0' 
                    onClick={()=>handleShow("creaNotaModal")}>
                    <FaPlus className='me-1'/>
                    <p className="mb-0 w-100 text-start">
                        Aggiungi nota
                    </p>
                </Button>
            </div>
            <div className="col-6 offset-md-6 col-md-3">
                <Button style={{height:"50px"}} className="w-100 text-end p-0" variant="link" onClick={()=>goToDettagolioScheda(scheda._id)}>
                    Visualizza scheda
                </Button>
            </div>
        </div>


        <div className="row">
            <Modal show={modalState.creaNotaModal} onHide={() => handleClose("creaNotaModal")}>
                <Modal.Header closeButton>
                <Modal.Title><b>Crea Nota in {scheda.titolo}</b></Modal.Title>
                </Modal.Header>
                <Modal.Body>            
                    <NotaSpeseForm onSuccess={handleClose} schedaId={scheda._id} />
                </Modal.Body>
            </Modal>

            <Modal show={modalState.shareModal} onHide={() => handleClose("shareModal")}>
                <Modal.Header closeButton>
                    <Modal.Title><b>Condividi "{scheda.titolo}"</b></Modal.Title>
                </Modal.Header>
                <Modal.Body>            
                    <Form className="mb-3" onSubmit={editSharedUserSubmit}>
                        <EmailShareList 
                            emailList_tmp={condivisoConList}
                            onAddEmail={addEmail}
                            onValidateEmail={validateEmail}
                            onRemoveEmail={removeEmail}
                            emailListParent={scheda.condivisoConList} 
                        />
                        {/* <NotaSpeseForm onSuccess={handleClose} schedaId={scheda._id} /> */}
                        <h6>Utenti con accesso</h6>
                        <div >
                            {user._id === scheda.user && <div className="d-flex justify-content-between align-items-center my-3" >
                                <div className="d-flex align-items-center">
                                    <RandomColorCircle letter={user.email[0]} /> 
                                    <p className='m-0'>{user.email} (you)</p>
                                </div>
                                <div>
                                    <p className='m-0'>Admin</p>
                                </div>
                            </div>
                            }
                            {scheda.condivisoConList.map((userMail) => (
                                <div className="d-flex justify-content-between align-items-center mb-3" key={userMail._id}>
                                    <div className="d-flex align-items-center">
                                        <RandomColorCircle letter={userMail.email[0]} /> 
                                        <p className='m-0'>{userMail.email} {user.email === userMail.email ? '(you)': ""}</p>
                                    </div>
                                    <div>
                                        <Form.Select aria-label="Default select example"   onChange={(e) => {if (e.target.value === "1") { removeSharedUser(userMail);}}}>
                                                <option>{userMail.role === "write" && 'Lettura e scrittura/Editor'}</option>
                                                <option className="text-danger" value="1">Rimuovi</option>
                                        </Form.Select>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='d-flex align-item-center justify-content-end mt-4'> 
                            {!isFormModified && <Button className="btn btn-primary" onClick={()=>handleClose("shareModal")}>Fine</Button>}
                            {isFormModified &&<Button type="submit" className="btn btn-primary" >Salva</Button>}
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={modalState.deleteModal} onHide={() => handleClose("deleteModal")}>
                <Modal.Header closeButton>
                <Modal.Title><b>Confermi di eliminare la scheda: {scheda.titolo}?</b></Modal.Title>
                </Modal.Header>
                <Modal.Body>            
                    <div className="d-flex gap-5 flex-column">
                        <Button type="submit" className="btn btn-danger w-100" onClick={() => dispatch(deleteSchedaSpese(scheda._id))}>
                            Conferma
                        </Button>
                        <Button type="submit" className="btn btn-secondary w-100">
                            Annulla
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
        </>
    );
}

export default SingleScheda
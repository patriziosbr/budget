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
    
    // Track original list on modal open
    const [originalEmailList, setOriginalEmailList] = useState([]);

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

    // const addEmail = (newEmailEntry) => {
    //     setSharedUserUpdateForm((prev) => {
    //         debugger
    //         const newList = [...prev.condivisoConList, newEmailEntry];
    //         // Set the form as modified
    //         setIsFormModified(true);
    //         return {
    //             ...prev,
    //             condivisoConList: newList
    //         };
    //     });
    // };

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

    // const singleScheda = async (idUrl) => {
    //     await dispatch(singleSchedaSpeseGet(idUrl)).unwrap()

    //     .catch((error) => console.error('Error fetching single scheda:', error));
    // }

    const goToDettagolioScheda = (schedaID) => {
        navigate(`/DashboardNotaSpese/${schedaID}`);

    }

    return (
        <>
        {/* {console.log("user", user)} */}
            <div className='d-flex justify-content-between align-items-center'>
                <div className="d-flex align-items-end">
                    {longPressCount < 1 &&
                    <>
                    {/* <Button onClick={()=>singleScheda(scheda._id)}>Hello</Button> */}
                    <div className='d-flex align-items-center  align-self-center'> 
                        <h5 role="button" className='mb-0' {...longPressEvent}>{scheda.titolo}</h5> 
                        <FaArrowRight className="mb-0 ms-4" onClick={()=>goToDettagolioScheda(scheda._id)}/>

                        {/* {scheda.condivisoCon.length > 0 && ( <RandomColorCircle letter={sharedUserLetter} tooltip={sharedUserMail} className="ms-4"/> )} */}
                        {sharedUserLetter && ( <FaUserFriends className="ms-4" onClick={()=>handleShow("shareModal")} /> )}
                    </div>
                    
                    </>
                    
                    }
                    {longPressCount > 0 && 
                    <div>
                        <input name="titolo" type='text' value={titolo} onChange={onChange}/> 
                        <span className='mx-4'><FaRegCheckCircle size={30} onClick={()=> updateSchedataTitolo()}/></span>
                        <span><FaRegTimesCircle size={30} onClick={() => setlongPressCount(longPressCount - 1)} /></span>
                    </div>
                    }
                    {/* {scheda.condivisoCon.length > 0 && ( <RandomColorCircle letter={sharedUserLetter}/> )} */}
                </div>
                <Dropdown>
                <Dropdown.Toggle as={CustomToggle} />
                    <Dropdown.Menu size="sm" title="">
                    {/* <Dropdown.Header>Options</Dropdown.Header> */}
                    <Dropdown.Item>
                    <span variant="secondary" className='d-flex align-items-center py-3' onClick={()=>handleShow("creaNotaModal")}>
                        <FaPlus className="me-2"/>Nuova nota spese
                    </span>
                    </Dropdown.Item>
                    <Dropdown.Item>
                    <span variant="secondary" className='d-flex align-items-center py-3' onClick={()=>handleShow("shareModal")}>
                        <FaUserPlus className="me-2"/>Condividi
                    </span>
                    </Dropdown.Item>
                    <Dropdown.Item>
                    <span variant="error" className='d-flex align-items-center text-danger py-3' onClick={()=>handleShow("deleteModal")}>
                        <FaTrash className="me-2"/>Elimina
                    </span>
                    </Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown>
            </div>
            <div>
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
            <div className='mb-5 w-100 d-flex justify-content-end'>
                <Button variant="link" onClick={()=>goToDettagolioScheda(scheda._id)}>Visualizza scheda</Button>
            </div>
            </div>

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
        </>
    );
}

export default SingleScheda
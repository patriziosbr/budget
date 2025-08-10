import { FaPencilAlt, FaPlus, FaRegCheckCircle, FaRegTimesCircle } from 'react-icons/fa';
import { FaTrash, FaArrowRight, FaUserFriends, FaUserPlus, FaEye } from "react-icons/fa";

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
import { deleteNotaSpese } from '../features/notaSpese/notaSpeseSlice'
import EmailShareList from './utils/EmailShareList';
import { useNavigate, NavLink } from 'react-router-dom'
import { toast } from 'react-toastify';


function SingleScheda({ scheda }) {
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
    const [modalState, setModalState] = useState({
        creaNotaModal: false,
        shareModal: false,
        deleteModal: false,
        deleteNotaModal: false,
        editNotaModal: false,
    });
    const [longPressCount, setlongPressCount] = useState(0)
    const [formData, setFormData] = useState({ titolo: scheda.titolo })
    const { titolo } = formData
    const dispatch = useDispatch()
    // const sharedUserLetter = scheda.condivisoConList.length > 0 ? true : false

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
            removedEmails: [...f.removedEmails, { mail: userMail.email, mailId: userMail._id }],
        }));
        // debugger
        setIsFormModified(true);
    }

    const addEmail = (newEmailEntry) => {
        setSharedUserUpdateForm((f) => ({
            ...f,
            condivisoConList: [...f.condivisoConList, newEmailEntry],
        }));

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
        if (modalType !== "editNotaModal") setNotaSpesaToEdit(null)
        if (modalType === "deleteNotaModal") setNotaSpesaToEdit(null);
    };

    const [notaSpesaToEdit, setNotaSpesaToEdit] = useState(null);
    const editNota = (modalType, notaSpesa) => {
        handleShow(modalType)
        setNotaSpesaToEdit(notaSpesa);
    }

    const [erroLength, setErroLength] = useState(false);
    const onChange = (e) => {
        if (e.target.value.length > 20) {
            setErroLength(true);
            return;
        } else {
            setErroLength(false);
        }
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    // const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    //     <a
    //       href=""
    //       ref={ref}
    //       onClick={e => {
    //         e.preventDefault();
    //         onClick(e);
    //       }}
    //     >
    //       {children}
    //       <span className="threedots" />
    //     </a>
    //   ));

    const onLongPress = () => {
        setlongPressCount(longPressCount + 1)
    };

    //   const defaultOptions = {
    //     shouldPreventDefault: true,
    //     delay: 500,
    //   };
    //   const longPressEvent = useLongPress(onLongPress, defaultOptions);

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
        try {
            await dispatch(updateSchedaSpese({ schedaId: scheda._id, ...updatePayload })).unwrap()
                .then((payload) => console.log('fulfilled', payload));
            if (updatePayload.condivisoConList.length > 0) {
                toast.success(`Scheda "${scheda.titolo}" condivisa con successo!`);
            }
            if (updatePayload.removedEmails.length > 0) {
                toast.success(`Utenti rimossi con successo!`);
            }
        } catch (error) {
            toast.error(`Error updating shared users: ${error.message}`)
        }
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

    const closeCreateEditModal = () => {
        handleClose("editNotaModal")
        handleShow("deleteNotaModal")
    }

    const deleteNotaSpeseAction = async (notaId) => {
        debugger
        try {
            await dispatch(deleteNotaSpese(notaId)).unwrap()
            // .then(() => {
            //     toast.success("Nota spese eliminata con successo!");
            // }).complete(async () => {
            //     handleClose("deleteNotaModal");
            //     await dispatch(getSchedaSpese()).unwrap();
            // })
        } catch (error) {
            console.log("Error Response:", error);
        
            toast.error(`Error deleting note: ${error.message}`)
        }
    }

    return (
        < >
            <div className="">
                <div className="row mb-4">
                    {/* <div style={{gridTemplateColumns: '1fr 1fr'}} className="d-grid gap-4 mb-3">
                        <div className='py-2'> 
                            <h6>Spesa maggiore:</h6>
                            <p className='m-0'><i>nome utente</i></p>
                            <p className='m-0'><i>€ 333</i></p>
                        </div>
                        <div className='py-2'> 
                            <h6>Total</h6>
                            <p className='m-0'>&nbsp;</p>
                            <p className='m-0'>€ {getTotale(scheda.notaSpese)}</p>
                        </div>
                    </div> */}
                </div>
                <div className="card h-100 mb-2">
                    <div className="card-header px-3">
                        <div className="row">
                            {longPressCount < 1 &&
                                <>
                                    <div className='col-6'>
                                        <div
                                            className='d-flex align-items-center text-dark-emphasis'
                                            onClick={() => goToDettagolioScheda(scheda._id)}
                                            style={{ cursor: "pointer" }}>
                                            <h6 style={{ textTransform: "capitalize", textDecoration: "underline" }}
                                                role="button"
                                                className='mb-0 w-100'
                                            >
                                                {scheda.titolo}
                                            </h6>
                                        </div>
                                    </div>
                                    <div className="col-6 d-flex justify-content-end align-items-center text-dark-emphasis">
                                        {/* <div className='col-6 col-md-4 col-lg-3 col-xl-2 col-xxl-1'> */}
                                        <div style={{ gridTemplateColumns: '1fr 1fr 1fr' }} className="d-grid gap-4">
                                            <div
                                                style={{ cursor: "pointer" }}
                                                className='d-flex justify-content-center align-items-center text-dark-emphasis'
                                                onClick={() => onLongPress()}>
                                                <FaPencilAlt />
                                            </div>
                                            <div
                                                style={{ cursor: "pointer" }}
                                                className='d-flex justify-content-center align-items-center text-dark-emphasis'
                                                onClick={() => handleShow("shareModal")}>
                                                <FaUserPlus />
                                            </div>
                                            <div
                                                style={{ cursor: "pointer" }}
                                                className='d-flex justify-content-center align-items-center text-danger '
                                                onClick={() => handleShow("deleteModal")}>
                                                <FaTrash />
                                            </div>
                                            {/* </div> */}
                                        </div>
                                    </div>
                                </>
                            }
                            {longPressCount > 0 &&
                                <>
                                    <div className='col-9'>
                                        <Form.Group>
                                            <Form.Control className='d-flex align-self-center' type="titolo" id='titolo' maxlength="21" name="titolo" value={titolo} placeholder='titolo' onChange={onChange} />

                                        </Form.Group>
                                    </div>
                                    <div className='col-3 d-flex justify-content-center align-items-center gap-5'>
                                        <div role="button" className='d-flex justify-content-center align-items-center'>
                                            <FaRegTimesCircle size={20} onClick={() => setlongPressCount(longPressCount - 1)} />
                                        </div>
                                        <div role="button" className='d-flex justify-content-center align-items-center'>
                                            <FaRegCheckCircle size={20} onClick={() => updateSchedataTitolo()} />
                                        </div>
                                    </div>
                                    <div>
                                        {erroLength && <small className='text-danger'>Limit characters reached</small>}
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                    <div className="card-body">
                        <ul className="list-group">
                            {scheda.notaSpese.length === 0 ? (
                                <li className="list-group-item border-0 d-flex justify-content-between px-0 mt-3 border-radius-lg">
                                    <p className="text-small mb-0">Aww this list is empty</p>
                                </li>
                            ) : (
                                <>
                                    {scheda.notaSpese.map((notaSpesa, i) => (
                                        notaSpesa.testo && i < 5 && (
                                            <li key={notaSpesa._id} className="list-group-item border-0 d-flex justify-content-between px-0 mb-2 border-radius-lg">
                                                <div className="d-flex align-items-center">
                                                    <div className="d-flex align-items-center">
                                                        {/* <i className="material-symbols-rounded text-lg">priority_high</i> */}
                                                        <RandomColorCircle letter={notaSpesa.inserimentoUser?.name} tooltip={notaSpesa.inserimentoUser?.name}
                                                            email={notaSpesa.inserimentoUser?.email}
                                                        />
                                                        {/* {notaSpesa.inserimentoUser?.name} {notaSpesa.inserimentoUser?.id === user._id ? "(you)" : ""} */}
                                                    </div>
                                                    <div role="button" className="d-flex flex-column" onClick={() => editNota("editNotaModal", notaSpesa)}>
                                                        <h6 className="mb-1 text-dark text-sm"><u>{notaSpesa.testo ?? notaSpesa.testo}</u></h6>
                                                        <span className="text-xs"><u>{parseDate(notaSpesa.inserimentoData)}</u></span>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center text-dark text-sm font-weight-bold">
                                                    € {notaSpesa.importo.toFixed(2)}
                                                </div>
                                            </li>
                                        )
                                    ))}
                                </>
                            )}
                            <li className="list-group-item border-0 d-flex justify-content-between px-0 mt-3 border-radius-lg">
                                {scheda.notaSpese.length > 0 &&
                                    <div className="d-flex justify-content-center align-items-center text-dark btn btn-outline-dark btn-sm mb-0 w-100 me-4 " onClick={() => goToDettagolioScheda(scheda._id)}>
                                        <p className='mb-0 text-center'>&nbsp;Show all</p>
                                    </div>
                                }
                                <div className="btn bg-gradient-dark btn-sm mb-0 w-100" onClick={() => handleShow("creaNotaModal")}>
                                    <p className='mb-0'>&nbsp;Add note</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    {scheda.notaSpese.length > 0 &&
                        <div className="row p-3">
                            <div className="col-md-6 col-6">
                                <div className="card">
                                    <div className="card-body text-center">
                                        <h6 className="text-center mb-0">Higher expence</h6>
                                        <span className="text-xs">user name</span>
                                        <hr className="horizontal dark my-1" />
                                        <h5 className="mb-0">€ 0</h5>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 col-6">
                                <div className="card">
                                    <div className="card-body text-center">
                                        <h6 className="text-center mb-0">Total</h6>
                                        <span className="text-xs">&nbsp;</span>
                                        <hr className="horizontal dark mt-0 mb-2" />
                                        <h5 className="mb-0">€ {getTotale(scheda.notaSpese)}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>}
                </div>

            </div>



            <div className="row">
                <Modal show={modalState.creaNotaModal} onHide={() => handleClose("creaNotaModal")} centered>
                    <Modal.Header closeButton>
                        <Modal.Title><b>Create note in {scheda.titolo}</b></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <NotaSpeseForm onSuccess={handleClose} schedaId={scheda._id} />
                    </Modal.Body>
                </Modal>
                <Modal show={modalState.editNotaModal} onHide={() => handleClose("editNotaModal")} centered>
                    <Modal.Header closeButton>
                        <Modal.Title><b>Edit note in {scheda.titolo}</b></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <NotaSpeseForm onSuccess={handleClose} schedaId={scheda._id} notaToEdit={notaSpesaToEdit} beforeDelete={() => closeCreateEditModal()} />
                    </Modal.Body>
                </Modal>

                <Modal show={modalState.shareModal} onHide={() => handleClose("shareModal")} centered>
                    <Modal.Header closeButton>
                        <Modal.Title><b>Share "{scheda.titolo}"</b></Modal.Title>
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
                            <h6>Shared users</h6>
                            <div >
                                {user._id === scheda.user && <div className="d-flex justify-content-between align-items-center my-3" >
                                    <div className="d-flex align-items-center">
                                        <RandomColorCircle
                                            letter={user.email[0]}
                                            tooltip={user.email}
                                            email={user.email}
                                        />
                                        <p className='ms-2 m-0'>{user.email} (you)</p>
                                    </div>
                                    <div>
                                        <p className='m-0'>Admin</p>
                                    </div>
                                </div>
                                }
                                {scheda.condivisoConList.map((userMail) => (
                                    <div className="d-flex align-items-center mb-3" key={userMail._id}>
                                        <div className="d-flex align-items-center me-2">
                                            <RandomColorCircle
                                                letter={userMail.email[0]}
                                                tooltip={userMail.email}
                                                email={userMail.email}
                                            />
                                        </div>
                                        <div className="">
                                            <p className='m-0'>{userMail.email} {user.email === userMail.email ? '(you)' : ""}</p>
                                            <Form.Select aria-label="Default select example" onChange={(e) => { if (e.target.value === "1") { removeSharedUser(userMail); } }}>
                                                <option>{userMail.role === "write" && 'Read and write/Editor'}</option>
                                                <option className="text-danger" value="1">Remove</option>
                                            </Form.Select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className='d-flex align-item-center justify-content-end mt-4'>
                                {!isFormModified && <Button className="btn bg-gradient-dark btn btn-outline-dark btn-sm w-100" onClick={() => handleClose("shareModal")}>Fine</Button>}
                                {isFormModified && <Button type="submit" className="btn bg-gradient-dark btn btn-outline-dark btn-sm w-100" >Salva</Button>}
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>

                <Modal show={modalState.deleteModal} onHide={() => handleClose("deleteModal")} centered>
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

                <Modal show={modalState.deleteNotaModal} onHide={() => handleClose("deleteNotaModal")} centered>
                    <Modal.Header closeButton>
                        <Modal.Title><b>Confirm to delete: "{notaSpesaToEdit?.testo}"?</b></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure to delete this note <i>"{notaSpesaToEdit?.testo}"</i>, <b>this action can be undone</b> </p>
                        <div className="row mt-4 mb-3">
                            <div className="col-3">
                                <button
                                    className=" text-dark btn btn-outline-dark btn-sm mb-0 w-100"
                                    onClick={() => handleClose("deleteNotaModal")}
                                >
                                    <p className="mb-0 ">
                                        cancel
                                    </p>
                                </button>


                            </div>
                            <div className="col-9">
                                <p>
                                {JSON.stringify(notaSpesaToEdit)}

                                </p>
                                <button
                                    type="submit"

                                    className='text-danger btn border border-1 border-danger w-100 '
                                    onClick={() => deleteNotaSpeseAction(notaSpesaToEdit._id)}
                                >
                                    Delete
                                </button>
                            </div>

                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    );
}

export default SingleScheda
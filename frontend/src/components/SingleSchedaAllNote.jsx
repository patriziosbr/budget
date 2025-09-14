import {
  FaPencilAlt,
  FaPlus,
  FaRegCheckCircle,
  FaRegTimesCircle,
  FaTrash,
  FaArrowRight,
  FaUserFriends,
  FaUserPlus,
  FaEye,
  FaCaretDown,
  FaCaretUp,
} from "react-icons/fa";
import { useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import NotaSpeseFormAllNote from "../components/NotaSpeseFormAllNote";
import Table from "react-bootstrap/Table";
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import useLongPress from "./utils/useLongPress.js";
import Spinner from "../components/utils/Spinner";

import { useSelector, useDispatch } from "react-redux";
import RandomColorCircle from "./utils/RandomColorCircle.js";
import {
  getSchedaSpese,
  updateSchedaSpese,
  deleteSchedaSpese,
  singleSchedaSpeseGet,
} from "../features/schedaSpese/schedaSpeseSlice";
import { deleteNotaSpese } from "../features/notaSpese/notaSpeseSlice";
import EmailShareList from "./utils/EmailShareList";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { getUserById } from "../features/auth/authSlice";
import { getAllCategories } from "../features/categorie/categorieSlice";

function SingleSchedaAllNote({ scheda, categorie }) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { userById } = useSelector((state) => state.auth);
  const [isDisabled, setisDisabled] = useState(false);
  const [modalState, setModalState] = useState({
    creaNotaModal: false,
    shareModal: false,
    deleteModal: false,
    deleteNotaModal: false,
    editNotaModal: false,
  });
  const [longPressCount, setlongPressCount] = useState(0);
  const [formData, setFormData] = useState({ titolo: scheda.titolo });
  const { titolo } = formData;
  const dispatch = useDispatch();
  // const sharedUserLetter = scheda.condivisoConList.length > 0 ? true : false

  const [sharedUserUpdateForm, setSharedUserUpdateForm] = useState({
    titolo: scheda.titolo,
    condivisoConList: [],
    removedEmails: [],
  });

  const { condivisoConList } = sharedUserUpdateForm;

  // Add a state to track if the form has been modified
  const [isFormModified, setIsFormModified] = useState(false);

  // // Track original list on modal open
  // const [originalEmailList, setOriginalEmailList] = useState([]);

  const removeSharedUser = (userMail) => {
    setSharedUserUpdateForm((f) => ({
      ...f,
      removedEmails: [
        ...f.removedEmails,
        { mail: userMail.email, mailId: userMail._id },
      ],
    }));

    setIsFormModified(true);
  };

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
  };

  const removeEmail = (email) => {
    setSharedUserUpdateForm((prev) => ({
      ...prev,
      condivisoConList: prev.condivisoConList.filter(
        (entry) => entry.email !== email
      ),
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
    if (modalType !== "editNotaModal") setNotaSpesaToEdit(null);
    if (modalType === "deleteNotaModal") setNotaSpesaToEdit(null);
  };

  const [notaSpesaToEdit, setNotaSpesaToEdit] = useState(null);
  const editNota = (modalType, notaSpesa) => {
    handleShow(modalType);
    setNotaSpesaToEdit(notaSpesa);
  };

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
    }));
  };

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
    setlongPressCount(longPressCount + 1);
  };

  //   const defaultOptions = {
  //     shouldPreventDefault: true,
  //     delay: 500,
  //   };
  //   const longPressEvent = useLongPress(onLongPress, defaultOptions);

  const updateSchedataTitolo = async () => {
    const updatePayload = { titolo: titolo };
    if (scheda.titolo === titolo) {
      setlongPressCount(0);
      return;
    }
    try {
      await dispatch(
        updateSchedaSpese({ schedaId: scheda._id, ...updatePayload })
      ).unwrap();
      await dispatch(singleSchedaSpeseGet(scheda._id)).unwrap();
    } catch (error) {
      console.error("Error Response:", error);
      toast.error(error.message || "Error while update scheda title");
    } finally {
      toast.success("Title update success");
      setlongPressCount(0);
    }
  };

  const parseDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  };

  const editSharedUserSubmit = async (e) => {
    e.preventDefault();

    const updatePayload = {
      titolo: sharedUserUpdateForm.titolo,
      condivisoConList: sharedUserUpdateForm.condivisoConList,
      removedEmails: sharedUserUpdateForm.removedEmails,
    };
    try {
      await dispatch(
        updateSchedaSpese({ schedaId: scheda._id, ...updatePayload })
      )
        .unwrap()
        .then((payload) => console.log("fulfilled", payload));
      if (updatePayload.condivisoConList.length > 0) {
        toast.success(`Scheda "${scheda.titolo}" condivisa con successo!`);
      }
      if (updatePayload.removedEmails.length > 0) {
        toast.success(`Utenti rimossi con successo!`);
      }
    } catch (error) {
      toast.error(`Error updating shared users: ${error.message}`);
    }
    await dispatch(singleSchedaSpeseGet(scheda._id)).unwrap();
    handleClose("shareModal");
  };

  const getTotale = (notaSpese) => {
    const initialValue = 0;
    const importoArray = [];
    notaSpese.map((spesa) => {
      importoArray.push(spesa.importo);
    });

    const importoSummed = importoArray.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      initialValue
    );

    return importoSummed?.toFixed(2);
  };

  const [refSchedaId, SetRefSchedaId] = useState(null);
  const closeCreateEditModal = (schedaID) => {
    handleClose("editNotaModal");
    handleShow("deleteNotaModal");
    SetRefSchedaId(schedaID);
  };

  const deleteNotaSpeseAction = async (notaId) => {
    let body = {
      notaId,
      schedaId: refSchedaId,
    };

    try {
      const response = await dispatch(deleteNotaSpese(body)).unwrap();
      await dispatch(singleSchedaSpeseGet(body.schedaId)).unwrap();
      handleClose("deleteNotaModal");
      toast.success(response.message || "Note succesfull deleted");
    } catch (error) {
      console.log("Error Response:", error);
      toast.error(`Error deleting note: ${error.message}`);
    }
  };

  const deleteSchedaFromDetail = async () => {
    try {
      const response = await dispatch(deleteSchedaSpese(scheda._id)).unwrap();
      toast.success(response.message || "Scheda succesfull deleted");
      if (response?.id) {
        navigate("/note-spese");
      }
    } catch (error) {
      console.log("Error Response:", error);
      toast.error(`Error deleting scheda: ${error.message}`);
    } finally {
      handleClose("deleteModal");
    }
  };

  const [expencersWithTotals, setExpencersWithTotals] = useState([]);
  const [maxExpencer, setMaxExpencer] = useState(null);
  const [expencersDiff, setExpencersDiff] = useState([]);

  const findExpencersWithTotals = (scheda) => {
    if (!scheda?.notaSpese?.length) {
      setExpencersWithTotals([]);
      setMaxExpencer(null);
      setExpencersDiff([]);
      return;
    }

    // Calculate totals per user
    const totalsMap = {};
    scheda.notaSpese.forEach((item) => {
      const userId = item.user;
      if (!totalsMap[userId]) {
        totalsMap[userId] = {
          userId,
          userName: item?.inserimentoUser?.name || "Unknown",
          totalExp: 0,
        };
      }
      totalsMap[userId].totalExp += item.importo || 0;
    });

    const totalsArray = Object.values(totalsMap);
    setExpencersWithTotals(totalsArray);

    // Find max spender
    if (totalsArray.length === 0) {
      setMaxExpencer(null);
      setExpencersDiff([]);
      return;
    }

    const max = totalsArray.reduce((prev, curr) => {
      if (prev.totalExp === curr.totalExp) {
        return {
          userId: null,
          userName: "Users spent equal",
          totalExp: curr.totalExp,
        };
      }
      return prev.totalExp > curr.totalExp ? prev : curr;
    });

    setMaxExpencer(max);

    // Calculate differences
    let resDiff = [];
    if (max.userName !== "Users spent equal") {
      totalsArray
        .filter((item) => item.userId !== max.userId)
        .forEach((item) => {
          resDiff.push({
            userHigh: max.userName,
            userLess: item.userName,
            diff: (max.totalExp - item.totalExp).toFixed(2),
          });
        });
    }
    setExpencersDiff(resDiff);
  };

  useEffect(() => {
    findExpencersWithTotals(scheda);
    dispatch(getUserById(scheda.user));
  }, [scheda.notaSpese]);
  // const [categories, setCategories] = useState([]);

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const res = await dispatch(getAllCategories()).unwrap();
  //       setCategories(res);
  //     } catch (error) {
  //       console.error("Error loading categories:", error);
  //     }
  //   };

  //   fetchCategories();
  // }, [dispatch]);

  const [categoriesPerFilters, setCategoriesPerFilters] = useState([]);

  const filterCat = () => {
    const noteCatID = scheda?.notaSpese?.map((nota) => nota.categoria);

    const uniqueCats = noteCatID
      .filter((val, id, array) => array.indexOf(val) === id)
      .map((val) => (val === null ? "nocat" : val));

    const res = uniqueCats
      .map((uniq) => {
        if (uniq === "nocat") {
          return {
            _id: "nocat",
            name: "Uncategorized",
            value: "Uncategorized",
            label: "Uncategorized",
          };
        }
        return categorie.find((cat) => cat._id === uniq);
      })
      .filter(Boolean);
    setCategoriesPerFilters(res);
    console.log(res, "res");
  };

  useEffect(() => {
    filterCat();
  }, []);

  // possible stat "asc" "desc" null
  const [orderState, setOrderState] = useState({
    userOrder: null,
    categoryOrder: null,
    dateOrder: "desc",
    priceOrder: null,
  });

  const onChangeOder = async (orderType) => {
    setOrderState((prevState) => {
      const newOrderState = Object.keys(prevState).reduce((acc, key) => {
        acc[key] =
          key === orderType
            ? prevState[key] === "desc"
              ? "asc"
              : "desc"
            : null;
        return acc;
      }, {});
      return newOrderState;
    });
    const param = {
      "schedaId": scheda._id,
      "orderKind": orderType,
      "orderState": orderState[orderType]
    }
  };


useEffect(() => {
  // Find which orderType is active
  const activeOrderType = Object.keys(orderState).find(
    (key) => orderState[key] !== null
  );
  if (!activeOrderType) return; // Don't fetch if nothing is selected

  const param = {
    schedaId: scheda._id,
    orderKind: activeOrderType,
    orderState: orderState[activeOrderType],
  };
  fetchData(param);
}, [orderState]);
  
const fetchData = async (param) => {
  setisDisabled(true)
  try {
    await dispatch(singleSchedaSpeseGet(param)).unwrap();
  } catch (error) {
    console.log(error)
  } finally {
    setisDisabled(false)
  }
};
  return (
    <>
      <div>
        <div className="card h-100 pb-2 mb-2">
          <div className="card-header border-0 bg-white py-2 px-3">
            <div className="row">
              {longPressCount < 1 && (
                <>
                  <div className="col-6">
                    <div className="d-flex text-dark-emphasis">
                      {/* {scheda?.condivisoConList?.length > 0 &&
                        scheda?.condivisoConList?.map((sharedEl) => (
                          <>
                            <div style={{ height: "", width: "15px" }}>
                              <RandomColorCircle
                                letter={sharedEl?.email}
                                tooltip={sharedEl?.email}
                                email={sharedEl?.email}
                                className={"circle-small"}
                              />
                            </div>
                          </>
                        ))} */}
                      <h5
                        style={{
                          textTransform: "Capitalize",
                          cursor: "default",
                        }}
                        className="mb-0 w-100"
                      >
                        {scheda.titolo}
                      </h5>
                    </div>
                  </div>
                  <div className="col-6 d-flex justify-content-end align-items-center text-dark-emphasis">
                    {/* <div className='col-6 col-md-4 col-lg-3 col-xl-2 col-xxl-1'> */}
                    <div
                      style={{
                        gridTemplateColumns:
                          user._id === scheda.user ? "1fr 1fr 1fr" : "1fr 1fr",
                      }}
                      className="d-grid gap-4"
                    >
                      <div
                        style={{ cursor: "pointer" }}
                        className="d-flex justify-content-center align-items-center text-dark-emphasis"
                        onClick={() => onLongPress()}
                      >
                        <FaPencilAlt size={15} />
                      </div>
                      <div
                        style={{ cursor: "pointer" }}
                        className="d-flex justify-content-center align-items-center text-dark-emphasis"
                        onClick={() => handleShow("shareModal")}
                      >
                        <FaUserPlus size={15} />
                      </div>
                      {user._id === scheda.user && (
                        <div
                          style={{ cursor: "pointer" }}
                          className="d-flex justify-content-center align-items-center text-danger "
                          onClick={() => handleShow("deleteModal")}
                        >
                          <FaTrash size={15} />
                        </div>
                      )}
                      {/* </div> */}
                    </div>
                  </div>
                </>
              )}
              {longPressCount > 0 && (
                <>
                  <div className="col-8">
                    <Form.Group>
                      <Form.Control
                        className="d-flex align-self-center"
                        type="titolo"
                        id="titolo"
                        maxLength="21"
                        name="titolo"
                        value={titolo}
                        placeholder="titolo"
                        onChange={onChange}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-4 d-flex justify-content-end align-items-center">
                    <div
                      role="button"
                      className="d-flex justify-content-center align-items-center w-100"
                    >
                      <FaRegTimesCircle
                        size={15}
                        onClick={() => {
                          setlongPressCount(longPressCount - 1);
                          setFormData({ titolo: scheda.titolo });
                        }}
                        className="w-100"
                      />
                    </div>
                    <div
                      role="button"
                      className="d-flex justify-content-center align-items-center w-100"
                    >
                      <FaRegCheckCircle
                        size={15}
                        onClick={() => updateSchedataTitolo()}
                        className="w-100"
                      />
                    </div>
                  </div>
                  <div>
                    {erroLength && (
                      <small className="text-danger">
                        Limit characters reached
                      </small>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="card-body px-0">
            <div className="row">
              <div className="col-12 px-3">
                <div className="py-2 px-3 d-flex">
                  <button
                    role="button"
                    className={`btn btn-round d-flex align-items-center badge bg-light me-2 mb-2 px-3 border  ${
                      orderState.userOrder === "asc" ||
                      orderState.userOrder === "desc"
                        ? "border-4"
                        : ""
                    }`}
                    style={{
                      fontSize: "0.7rem",
                    }}
                    onClick={() => onChangeOder("userOrder")}
                    disabled={isDisabled}
                  >
                    <p className="sm m-0 me-2 form-label ">User</p>
                    <div className="d-flex flex-column">
                      <FaCaretUp
                        className={`${
                          orderState.userOrder === "desc"
                            ? "text-black"
                            : orderState.userOrder === "asc"
                            ? "text-secondary"
                            : "text-secondary"
                        }`}
                      />
                      <FaCaretDown
                        className={`${
                          orderState.userOrder === "asc"
                            ? "text-black"
                            : orderState.userOrder === "desc"
                            ? "text-secondary"
                            : "text-secondary"
                        }`}
                      />
                    </div>
                  </button>
                  <button
                    role="button"
                    className={`btn btn-round d-flex align-items-center badge bg-light me-2 mb-2 px-3 border ${
                      orderState.categoryOrder === "asc" ||
                      orderState.categoryOrder === "desc"
                        ? "border-2"
                        : ""
                    }`}
                    style={{
                      fontSize: "0.7rem",
                    }}
                    onClick={() => onChangeOder("categoryOrder")}
                    disabled={isDisabled}
                  >
                    <p className="sm m-0 me-2 form-label ">Category</p>
                    <div className="d-flex flex-column">
                      <FaCaretUp
                        className={`${
                          orderState.categoryOrder === "desc"
                            ? "text-black"
                            : orderState.categoryOrder === "asc"
                            ? "text-secondary"
                            : "text-secondary"
                        }`}
                      />
                      <FaCaretDown
                        className={`${
                          orderState.categoryOrder === "asc"
                            ? "text-black"
                            : orderState.categoryOrder === "desc"
                            ? "text-secondary"
                            : "text-secondary"
                        }`}
                      />
                    </div>
                  </button>

                  <button
                    role="button"
                    className={`btn btn-round d-flex align-items-center badge bg-light me-2 mb-2 px-3 border ${
                      orderState.dateOrder === "asc" ||
                      orderState.dateOrder === "desc"
                        ? "border-2"
                        : ""
                    }`}
                    style={{
                      fontSize: "0.7rem",
                    }}
                    onClick={() => onChangeOder("dateOrder")}
                    disabled={isDisabled}
                  >
                    <p className="sm m-0 me-2 form-label ">Date</p>
                    <div className="d-flex flex-column">
                      <FaCaretUp
                        className={`${
                          orderState.dateOrder === "desc"
                            ? "text-black"
                            : orderState.dateOrder === "asc"
                            ? "text-secondary"
                            : "text-secondary"
                        }`}
                      />
                      <FaCaretDown
                        className={`${
                          orderState.dateOrder === "asc"
                            ? "text-black"
                            : orderState.dateOrder === "desc"
                            ? "text-secondary"
                            : "text-secondary"
                        }`}
                      />
                    </div>
                  </button>

                  <button
                    role="button"
                    className={`btn btn-round d-flex align-items-center badge bg-light me-2 mb-2 px-3 border ${
                      orderState.priceOrder === "asc" ||
                      orderState.priceOrder === "desc"
                        ? "border-2"
                        : ""
                    }`}
                    style={{
                      fontSize: "0.7rem",
                    }}
                    onClick={() => onChangeOder("priceOrder")}
                    disabled={isDisabled}
                  >
                    <p className="sm m-0 me-2 form-label ">Price</p>
                    <div className="d-flex flex-column">
                      <FaCaretUp
                        className={`${
                          orderState.priceOrder === "desc"
                            ? "text-black"
                            : orderState.priceOrder === "asc"
                            ? "text-secondary"
                            : "text-secondary"
                        }`}
                      />
                      <FaCaretDown
                        className={`${
                          orderState.priceOrder === "asc"
                            ? "text-black"
                            : orderState.priceOrder === "desc"
                            ? "text-secondary"
                            : "text-secondary"
                        }`}
                      />
                    </div>
                  </button>
                  {/* questo e il blocco sotto potrebbe essere utile per filtri/ordinamento avanzato    */}
                  {/* {categoriesPerFilters.map((cat) => (
                    <>
                      <div
                        role="button"
                        className="badge badge-upper bg-light border text-dark me-2 mb-2 p-2"
                        style={{
                          fontSize: "0.7rem",
                          alignSelf: "flex-start",
                        }}
                      >
                        {cat.name}
                      </div>
                    </>
                  ))} */}
                </div>
              </div>
              {/* <div className="col-12 px-3">
                <div className="mb-4 px-3">
                  <h6>Users:</h6>
                  {userById[scheda.user]?._id === user._id && (
                    <>
                      <div
                        role="button"
                        className="badge bg-light border text-dark me-2 mb-2 p-2"
                        style={{
                          fontSize: "0.7rem",
                          alignSelf: "flex-start",
                        }}
                      >
                        {userById[scheda.user]?.email}
                      </div>
                    </>
                  )}
                  {scheda?.condivisoConList?.length > 0 &&
                    scheda?.condivisoConList?.map((sharedEl) => (
                      <>
                        {sharedEl.email !== user.email && (
                          <>
                            <div
                              role="button"
                              className="badge bg-light border text-dark me-2 mb-2 p-2"
                              style={{
                                fontSize: "0.7rem",
                                alignSelf: "flex-start",
                              }}
                            >
                              {sharedEl?.email}
                            </div>
                          </>
                        )}
                      </>
                    ))}
                </div>
              </div> */}
            </div>
            <ul className="list-group">
              {scheda.notaSpese.length === 0 ? (
                <li className="list-group-item border-0 d-flex justify-content-between px-0 mt-3">
                  <p className="text-small mb-0">Aww this list is empty</p>
                </li>
              ) : (
                <>
                  {scheda.notaSpese.map(
                    (notaSpesa, i) =>
                      notaSpesa && (
                        <li
                          key={notaSpesa._id}
                          className={`list-group-item border-0 d-flex justify-content-between mb-2 ${
                            notaSpesa?.inserimentoUser?.id === user?._id
                              ? "bg-light"
                              : ""
                          }`}
                        >
                          <div className="d-flex align-items-center">
                            <div className="d-flex align-items-center">
                              {/* <i className="material-symbols-rounded text-lg">priority_high</i> */}
                              <RandomColorCircle
                                letter={notaSpesa.inserimentoUser?.email}
                                tooltip={notaSpesa.inserimentoUser?.email}
                                email={notaSpesa.inserimentoUser?.email}
                              />
                              {/* {notaSpesa.inserimentoUser?.name} {notaSpesa.inserimentoUser?.id === user._id ? "(you)" : ""} */}
                            </div>
                            {/* <div role="button" className="d-flex flex-column" onClick={() => editNota("editNotaModal", notaSpesa)}> */}
                            <div
                              role="button"
                              className={`d-flex flex-column pe-3`}
                              onClick={
                                notaSpesa.testo &&
                                notaSpesa.inserimentoUser?.id === user?._id
                                  ? () => editNota("editNotaModal", notaSpesa)
                                  : undefined
                              }
                            >
                              <h6 className="mb-1 text-dark text-sm">
                                {notaSpesa.testo
                                  ? notaSpesa.testo
                                  : "Note not available"}
                              </h6>
                              <span className="text-xs">
                                {parseDate(notaSpesa?.inserimentoData)}
                              </span>
                            </div>
                                                        <div className="pe-4">
                              {notaSpesa.categoria !== "" && (
                                <span
                                  className="badge bg-light text-dark border"
                                  style={{
                                    fontSize: "0.7rem",
                                    alignSelf: "flex-start",
                                  }}
                                >
                                  <small className="mb-0 text-wrap">
                                    {categorie.find(
                                      (cat) => cat._id === notaSpesa.categoria
                                    )?.name || "Uncategorized"}
                                  </small>
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="d-flex align-items-center text-dark text-sm font-weight-bold">
                            € {notaSpesa?.importo?.toFixed(2)}
                          </div>
                        </li>
                      )
                  )}
                </>
              )}
            </ul>
          </div>
          <div className="row pt-0 p-3">
            <div className="col-12 d-flex justify-content-end">
              <div
                className="btn bg-gradient-dark btn-sm mb-0 px-4"
                onClick={() => handleShow("creaNotaModal")}
              >
                <p className="mb-0">Add note</p>
              </div>
            </div>
          </div>
          {scheda.notaSpese.length > 0 && (
            <>
              <div className="row px-3">
                <div className="col-md-6 col-6">
                  <div className="card">
                    <div className="card-body text-center">
                      <h6 className="text-center mb-0">Higher expence</h6>
                      <span className="text-xs">
                        <b>{maxExpencer?.userName ?? maxExpencer}</b>
                      </span>
                      <hr className="horizontal dark my-1" />
                      <h5 className="mb-0">
                        € {maxExpencer?.totalExp.toFixed(2)}
                      </h5>
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
              </div>

              <div className="row px-3">
                {expencersWithTotals && expencersWithTotals.length > 1 && (
                  <div className="col-12 mt-2">
                    <div className="card">
                      <div className="card-body">
                        <h6>Users totals</h6>
                        {expencersWithTotals.map((item) => (
                          <p className="mb-0 text-sm" key={item.userId}>
                            {item.userName}: <b>€ {item.totalExp.toFixed(2)}</b>
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {expencersDiff[0] &&
                  expencersDiff[0]?.userHigh !== "Users spent equal" && (
                    <div className="col-12 my-2">
                      <div className="card">
                        <div className="card-body">
                          <h6>Compair</h6>
                          {expencersDiff.map((item, index) => (
                            <p className="mb-0 text-sm" key={index}>
                              <b>{item.userHigh}</b> VS <b>{item.userLess}</b>{" "}
                              spent over <b>€ {item.diff}</b>
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="row">
        <Modal
          show={modalState.creaNotaModal}
          onHide={() => handleClose("creaNotaModal")}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <b>Create note in {scheda.titolo}</b>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <NotaSpeseFormAllNote
              onSuccess={() => handleClose("creaNotaModal")}
              schedaId={scheda._id}
            />
          </Modal.Body>
        </Modal>
        <Modal
          show={modalState.editNotaModal}
          onHide={() => handleClose("editNotaModal")}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <b>Edit note in {scheda.titolo}</b>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <NotaSpeseFormAllNote
              onSuccess={() => handleClose("editNotaModal")}
              schedaId={scheda._id}
              notaToEdit={notaSpesaToEdit}
              beforeDelete={() => closeCreateEditModal(scheda._id)}
            />
          </Modal.Body>
        </Modal>

        <Modal
          show={modalState.shareModal}
          onHide={() => handleClose("shareModal")}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <b>Share "{scheda.titolo}"</b>
            </Modal.Title>
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
              {/* <NotaSpeseFormAllNote onSuccess={handleClose} schedaId={scheda._id} /> */}
              <h6>Shared users</h6>
              <div>
                {user._id !== scheda.user ? (
                  <div className="d-flex justify-content-between align-items-center my-3">
                    <div className="d-flex align-items-center">
                      <RandomColorCircle
                        letter={userById[scheda.user]?.email}
                        tooltip={userById[scheda.user]?.email}
                        email={userById[scheda.user]?.email}
                      />
                      <p className="ms-2 m-0">{userById[scheda.user]?.email}</p>
                    </div>
                    <div>
                      <p className="m-0">Admin</p>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex justify-content-between align-items-center my-3">
                    <div className="d-flex align-items-center">
                      <RandomColorCircle
                        letter={user?.email[0]}
                        tooltip={user?.email}
                        email={user?.email}
                      />
                      <p className="ms-2 m-0">{user.email} (you)</p>
                    </div>
                    <div>
                      <p className="m-0">Admin</p>
                    </div>
                  </div>
                )}
                {scheda.condivisoConList.map((userMail) => (
                  <div
                    className="d-flex align-items-center mb-3"
                    key={userMail._id}
                  >
                    <div className="d-flex align-items-center me-2">
                      <RandomColorCircle
                        letter={userMail.email[0]}
                        tooltip={userMail.email}
                        email={userMail.email}
                      />
                    </div>
                    <div>
                      <p className="m-0">
                        {userMail.email}{" "}
                        {user.email === userMail.email ? "(you)" : ""}
                      </p>
                      {user.email !== userMail.email && (
                        <Form.Select
                          aria-label="Default select example"
                          onChange={(e) => {
                            if (e.target.value === "1") {
                              removeSharedUser(userMail);
                            }
                          }}
                        >
                          <option>
                            {userMail.role === "write" &&
                              "Read and write/Editor"}
                          </option>
                          <option className="text-danger" value="1">
                            Remove
                          </option>
                        </Form.Select>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="d-flex align-item-center justify-content-end mt-4">
                {!isFormModified && (
                  <Button
                    className="btn bg-gradient-dark btn btn-outline-dark btn-sm w-100"
                    onClick={() => handleClose("shareModal")}
                  >
                    Fine
                  </Button>
                )}
                {isFormModified && (
                  <Button
                    type="submit"
                    className="btn bg-gradient-dark btn btn-outline-dark btn-sm w-100"
                  >
                    Salva
                  </Button>
                )}
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal
          show={modalState.deleteModal}
          onHide={() => handleClose("deleteModal")}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <b>
                Confirm to delete: <i>{scheda.titolo}</i>?
              </b>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Are you sure to delete this scheda <i>"{scheda.titolo}"</i>
              ,<br /> <b>this action can be undone</b>{" "}
            </p>
            <div className="row mt-4 mb-3">
              <div className="col-4">
                <button
                  className=" text-dark btn btn-outline-dark btn-sm mb-0 w-100"
                  onClick={() => handleClose("deleteModal")}
                >
                  <p className="mb-0 ">cancel</p>
                </button>
              </div>
              <div className="col-8">
                <button
                  type="submit"
                  className="text-danger btn border border-1 border-danger w-100 "
                  // onClick={() => dispatch(deleteSchedaSpese(scheda._id))}
                  onClick={() => deleteSchedaFromDetail()}
                >
                  Delete
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <Modal
          show={modalState.deleteNotaModal}
          onHide={() => handleClose("deleteNotaModal")}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <b>
                Confirm to delete: <i>{notaSpesaToEdit?.testo}</i>?
              </b>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Are you sure to delete this note <i>"{notaSpesaToEdit?.testo}"</i>
              ,<br /> <b>this action can be undone</b>{" "}
            </p>
            <div className="row mt-4 mb-3">
              <div className="col-4">
                <button
                  className=" text-dark btn btn-outline-dark btn-sm mb-0 w-100"
                  onClick={() => handleClose("deleteNotaModal")}
                >
                  <p className="mb-0 ">cancel</p>
                </button>
              </div>
              <div className="col-8">
                <button
                  type="submit"
                  className="text-danger btn border border-1 border-danger w-100 "
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

export default SingleSchedaAllNote;

import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import { createNotaSpese, updateNotaSpese } from '../features/notaSpese/notaSpeseSlice'
import { getSchedaSpese, updateSchedaSpese } from '../features/schedaSpese/schedaSpeseSlice'
import { parseDate } from './utils/dateParser'

function NotaSpeseForm({ onSuccess, schedaId, notaToEdit = null, beforeDelete = null }) {
  const { user } = useSelector((state) => state.auth);
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    testo: notaToEdit?.testo ?? '',
    inserimentoData: notaToEdit?.inserimentoData.split('T')[0] ?? today,
    importo: notaToEdit?.importo ?? '',
    categoria_id: []
  })
  const [isDisabled, setisDisabled] = useState(false);
  const { testo, inserimentoData, importo, categoria_id } = formData

  const dispatch = useDispatch()

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

const onSubmit = async (e) => {
  e.preventDefault()
  if (!testo || !importo) {
    toast.error('Please fill in all required fields')
  } else {
    if (parseFloat(importo) > 10000) {return toast.error('Limit amount 10000')  }
    
    const notaSpeseData = {
      testo,
      inserimentoData: inserimentoData || new Date().toISOString(),
      importo: parseFloat(importo),
      categoria_id: null,
      inserimentoUser: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    };

    if (notaToEdit !== null) {
      notaSpeseData.notaID = notaToEdit._id;
      fetchDispatch(notaSpeseData, true);
    } else {
      fetchDispatch(notaSpeseData);
    }
  }
}

  // C'è LA BOZZA DELLA CATEGIA_ID MA NON È IMPLEMENTATA
  // const onSubmit = async (e) => {
  //   e.preventDefault()
  //   if (!testo || !importo) {
  //     toast.error('Please fill in all required fields')
  //   } else {
  //     const categoriesArray = ['53cb6b9b4f4ddef1ad47f943', "53cb6b9b4f4ddef1ad47f911"];
  //     if (categoria_id.length > 0) categoriesArray.push(categoria_id);
  //     const notaSpeseData = {
  //       notaID: notaToEdit ? notaToEdit._id : null,
  //       testo,
  //       inserimentoData: inserimentoData || new Date().toISOString(),
  //       importo: parseFloat(importo),
  //       categoria_id: categoriesArray,
  //       inserimentoUser: {
  //         id: user._id,
  //         email: user.email,
  //         name: user.name
  //       }
  //     };

  //     if (notaToEdit !== null) {
  //       // Edit: pass the correct notaID and data
  //       fetchDispatch(notaSpeseData, true);
  //     } else {
  //       // Create: do not pass notaID
  //       const notaSpeseDataNew = {
  //         testo,
  //         inserimentoData: inserimentoData || new Date().toISOString(),
  //         importo: parseFloat(importo),
  //         categoria_id: categoriesArray,
  //         inserimentoUser: {
  //           id: user._id,
  //           email: user.email,
  //           name: user.name
  //         }
  //       };
  //       fetchDispatch(notaSpeseDataNew);
  //     }

  //   }
  // }

  const fetchDispatch = async (notaSpeseData, isEdit = false) => {
    setisDisabled(true);
    try {
      let response;
      if (isEdit) {
        response = await dispatch(updateNotaSpese(notaSpeseData)).unwrap();
        toast.success("Nota spese modificata con successo!");
      } else {
        response = await dispatch(createNotaSpese(notaSpeseData)).unwrap();
        toast.success("Nota spese creata con successo!");
        // Update schedaSpese with new notaSpese
        const data = {
          notaSpeseData: response,
          schedaId: schedaId,
        };
        await dispatch(updateSchedaSpese(data)).unwrap();
      }
      await dispatch(getSchedaSpese()).unwrap();
    } catch (error) {
      console.error("Error Response:", error);
      toast.error(error.message || "Errore nella creazione della nota spese");
    } finally {
      onSuccess();
      setisDisabled(false);
    }
  };

  return (
    <Container>
      <Form className="mb-3" onSubmit={onSubmit}>

        <Form.Group className="mb-3">
          <Form.Label>Inserimento Data</Form.Label>
          <Form.Control
            type="date"
            id="inserimentoData"
            name="inserimentoData"
            value={inserimentoData}
            onChange={onChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Testo</Form.Label>
          <Form.Control
            type="text"
            id="testo"
            name="testo"
            value={testo}
            placeholder="Enter text"
            onChange={onChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Importo</Form.Label>
          <Form.Control
            type="number"
            id="importo"
            name="importo"
            value={importo}
            placeholder="Enter amount"
            onChange={onChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Categoria ID</Form.Label>
          <Form.Control
            type="text"
            id="categoria_id"
            name="categoria_id"
            value={categoria_id}
            placeholder="Enter category ID"
            onChange={onChange}
          />
        </Form.Group>

        <div className="row mt-4 mb-3">
          <div className="col-4">
            {notaToEdit !== null &&
              <div
                style={{ cursor: "pointer" }}
                className='text-danger btn border border-1 border-danger w-100'
                onClick={beforeDelete}>
                Delete
              </div>
            }
          </div>
          <div className="col-8">
            <button type="submit"
              className="d-flex align-items-center justify-content-center btn bg-gradient-dark w-100"
              disabled={isDisabled}>
              <p className="mb-0 ">
                {notaToEdit === null ? ("Create") : ("Edit")}
              </p>
            </button>
          </div>

        </div>
      </Form>

    </Container>
  )
}

export default NotaSpeseForm
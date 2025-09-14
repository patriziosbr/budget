import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import { createNotaSpese, updateNotaSpese } from '../features/notaSpese/notaSpeseSlice'
import { singleSchedaSpeseGet, updateSchedaSpese } from '../features/schedaSpese/schedaSpeseSlice'
import { getAllCategories } from '../features/categorie/categorieSlice'
import { useEffect } from 'react'
import SelectSearch from './utils/SelectSearch'

function NotaSpeseFormAllNote({ onSuccess, schedaId, notaToEdit = null, beforeDelete = null }) {
  const { user } = useSelector((state) => state.auth);
  const today = new Date().toISOString().split('T')[0];
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    testo: notaToEdit?.testo ?? '',
    inserimentoData: notaToEdit?.inserimentoData.split('T')[0] ?? today,
    importo: notaToEdit?.importo ?? '',
    categoria: notaToEdit?.categoria || '',
    categoriaToShow: ''
  })
  const [isDisabled, setisDisabled] = useState(false);
  const { testo, inserimentoData, importo, categoria, categoriaToShow } = formData

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
      categoria: categoria,
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

useEffect(() => {
  // Using async IIFE to handle the async operation
  (async () => {
    try {
      const res = await dispatch(getAllCategories()).unwrap();
      setCategories(res);
      
      // Now that we have categories, find the matching one for notaToEdit
      if (notaToEdit?.categoria) {
        const matchedCategory = res.find(cat => cat._id === notaToEdit.categoria);
        if (matchedCategory) {
          setFormData(prevState => ({
            ...prevState,
            categoriaToShow: matchedCategory
          }));
        }
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  })();
}, []); // Empty dependency array to run only once

  const handleCategoryChange = (selectedOption) => {
    setFormData((prevState) => ({
      ...prevState,
      categoria: selectedOption ? selectedOption.value : '',
      categoriaToShow: selectedOption ? selectedOption : ''
      
    }));
    console.log(selectedOption, "selectedOption");
  };


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
      await dispatch(singleSchedaSpeseGet(schedaId))
              .unwrap()
              .catch((error) =>
                console.error("Error fetching single scheda in all note form:", error)
              );
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
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            id="inserimentoData"
            name="inserimentoData"
            value={inserimentoData}
            onChange={onChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            id="testo"
            name="testo"
            value={testo}
            placeholder="Enter text"
            onChange={onChange}
            required
            maxLength={100}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Amount</Form.Label>
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
          {/* <Form.Label>Category</Form.Label> */}
          <Form.Control
            type="hidden"
            id="categoria"
            name="categoria"
            value={categoria}
            placeholder="Select a category"
            onChange={onChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <SelectSearch
            value={formData.categoria}
            onChange={handleCategoryChange}
            option={categories}
            selected={categoriaToShow}
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

export default NotaSpeseFormAllNote
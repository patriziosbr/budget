import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import { createSchedaSpese } from '../features/schedaSpese/schedaSpeseSlice'
import EmailShareList from './utils/EmailShareList';

function SchedaSpeseForm({onSuccess}) {

  const [formData, setFormData] = useState({
    titolo: '',
    inserimentoData: '',
    condivisoConList: []
  })
  
  const { titolo, inserimentoData, condivisoConList } = formData

  const dispatch = useDispatch()

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (!titolo) {
      toast.error('Please fill in all required fields')
    } else {
      const schedaSpeseFormData = {
        titolo,
        inserimentoData: inserimentoData || new Date().toISOString(),
        condivisoConList: condivisoConList
      }

      dispatch(createSchedaSpese(schedaSpeseFormData))
      .unwrap()
      .then((response) => {
        toast.success("Nota spese creata con successo!");
        onSuccess(); 
      })
      .catch((error) => {
        console.error("Error Response:", error); // Debugging
        toast.error(error.message || "Errore nella creazione della nota spese");
      });
    }
  }

  const addEmail = (newEmailEntry) => {
    setFormData((prev) => ({
      ...prev,
      condivisoConList: [...prev.condivisoConList, newEmailEntry],
    }));
  };

  const removeEmail = (email) => {
    setFormData((prev) => ({
      ...prev,
      condivisoConList: prev.condivisoConList.filter((entry) => entry.email !== email),
    }));
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }


  return (    
    <Container>
      <Form className="mb-3" onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Titolo *</Form.Label>
          <Form.Control
            type="text"
            id="titolo"
            name="titolo"
            value={titolo}
            placeholder="GENNAIO"
            onChange={onChange}
            required
          />
        </Form.Group>

        {/* <Form.Group className="mb-3">
          <Form.Label>Inserimento Data</Form.Label>
          <Form.Control
            type="date"
            id="inserimentoData"
            name="inserimentoData"
            value={inserimentoData}
            onChange={onChange}
          />
        </Form.Group> */}

        <EmailShareList 
          emailList_tmp={condivisoConList}
          onAddEmail={addEmail}
          onValidateEmail={validateEmail}
          onRemoveEmail={removeEmail}

        />

        <Button type="submit" className="d-flex justify-content-center align-items-center btn bg-gradient-dark mb-0 w-100 m-auto" >
          <p className='mb-0'>Create</p>
        </Button>
      </Form>
    </Container>
  )
}

export default SchedaSpeseForm
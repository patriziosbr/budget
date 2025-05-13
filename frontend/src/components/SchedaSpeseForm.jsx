import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import { createSchedaSpese } from '../features/schedaSpese/schedaSpeseSlice'
import ListGroup from 'react-bootstrap/ListGroup'
import { FaPlus } from 'react-icons/fa';

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

      // condivisoConList.forEach((email) => {
      //   console.log(`Email: ${email}`); // Debugging
      //   debugger
      // })
      debugger
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

    const [emailToShare, setEmailToShare] = useState('')

    const addEmail = () => {
    if (!emailToShare.trim()) return

    const email = emailToShare.trim().toLowerCase()

    const alreadyAdded = condivisoConList.some((entry) => entry.email === email)

    if (alreadyAdded) {
      toast.warn('Email già aggiunta')
      return
    }

    setFormData((prev) => ({
      ...prev,
      condivisoConList: [...prev.condivisoConList, { email, role: 'write' }],
    }))
    setEmailToShare('')
  }

  const removeEmail = (email) => {
    setFormData((prev) => ({
      ...prev,
      condivisoConList: prev.condivisoConList.filter((entry) => entry.email !== email),
    }))
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
        {/* <Form.Group className="mb-3">
          <Form.Label>Condiviso con</Form.Label>
          <Form.Control
            type="text"
            id="condivisoConList"
            name="condivisoConList"
            value={condivisoConList}
            placeholder="Condiviso con"
            onChange={onChange}
          />
        </Form.Group> */}

        <Form.Group className="mb-3">
          <Form.Label>Condividi con (email)</Form.Label>
          <div className="d-flex align-items-center  gap-2">
            <Form.Control
              type="email"
              placeholder="user@example.com"
              value={emailToShare}
              onChange={(e) => setEmailToShare(e.target.value)}
            />
            <div role="button" className="d-flex align-items-center border-circle p-2">
              <FaPlus onClick={() => addEmail()} />
            </div>
          </div>
        </Form.Group>

        {condivisoConList.length > 0 && (
          <ListGroup className="mb-3">
            {condivisoConList.map((entry, index) => (
              <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                {entry.email}
                <Button variant="outline-danger" size="sm" onClick={() => removeEmail(entry.email)}>
                  Rimuovi
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}

        <Button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Submit
        </Button>
      </Form>
    </Container>
  )
}

export default SchedaSpeseForm
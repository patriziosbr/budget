import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaUser } from 'react-icons/fa'
import { register, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { use } from 'react'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  })

  const { name, email, password, password2 } = formData

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
      setWidth(window.innerWidth);
      console.log(`Window width: ${window.innerWidth}`);
  }

  useEffect(() => {
      window.addEventListener('resize', handleWindowSizeChange);
      return () => {
          window.removeEventListener('resize', handleWindowSizeChange);
      }
  }, [window]);

  const isMobile = width <= 768;
  const [styleMtop, setStyleMtop] = useState({});
  useEffect(() => {
      if(isMobile ) {
        setStyleMtop({
          marginTop: '20px' 
        })
      } else {
        setStyleMtop({
          marginTop: '100px' 
        })
      }
  }, [isMobile]);
  
  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess || user) {
      navigate('/')
    }

    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (password !== password2) {
      toast.error('Passwords do not match')
    } else {
      const userData = {
        name,
        email,
        password,
      }

      dispatch(register(userData))
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <Container className='mb-5'>
      <div style={styleMtop} className='d-flex align-items-center'>
        <div style={{backgroundColor: "#f2f6ff",
          borderRadius: "50%",
          aspectRatio: "1",
          display: "flex",
          height: "90px",
          marginRight: "15px",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "15px"
        }}>
          <FaUser style={{fontSize:"60px", color:"#0d6efd" }}/>
        </div>
        <div className='h-100'>
          <h1>Register</h1>
          <p className=''>Please create an account</p>
        </div>
      </div>
      <Form className="mb-3" onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" id='name' name="name" value={name} placeholder='Enter your name' onChange={onChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" id='email' name="email" value={email} placeholder='Enter your email' onChange={onChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" id='password' name="password" value={password} placeholder='Enter password' onChange={onChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type="password2" id='password2' name="password2" value={password2} placeholder='Confirm password' onChange={onChange} />
        </Form.Group>
        <Button type='submit' className='btn btn-primary' style={{width:"100%"}}>
          Submit
        </Button>
      </Form>
      </Container>
    </>
  )
}

export default Register

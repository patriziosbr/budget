import { useState, useEffect } from 'react'
import { FaSignInAlt } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { login, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData

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

    const userData = {
      email,
      password,
    }

    dispatch(login(userData))
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <Container>
        <section style={styleMtop} className='d-flex align-items-center'>
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
            <FaSignInAlt style={{fontSize:"60px", color:"#0d6efd" }}/>
          </div>
          <div className='h-100'>
            <h1>Login</h1>
            <p>Login and save your budget</p>
          </div>
        </section>
        <Form className="mb-3" onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" id='email' name="email" value={email} placeholder='Enter your email' onChange={onChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" id='password' name="password" value={password} placeholder='Enter password' onChange={onChange} />
          </Form.Group>
          <Button type="submit" className='btn btn-primary' style={{width:"100%"}}>
            Submit
          </Button>
        </Form>
      </Container>
    </>
  )
}

export default Login

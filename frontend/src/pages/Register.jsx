import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, NavLink } from 'react-router-dom'
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
import { closeMenu } from '../features/utils/menuSlice'

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

  const addHtml = () => {
    return (
      <span>
        I agree to the <b>hello</b>
      </span>
    )
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <div className="container my-auto mt-5">
        <div className="row">
          <div className="col-lg-6 col-md-8 col-12 mx-auto">
            <div className="card z-index-0 fadeIn3 fadeInBottom">
              <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div className="bg-gradient-dark shadow-dark border-radius-lg py-3 pe-1">
                  <h4 className="text-white font-weight-bolder text-center mt-2 mb-0">Register</h4>
                  <p className="text-white text-center mt-2">Enter your email and password to register</p>
                  <div className="row mt-3">
                    <div className="col-2 text-center ms-auto">
                      <a className="btn btn-link px-3" href="">
                        <i className="fa fa-facebook text-white text-lg"></i>
                      </a>
                    </div>
                    <div className="col-2 text-center px-1">
                      <a className="btn btn-link px-3" href="">
                        <i className="fa fa-github text-white text-lg"></i>
                      </a>
                    </div>
                    <div className="col-2 text-center me-auto">
                      <a className="btn btn-link px-3" href="">
                        <i className="fa fa-google text-white text-lg"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
              <Form className="mb-3" onSubmit={onSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" id='name' name="name" value={name} placeholder='Name' onChange={onChange} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" id='email' name="email" value={email} placeholder='Email' onChange={onChange} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" id='password' name="password" value={password} placeholder='Password' onChange={onChange} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                      <Form.Control type="password2" id='password2' name="password2" value={password2} placeholder='Confirm password' onChange={onChange} />
                  </Form.Group>



                  <div className="form-check form-check-info text-start ps-0">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                    <label className="form-check-label" for="flexCheckDefault">
                      I agree the <NavLink to='/' className="text-dark font-weight-bolder">Terms and Conditions</NavLink>
                    </label>
                  </div>


                  <div className="text-center">
                    <Button type='submit' className="btn btn-lg bg-gradient-dark btn-lg w-100 mt-4 mb-0 p-2"><p className='m-0'>Register</p></Button>
                  </div>
              </Form>
              </div>
              <div className="text-center pt-0 pb-2 px-lg-2 px-1">
                <p className="mb-2 text-sm mx-auto">
                  Already have an account?
                  <NavLink className="text-primary text-gradient font-weight-bold" to='/login' onClick={()=> dispatch(closeMenu())} >
                      <span className="nav-link-text ms-1">Login</span>
                  </NavLink>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register


      {/* <Container className='mb-5'>
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
      </Container> */}
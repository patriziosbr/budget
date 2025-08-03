import { useState, useEffect } from 'react'
import { FaSignInAlt } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, NavLink } from 'react-router-dom'
import { toast } from 'react-toastify'
import { login, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'
import { toggleMenu, closeMenu } from '../features/utils/menuSlice';

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

  const menuState = useSelector((state) => state.menuShow.value);

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
    // Validate form data
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    const userData = {
      email,
      password,
    }

    // if (menuState) dispatch(toggleMenu());
    dispatch(login(userData))
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <div class="container my-auto mt-5">
        <div class="row">
          <div class="col-lg-4 col-md-8 col-12 mx-auto">
            <div class="card z-index-0 fadeIn3 fadeInBottom">
              <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div class="bg-gradient-dark shadow-dark border-radius-lg py-3 pe-1">
                  <h4 class="text-white font-weight-bolder text-center my-2">Login</h4>
                  {/* <div class="row mt-3">
                    <div class="col-2 text-center ms-auto">
                      <a class="btn btn-link px-3" href="javascript:;">
                        <i class="fa fa-facebook text-white text-lg"></i>
                      </a>
                    </div>
                    <div class="col-2 text-center px-1">
                      <a class="btn btn-link px-3" href="javascript:;">
                        <i class="fa fa-github text-white text-lg"></i>
                      </a>
                    </div>
                    <div class="col-2 text-center me-auto">
                      <a class="btn btn-link px-3" href="javascript:;">
                        <i class="fa fa-google text-white text-lg"></i>
                      </a>
                    </div>
                  </div> */}
                </div>
              </div>

              <div class="card-body">
                <Form className="text-start my-3" onSubmit={onSubmit}>
                  <Form.Group className=" mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" id='email' name="email" value={email} placeholder='Email' onChange={onChange} />
                  </Form.Group>
                  <Form.Group className=" mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" id='password' name="password" value={password} placeholder='Password' onChange={onChange} />
                  </Form.Group>
                  <p class="mt-2 text-sm text-end">

                    <NavLink className="text-primary text-gradient font-weight-bold" to='/' >
                        <span className="nav-link-text ms-1">Forgot password?</span>
                    </NavLink>
                  </p>
                  <Button type="submit" className='btn bg-gradient-dark w-100 my-4 mb-2 p-2' >
                    Login
                  </Button>
                  <div>
                  <p class="mt-4 text-sm text-center">
                    Don't have an account?
                    <NavLink className="text-primary text-gradient font-weight-bold" to='/register' onClick={(e) => { dispatch(closeMenu())}}>
                        <span className="nav-link-text ms-1">Register</span>
                    </NavLink>
                  </p>
                  </div>
                </Form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
      {/* <Container>
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
      </Container> */}

export default Login

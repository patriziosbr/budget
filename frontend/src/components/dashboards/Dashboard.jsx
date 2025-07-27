import { useState, useEffect } from 'react'
import { FaSignInAlt } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { login, reset } from '../../features/auth/authSlice'
import Spinner from '../Spinner'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Linechart from '../charts/LineChart'
import CardDashboard from '../utils/CardDashboard'

function Dashboard() {

  const { user } = useSelector((state) => state.auth)

  console.log("user", user);
  return (
    <>
      <Container className="mt-5">

        <div className="row">
          <h1>Easy budget start here. Meet <b>Budgetz</b></h1>
          <p>Welcome to Budgetz, your personal finance companion. Start managing your expenses effortlessly.</p>
        </div>
        <div className="row">
          <Linechart />
        </div>
        <div className="row">
          <CardDashboard/>
        </div>
      </Container>
    </>
  )
}

export default Dashboard

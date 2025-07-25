import { useSelector, useDispatch } from 'react-redux'

function DashboardUser() {

  const { user } = useSelector((state) => state.auth)

  return (
    <>
        <h1>Welcome to the Dashboard</h1>
        <p>Hello, {user.name}!</p>
    </>
  )
}

export default DashboardUser
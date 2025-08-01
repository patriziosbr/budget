import { useSelector, useDispatch } from 'react-redux'

function DashboardUser() {

  const { user } = useSelector((state) => state.auth)

  return (
    <>
    <div className="container-fluid">
        <h1>Welcome to the Dashboard</h1>
        <p>Hello, {user.name}!</p>
    </div>
    </>
  )
}

export default DashboardUser
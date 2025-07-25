import { useSelector, useDispatch } from 'react-redux'
import Dashboard from '../components/dashboards/Dashboard'
import DashboardUser from '../components/dashboards/DashboardUser'

function Home() {

  const { user } = useSelector((state) => state.auth)

  return (
    <>
        {user ? (
          <DashboardUser/>
        ) : (
          <Dashboard/>
        )}
    </>
  )
}

export default Home
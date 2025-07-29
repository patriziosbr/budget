import { useSelector, useDispatch } from 'react-redux'
import DashboardWithCharts from '../components/dashboards/DashboardWithCharts'
import DashboardUser from '../components/dashboards/DashboardUser'

function Home() {

  const { user } = useSelector((state) => state.auth)

  return (
    <>
        {user ? (
          <DashboardUser/>
        ) : (
          <DashboardWithCharts/>
        )}
    </>
  )
}

export default Home
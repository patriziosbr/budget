import { useSelector, useDispatch } from 'react-redux'
import DashboardUser from '../components/dashboards/DashboardUser'
import HeroAreaPublic from '../components/layout/HeroAreaPublic.jsx'

function Home() {

  const { user } = useSelector((state) => state.auth)

  return (
    <>
        {user ? (
          <DashboardUser/>
        ) : (
          <HeroAreaPublic />
          // <DashboardWithCharts/>
        )}
    </>
  )
}

export default Home
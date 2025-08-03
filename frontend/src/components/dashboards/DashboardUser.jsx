import { useSelector, useDispatch } from 'react-redux'

function DashboardUser() {

  const { user } = useSelector((state) => state.auth)

  return (
    <>
    <div className="container-fluid py-2">
      <div className="row">
        <h3 className="mb-0 h4 font-weight-bolder">Dashboard</h3>
        {/* <p className='mb-4'>Hello, {user.name}!</p> */}
      </div>
      

    </div>
    </>
  )
}

export default DashboardUser
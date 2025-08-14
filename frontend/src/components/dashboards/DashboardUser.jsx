import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import WorkInProgress from '../utils/WorkInProgress'

function DashboardUser() {

  const { user } = useSelector((state) => state.auth)

  return (
    <>
    <div className="container py-2">
      <div className="row">
        <h3 className="mb-0 h4 font-weight-bolder">Dashboard</h3>
        {/* <p className='mb-4'>Hello, {user.name}!</p> */}
      </div>
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body p-3">
              <div className="row">
                <div className="col-12 d-flex justify-content-center">
                  <WorkInProgress />
                </div>
                <div className="col-12 text-center mt-4">
                  <div className="numbers">
                    <h5 className="font-weight-bolder">
                      Page under construction
                    </h5>
                    <p className="mb-0">
                      We apologize for the inconvenience, we are working to improve your experience.
                    </p>
                    <Link to="/note-spese" className="btn bg-dark text-white mt-3">Expence list</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default DashboardUser
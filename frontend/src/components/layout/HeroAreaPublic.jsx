import heroImg from '../../../src/assets/illustration.png';
import { useNavigate } from "react-router-dom";

const HeroAreaPublic = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <h1>Share Your Budget Expenses</h1>
                        <p className="lead">Easily share your budget with family, friends, and coworkers. Keep track of your expenses together.</p>
                        <div className="row">
                            <div className="col-2">
                                <button onClick={()=>navigate('/login')} className='btn bg-dark text-white'>Login</button>
                            </div>
                            <div className="col-2">
                                <button onClick={()=>navigate('/register')} className='text-dark bg-white btn btn-outline-dark '>Register</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <img className="img-fluid" src={heroImg} alt="" />
                    </div>
                    <div></div>
                </div>
            </div>
        </>

    )
}
export default HeroAreaPublic;
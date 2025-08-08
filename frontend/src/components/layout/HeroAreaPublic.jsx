import heroImg from '../../../src/assets/illustration.png';

const HeroAreaPublic = () => {
    return (
        <>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <h1>Share Your Budget Expenses</h1>
                        <p className="lead">Easily share your budget with family, friends, and coworkers. Keep track of your expenses together.</p>
                    </div>
                    <div className="col-md-6">
                        <img className="img-fluid" src={heroImg} alt="" />
                    </div>
                </div>
            </div>
        </>

    )
}
export default HeroAreaPublic;
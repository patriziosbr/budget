import { useEffect, useState } from "react";

const Spinner = () => {
const [time, setTime] = useState(30);

  useEffect(() => {
    let timer = setInterval(() => {
      setTime((time) => {
        if (time === 0) {
          clearInterval(timer);
          return 0;
        } else return time - 1;
      });
    }, 1000);
  }, []);

  const TimeBox = ({ label, value }) => (
    <div className="timer-abs">
      <p className="text-center font-bold text-2xl text-gray m-0">{label}</p>
      <p className="text-center font-bold text-2xl text-gray m-0">{value}</p>
    </div>
  );
  return (
    <div className="parent-timer">
      <div className='loadingSpinnerContainer'>
      {/* <div className='loadingSpinner'></div> */}
      <span class="loader"></span>
        <TimeBox value={time} />
      </div>
    </div>

  );
};

export default Spinner;

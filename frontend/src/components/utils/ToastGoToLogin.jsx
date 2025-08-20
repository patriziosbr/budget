import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom";

function ToastGoToLogin() {
    const navigate = useNavigate();

    toast.success(<Msg />, {
        toastId: "err1",
        autoClose: false,
        closeOnClick: true,
        draggable: false,
        pauseOnHover: true
    });

    function Msg() {
    return (
      <div>
        <span>
          A password reset link has been sent to your email. Please check your
          inbox,
          <span
            className="text-primary"
            role="button"
            onClick={() => navigate("/login")}
          >
            <u>login</u>
          </span>{" "}
          to continue
        </span>
      </div>
    );
  }
}
export default ToastGoToLogin;

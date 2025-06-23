import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { conf, configWithHeaders } from "../conf/conf";
import { setCurrentUser } from "../redux/reducer/authSlice";

const Verify = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Redirect if already verified
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else if (currentUser.isVerified) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(code)) {
      toast.error("Enter a valid 6-digit OTP code");
      return;
    }

    setIsVerifying(true);
    const toastId = toast.loading("Verifying...");

    try {
      const { data } = await axios.put(
        `${conf.server1Url}/users/verify-email`,
        { verifyCode: code },
        configWithHeaders
      );

      if (data.success) {
        toast.success("Email verified successfully!", { id: toastId });
        dispatch(setCurrentUser(data.data));
        navigate("/");
      } else {
        toast.error(data.message || "Verification failed", { id: toastId, duration: 3000 });
      }
    } catch (error) {
      toast.error("Verification failed. Try again.", { id: toastId, duration: 3000 });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendVerifyCode = async () => {
    setIsResending(true);
    const toastId = toast.loading("Resending OTP...");

    try {
      const { data } = await axios.get(
        `${conf.server1Url}/users/resend-verifycode`,
        configWithHeaders
      );

      if (data.success) {
        toast.success(`${data.message}`, { id: toastId, duration: 3000 });
      } else {
        toast.error(data.message || "Failed to resend OTP", { id: toastId, duration: 3000 });
      }
    } catch (error) {
      toast.error("Failed to resend OTP", { id: toastId, duration: 3000 });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center py-20 px-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-300 rounded-2xl">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-primary text-center">
            Verify Your Email
          </h2>
          <p className="text-sm text-center mb-4 text-black/80">
            Enter the 6-digit code sent to your email
          </p>

          <form onSubmit={handleVerifyCode}>
            <div className="form-control mb-4">
              <label htmlFor="otp" className="label">
                <span className="label-text text-black/80">OTP Code</span>
              </label>
              <input
                type="text"
                id="otp"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="input input-bordered w-full text-center tracking-widest text-lg"
                required
              />
            </div>

            <div className="form-control mt-4">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <span className="loading loading-dots loading-md"></span>
                ) : (
                  "Verify"
                )}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-black/80">
              Didn't get the code?{" "}
              <button
                onClick={handleResendVerifyCode}
                className="font-medium text-primary hover:underline"
                disabled={isResending}
              >
                {isResending ? "Sending..." : "Resend OTP"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;
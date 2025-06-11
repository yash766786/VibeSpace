import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserState.jsx";
import { useAlert } from "../context/AlertState.jsx";

function PasswordReset() {
  const { 
    initiateForgetPasswordReset, 
    verifyCodeAndResetPassword, 
    getEmailForResetPassword 
  } = useUser();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otpAndPasswordDetails, setOtpAndPasswordDetails] = useState({
    verifyCode: "",
    password: "",
    confirmPassword: "",
  });
  const [showOtpAndPasswordField, setShowOtpAndPasswordField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function onLoading() {
        // console.log("first checking if already email is sent")
      const response = await getEmailForResetPassword();
      if (response && response.success) {
        setEmail(response.data.email);
        setShowOtpAndPasswordField(true);
        // console.log(response)
      }
    }
    onLoading();
  }, [navigate]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await initiateForgetPasswordReset(email);
    if (response && response.success) {
      setEmail(response.data.email);
      setShowOtpAndPasswordField(true);
      showAlert(response.message, "info");
      // console.log(response)
    } else {
      showAlert(response.message, "danger");
    }
    setIsLoading(false);
  };

  const handleOtpAndPasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (otpAndPasswordDetails.password !== otpAndPasswordDetails.confirmPassword) {
      showAlert("Passwords do not match!", "danger");
      setIsLoading(false);
      return;
    }

    const response = await verifyCodeAndResetPassword(otpAndPasswordDetails);
    if (response && response.success) {
      navigate("/login");
      showAlert(response.message, "success");
    } else {
      showAlert(response.message, "danger");
    }
    setIsLoading(false);
  };

  return (
    <div className="h-auto flex items-center justify-center mb-6">
      <div className="card w-full max-w-lg shadow-xl bg-base-300 opacity-75">
        <div className="card-body">
          <h2 className="text-center text-2xl font-bold leading-tight text-primary">
            {showOtpAndPasswordField ? "Reset Your Password" : "Forgot Password"}
          </h2>

          {/* Email Form */}
          {!showOtpAndPasswordField && (
            <form onSubmit={handleEmailSubmit}>
              <div className="form-control mb-4">
                <label htmlFor="email" className="label">
                  <span className="label-text">Email Address</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control mt-4">
                {isLoading ? (
                  <button className="btn btn-primary w-full" disabled>
                    <span className="loading loading-dots loading-md"></span>
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary w-full">
                    Send Verification Code
                  </button>
                )}
              </div>
            </form>
          )}

          {/* OTP and Password Form */}
          {showOtpAndPasswordField && (
            <form onSubmit={handleOtpAndPasswordSubmit}>
              <div className="form-control mb-4">
                <label htmlFor="verifyCode" className="label">
                  <span className="label-text">Verification Code</span>
                </label>
                <input
                  type="text"
                  id="verifyCode"
                  name="verifyCode"
                  value={otpAndPasswordDetails.verifyCode}
                  onChange={(e) =>
                    setOtpAndPasswordDetails({
                      ...otpAndPasswordDetails,
                      verifyCode: e.target.value,
                    })
                  }
                  placeholder="Enter the verification code"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control mb-4">
                <label htmlFor="password" className="label">
                  <span className="label-text">New Password</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={otpAndPasswordDetails.password}
                  onChange={(e) =>
                    setOtpAndPasswordDetails({
                      ...otpAndPasswordDetails,
                      password: e.target.value,
                    })
                  }
                  placeholder="Enter your new password"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control mb-4">
                <label htmlFor="confirmPassword" className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={otpAndPasswordDetails.confirmPassword}
                  onChange={(e) =>
                    setOtpAndPasswordDetails({
                      ...otpAndPasswordDetails,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm your new password"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control mt-4">
                {isLoading ? (
                  <button className="btn btn-primary w-full" disabled>
                    <span className="loading loading-dots loading-md"></span>
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary w-full">
                    Reset Password
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default PasswordReset;

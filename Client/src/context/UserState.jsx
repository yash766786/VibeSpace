// src/context/UserState.jsx
import { createContext, useContext, useState } from "react";
import conf from "../conf/conf";

// Create UserContext
const UserContext = createContext();

// useUser Hook: To easily access the UserContext
export const useUser = () => {
  return useContext(UserContext);
};

// UserProvider Component: Provides UserContext values and functions
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // done
  const registerUser = async (newUser) => {
    const { username, email, fullname, password, avatar } = newUser;
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("fullname", fullname);
    formData.append("password", password);
    formData.append("avatar", avatar);

    try {
      const response = await fetch(`${conf.serverUrl}/users/register`, {
        method: "POST",
        credentials: "include", 
        body: formData,
      });

      if(!response) return { success: false, message: "Server is not responding." };

      const data = await response.json(); 
      if(data && data.success) setUser(data.data);
      return data;

    } catch (error) {
      // console.log("Error...", error);
      return { success: false, message: "Unexpected error during registration." };
    }
  };

  // done
  const verifyEmail = async (verifyCode) => {
    // console.log("Sending OTP for verification:", verifyCode);
    try {
      const response = await fetch(`${conf.serverUrl}/users/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ verifyCode }),
      });

      if(!response)  return { success: false, message: "Server is not responding." };

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error during OTP verification:", error);
      return { success: false, message: "Unexpected error verifying OTP." };
    }
  };

  // done
  const loginUser = async (user) => {
    const { email, password } = user;
    console.log(`${conf.serverUrl}/users/login`);
    try {
      const response = await fetch(`${conf.serverUrl}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if(!response)  return { success: false, message: "Server is not responding." };

      const data = await response.json();
      if (data.success) setUser(data.data);  
      return data;

    } catch (error) {
      console.error("Error during login:", error);
      return { success: false, message: "Unexpected error Login." };
    }
  };

  // done
  const logoutUser = async () => {
    try {
      const response = await fetch(`${conf.serverUrl}/users/logout`, {
        method: "GET",
        credentials: "include", // Include cookies for authentication
      });

      if(!response)  return { success: false, message: "Server is not responding." };

      const data = await response.json();
      setUser(null);
      return data;

    } catch (error) {
      console.error("Error during logout:", error);
      return { success: false, message: "Unexpected error logout." };
    }
  };

  // done
  const getCurrentUser = async () => {
    try {
      const response = await fetch(`${conf.serverUrl}/users/current-user`, {
        method: "GET",
        credentials: "include",
      });

      if(!response)  return { success: false, message: "Server is not responding." };

      const data = await response.json();
      if (data.success)  setUser(data.data);
      // // console.log(data.data)
      return data;

    } catch (error) {
      // console.log("Error during fetching user", error);
      return { success: false, message: "Unexpected error fetching user."};
    }
  };

  // done
  const getUserProfile = async (username) => {
    try {
      const response = await fetch(`${conf.serverUrl}/users/u/${username}`, {
        method: "GET",
        credentials: "include",
      });

      if(!response)  return { success: false, message: "Server is not responding." };

      const data = await response.json();
      return data;

    } catch (error) {
      // console.log("Error during fetching user profile", error);
      return { success: false, message: "Unexpected error fetching user profile."};
    }
  };

  // done
  const updateAccountDetails = async (user) => {
    const { username, fullname } = user;
    // console.log(user);

    try {
      const response = await fetch(`${conf.serverUrl}/users/update-account`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, fullname }),
      });

      const data = await response.json();
      if (data.success) {
        setUser(data.data);
      }
      // console.log(data);
      return data;
    } catch (error) {
      // console.log("Error...", error);
    }
  };

  // done
  const changeCurrentPassword = async (user) => {
    const { oldPassword, newPassword } = user;
    // console.log(user);
    try {
      const response = await fetch(`${conf.serverUrl}/users/change-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if(!response)  return { success: false, message: "Server is not responding." };

      const data = await response.json();
      // console.log(data);
      return data;
    } catch (error) {
      // console.log("Error during updating password", error);
      return { success: false, message: "Unexpected error updating password."};
    }
  };

  // done
  const updateUserAvatar = async (avatar) => {
    // console.log(avatar)

    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      const response = await fetch(`${conf.serverUrl}/users/avatar`, {
        method: "PATCH",
        credentials: "include", // Include cookies for authentication
        body: formData, // Send FormData to handle file uploads
      });

      const data = await response.json();
      // console.log(data);
      return data;
    } catch (error) {
      // console.log("Error...", error);
    }
  };

  // done
  const checkUsernameExist = async (username) => {
    try {
      const response = await fetch(
        `${conf.serverUrl}/users/check-username/${username}`,
        {
          method: "GET",
          credentials: "include", // Include cookies for authentication
        }
      );

      if(!response)  return { success: false, message: "Server is not responding." };

      const data = await response.json();
      return data;

    } catch (error) {
      // console.log("Error during checking username", error);
      return { success: false, message: "Unexpected error checking username."};
    }
  };

  // FORGOT PASSWORD: step 1
  // done
  const initiateForgetPasswordReset = async (email) =>{
    try {
      const response = await fetch(`${conf.serverUrl}/users/forgot-password-reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      if(!response)  return { success: false, message: "Server is not responding." };

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error during email verification:", error);
      return { success: false, message: "Unexpected error verifying email." };
    }
  };

  // FORGOT PASSWORD: step 2
  // done
  const verifyCodeAndResetPassword = async (verifyCodeAndPassword) =>{
    const {verifyCode, password} = verifyCodeAndPassword
    try {
      const response = await fetch(`${conf.serverUrl}/users/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ verifyCode, password}),
      });

      if(!response)  return { success: false, message: "Server is not responding." };

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error during otp verification and reseting password:", error);
      return { success: false, message: "Unexpected error verifying otp and reset password." };
    }
  };

  // done
  const getEmailForResetPassword = async() =>{
    try {
      const response = await fetch(`${conf.serverUrl}/users/reset-password-email`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if(!response)  return { success: false, message: "Server is not responding." };

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error during email verification:", error);
      return { success: false, message: "Unexpected error verifying email." };
    }
  }

  return (
    <UserContext.Provider
      value={{
        registerUser,
        verifyEmail,
        loginUser,
        logoutUser,
        getCurrentUser,
        getUserProfile,
        updateAccountDetails,
        changeCurrentPassword,
        updateUserAvatar,
        checkUsernameExist,
        initiateForgetPasswordReset,
        verifyCodeAndResetPassword,
        getEmailForResetPassword,
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

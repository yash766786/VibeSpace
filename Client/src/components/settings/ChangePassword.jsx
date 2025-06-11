// src/components/settings/ChangePassword.jsx
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { conf, configWithHeaders } from "../../conf/conf";

const ChangePassword = () => {
  const intitalPassword = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  }
  const [form, setForm] = useState(intitalPassword);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (form.newPassword !== form.confirmPassword) {
      return toast.error("New password and confirmation do not match");
    }

    const toastId = toast.loading("Changing password...");
    try {
      await axios.patch(
        `${conf.server1Url}/users/change-password`,
        form,
        configWithHeaders
      );
      toast.success("Password updated", { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message, { id: toastId });
    }
    finally{
      setForm(intitalPassword)
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="password"
        name="currentPassword"
        className="input input-bordered w-full"
        placeholder="Current Password*"
        value={form.currentPassword}
        onChange={handleChange}
      />
      <input
        type="password"
        name="newPassword"
        className="input input-bordered w-full"
        placeholder="New Password*"
        value={form.newPassword}
        onChange={handleChange}
      />
      <input
        type="password"
        name="confirmPassword"
        className="input input-bordered w-full"
        placeholder="Confirm New Password*"
        value={form.confirmPassword}
        onChange={handleChange}
      />
      <button onClick={handleSubmit} className="btn btn-primary w-full">
        Change Password
      </button>
    </div>
  );
};

export default ChangePassword;
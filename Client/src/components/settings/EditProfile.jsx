// src/components/settings/EditProfile.jsx
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { conf, configWithHeaders } from "../../conf/conf";
import { setCurrentUser } from "../../redux/reducer/authSlice";


const EditProfile = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    username: currentUser?.username || "",
    fullname: currentUser?.fullname || "",
    bio: currentUser?.bio || "",
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const toastId = toast.loading("Updating profile...");
    try {
      const { data } = await axios.patch(
        `${conf.server1Url}/users/edit-profile`,
        form,
        configWithHeaders
      );
      dispatch(setCurrentUser(data.data));
      toast.success("Profile updated", { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message, { id: toastId });
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        name="username"
        className="input input-bordered w-full"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
      />
      <input
        type="text"
        name="fullname"
        className="input input-bordered w-full"
        placeholder="Full Name"
        value={form.fullname}
        onChange={handleChange}
      />
      <textarea
        name="bio"
        className="textarea textarea-bordered w-full"
        placeholder="Bio"
        rows={3}
        value={form.bio}
        onChange={handleChange}
      />
      <input
        type="email"
        className="input input-bordered w-full bg-gray-100"
        value={currentUser?.email || ""}
        readOnly
      />
      <button onClick={handleSubmit} className="btn btn-primary w-full">
        Update Profile
      </button>
    </div>
  );
};

export default EditProfile;
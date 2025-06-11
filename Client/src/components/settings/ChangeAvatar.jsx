// src/components/settings/ChangeAvatar.jsx
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { conf, configWithHeaders, configWithoutHeaders } from "../../conf/conf";
import { setCurrentUser } from "../../redux/reducer/authSlice";

const ChangeAvatar = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const [preview, setPreview] = useState(currentUser?.avatar?.url);
  const [avatar, setAvatar] = useState(null);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!avatar) return toast.error("Please select an image");
    const toastId = toast.loading("Updating avatar...");
    try {
      const formData = new FormData();
      formData.append("avatar", avatar);
      const { data } = await axios.patch(
        `${conf.server1Url}/users/change-avatar`,
        formData,
        configWithoutHeaders
      );
      dispatch(setCurrentUser(data.data));
      toast.success("Avatar updated", { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message, { id: toastId });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <label htmlFor="avatarInput" className="cursor-pointer relative">
        <img
          src={preview}
          alt="Avatar Preview"
          className="w-24 h-24 rounded-full object-cover border-2 border-primary"
        />
        <div className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full text-xs">
          Edit
        </div>
        <input
          type="file"
          accept="image/*"
          id="avatarInput"
          className="hidden"
          onChange={handleChange}
        />
      </label>
      <button onClick={handleUpload} className="btn btn-primary">
        Update Avatar
      </button>
    </div>
  );
};

export default ChangeAvatar;
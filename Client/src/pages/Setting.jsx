// src/pages/Setting.jsx
import ChangeAvatar from "../components/settings/ChangeAvatar";
import EditProfile from "../components/settings/EditProfile";
import ChangePassword from "../components/settings/ChangePassword";

const Setting = () => {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8 h-[calc(100vh-70px)] overflow-auto scrollbar-hide">
      <h1 className="text-3xl font-bold text-center">Account Settings</h1>

      <section className="bg-base-100 shadow-md rounded-xl p-4">
        <ChangeAvatar />
      </section>

      <section className="bg-base-100 shadow-md rounded-xl p-4">
        <EditProfile />
      </section>

      <section className="bg-base-100 shadow-md rounded-xl p-4">
        <ChangePassword />
      </section>
    </div>
  );
};

export default Setting;
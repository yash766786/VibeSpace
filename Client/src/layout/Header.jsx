

// import { Search, Bell } from "lucide-react";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { NEW_NOTIFICATION_ALERT } from "../constant/events";
// import { useSocketEvent } from "../hooks/useSocketEvent";
// import { fetchNotifications } from "../api/server2.api";
// import {
//   addNotification,
//   setNotifications,
// } from "../redux/reducer/notificationSlice";
// import toast from "react-hot-toast";

// const Header = ({ setIsSidebarOpen, onSearchClick, onNotificationClick }) => {
//   const dispatch = useDispatch();
//   const { unseenCount, notifications } = useSelector((state) => state.notification);

//   useSocketEvent(NEW_NOTIFICATION_ALERT, ({ newNotification }) => {
//     console.log("Received NEW_NOTIFICATION_ALERT", newNotification);
//     dispatch(addNotification(newNotification));
//   });

//   const fetchNotification = async () => {
//     try {
//       const { data } = await fetchNotifications();
//       dispatch(setNotifications(data.data));
//       console.log(data)
//       console.log(data.data[0])
      
//     } catch (error) {
//       toast.error(error?.response?.data?.message)
//     }
//   };

//   useEffect(() => {
//     fetchNotification();
//   }, []);

//   return (
//     <header className="navbar bg-base-100 shadow sticky top-0 z-15">
//       <div className="flex-1">
//         <a className="text-xl font-bold">VibeSpace</a>
//         <button className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
//           Menu
//         </button>
//       </div>
//       <div className="flex-none flex items-center gap-4 pr-4">
//         <button onClick={onSearchClick} className="btn btn-ghost btn-circle">
//           <Search size={20} />
//         </button>
//         <button
//           onClick={onNotificationClick}
//           className="btn btn-ghost btn-circle relative"
//         >
//           <Bell size={20} />
//           {unseenCount > 0 && (
//             <span className="badge badge-error text-white text-xs absolute -top-1 -right-1">
//               {unseenCount}
//             </span>
//           )}
//         </button>
//       </div>
//     </header>
//   );
// };

// export default Header;


import { Search, Bell, Menu } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSocketEvent } from "../hooks/useSocketEvent";
import { fetchNotifications } from "../api/server2.api";
import { addNotification, setNotifications } from "../redux/reducer/notificationSlice";
import toast from "react-hot-toast";
import vibespaceLogo from "../assets/vibespace.svg"; // Adjust path if needed

const Header = ({ setIsSidebarOpen, onSearchClick, onNotificationClick }) => {
  const dispatch = useDispatch();
  const { unseenCount } = useSelector((state) => state.notification);

  useSocketEvent("NEW_NOTIFICATION_ALERT", ({ newNotification }) => {
    dispatch(addNotification(newNotification));
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await fetchNotifications();
        dispatch(setNotifications(data.data));
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    })();
  }, []);

  return (
    <header className="navbar bg-white shadow-md sticky top-0 z-20 px-4">
      <div className="flex-1 flex items-center gap-2">
        <img src={vibespaceLogo} alt="VibeSpace Logo" className="w-8 h-8" />
        <span className="text-xl font-bold text-primary">VibeSpace</span>
        <button className="md:hidden ml-auto" onClick={() => setIsSidebarOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      <div className="flex-none flex items-center gap-4">
        <button onClick={onSearchClick} className="btn btn-ghost btn-circle">
          <Search size={20} />
        </button>
        <button onClick={onNotificationClick} className="btn btn-ghost btn-circle relative">
          <Bell size={20} />
          {unseenCount > 0 && (
            <span className="badge badge-error text-white text-xs absolute -top-1 -right-1">
              {unseenCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;

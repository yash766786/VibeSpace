import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import SearchModal from "../components/shared/SearchModal";
import NotificationModal from "../components/shared/NotificationModal";

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const location = useLocation();
  const isChatPage = location.pathname.startsWith("/chat");

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        setIsSidebarOpen={setIsSidebarOpen}
        onSearchClick={() => setIsSearchOpen(true)}
        onNotificationClick={() => setIsNotificationOpen(true)}
      />

      <div className="flex flex-1 relative overflow-hidden">
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        <main className="flex-1 bg-base-100 flex flex-col justify-between">
          <div className="flex-1">
            <Outlet />
          </div>
        </main>
      </div>

      {/* make <footer /> relative to screen and when hover then it goes up  */}

      {/* Modals */}
      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
      {isNotificationOpen && <NotificationModal onClose={() => setIsNotificationOpen(false)} />}
    </div>
  );
};

export default AppLayout;

// import { useState } from "react";
// import Header from "./Header";
// import Sidebar from "./Sidebar";
// import { Outlet, useLocation } from "react-router-dom";
// import SearchModal from "../components/shared/SearchModal";
// import NotificationModal from "../components/shared/NotificationModal";

// const AppLayout = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [isNotificationOpen, setIsNotificationOpen] = useState(false);

//   const location = useLocation();
//   const isChatPage = location.pathname.startsWith("/chat");

//   return (
//     <div className="min-h-screen flex flex-col bg-base-100">
//       <Header
//         setIsSidebarOpen={setIsSidebarOpen}
//         onSearchClick={() => setIsSearchOpen(true)}
//         onNotificationClick={() => setIsNotificationOpen(true)}
//       />

//       <div className="flex flex-1 overflow-hidden">
//         <Sidebar
//           isSidebarOpen={isSidebarOpen}
//           setIsSidebarOpen={setIsSidebarOpen}
//         />
//         {/* <main className="flex-1 p-4 overflow-y-auto">
//           <Outlet />
//         </main> */}

//         <main className="flex-1 bg-base-100 flex flex-col justify-between">
//           <div className="flex-1">
//             <Outlet />
//           </div>
//         </main>
//       </div>

//       {/* Modals */}
//       {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
//       {isNotificationOpen && (
//         <NotificationModal onClose={() => setIsNotificationOpen(false)} />
//       )}
//     </div>
//   );
// };

// export default AppLayout;

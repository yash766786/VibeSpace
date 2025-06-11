// import React from "react";
// import { useNavigate } from "react-router-dom";

// const ModalForFollowers = ({ isOpen, onClose, userFollowers }) => {
//   const navigate = useNavigate();

//   if (!isOpen) return null;

//   const handleProfileNavigation = (username) => {
//     navigate(`/u/${username}`);
//     onClose();
//   };

// //   return (
// //     <div className="bg-white h-52">hello world</div>
// //   )

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-base-300 p-6 rounded-lg w-full max-w-md shadow-lg relative">
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-2 text-gray-500"
//         >
//           &times;
//         </button>

//         {/* Modal Header */}
//         <h2 className="text-lg font-semibold mb-4">Followers</h2>

//         {/* Modal Content */}
//         <div className="overflow-y-auto max-h-60">
//           {userFollowers && userFollowers.length > 0 ? (
//             userFollowers.map((follower) => (
//               <div
//                 key={follower._id}
//                 className="flex items-center mb-3 cursor-pointer"
//                 onClick={() => handleProfileNavigation(follower.follower.username)}
//               >
//                 <img
//                   src={follower.follower.avatar}
//                   alt={follower.follower.username}
//                   className="w-10 h-10 rounded-full mr-3"
//                 />
//                 <div>
//                   <p className="font-semibold">{follower.follower.fullname}</p>
//                   <p className="text-gray-600">
//                     @{follower.follower.username}
//                   </p>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500 text-center">No followers to display</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ModalForFollowers;


// ModalForFollowers.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const ModalForFollowers = ({ isOpen, onClose, userFollowers }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleProfileNavigation = (username) => {
    navigate(`/u/${username}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-300 p-6 rounded-lg w-full max-w-md shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4">Followers</h2>
        <div className="overflow-y-auto max-h-60">
          {userFollowers && userFollowers.length > 0 ? (
            userFollowers.map((follower) => (
              <div
                key={follower._id}
                className="flex items-center mb-3 cursor-pointer"
                onClick={() => handleProfileNavigation(follower.follower.username)}
              >
                <img
                  src={follower.follower.avatar}
                  alt={follower.follower.username}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-semibold">{follower.follower.fullname}</p>
                  <p className="text-gray-600">@{follower.follower.username}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No followers to display</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalForFollowers;

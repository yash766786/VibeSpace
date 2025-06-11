import { createContext, useContext } from "react";
import conf from "../conf/conf";

// Create NoteContext
const FollowContext = createContext();

// useNote Hook: To easily access the NoteContext
export const useFollow = () => {
  return useContext(FollowContext);
};

export const FollowProvider = ({ children }) => {

  // done
  const toggleFollowUser = async (username) => {
    // // console.log(username)
    try {
        const response = await fetch(`${conf.serverUrl}/follow/toggle/u/${username}`, {
            method: "GET",
            credentials: 'include',  // Include cookies for authentication
          }
        );

        const data = await response.json();
        // console.log(data)
        if(data.success){
        }
        return data;
  
      } 
      catch(error){
        // console.log("Error...", error)
      }
  }

  // done
  const getFollowers = async (username) => {
    // console.log(username)
    try {
        const response = await fetch(`${conf.serverUrl}/follow/u/${username}/followers`, {
            method: "GET",
            credentials: 'include',  // Include cookies for authentication
          }
        );

        const data = await response.json();
        // // console.log(data)
        if(data.success){
        }
        return data;
  
      } 
      catch(error){
        // console.log("Error...", error)
      }
  }

  // done
  const getFollowings = async (username) => {
    // // console.log(username)
    try {
        const response = await fetch(`${conf.serverUrl}/follow/u/${username}/followings`, {
            method: "GET",
            credentials: 'include',  // Include cookies for authentication
          }
        );

        const data = await response.json();
        // // console.log(data)
        if(data.success){
        }
        return data;
  
      } 
      catch(error){
        // console.log("Error...", error)
      }
  }

  return (
    <FollowContext.Provider
      value={{
        toggleFollowUser,
        getFollowers,
        getFollowings,
      }}
    >
      {children}
    </FollowContext.Provider>
  );
};

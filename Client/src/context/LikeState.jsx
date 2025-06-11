import { createContext, useContext, useState } from "react";
import conf from "../conf/conf";
// import { apiCall } from "../utils/ApiCall";

// Create NoteContext
const LikeContext = createContext();

// useNote Hook: To easily access the NoteContext
export const useLike = () => {
  return useContext(LikeContext);
};

export const LikeProvider = ({ children }) => {

  // done
  const getPostLikes = async (postId) => {
    try {
      const response = await fetch(`${conf.serverUrl}/likes/${postId}`, {
        method: "GET",
        credentials: "include", // Include cookies for authentication
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        // console.log(data);
      }
      return data;
    } catch (error) {
      // console.log("Error...", error);
    }
  };

  // done
  const togglePostLike = async (postId) => {
    // console.log(postId);
    try {
      const response = await fetch(
        `${conf.serverUrl}/likes/toggle/p/${postId}`,
        {
          method: "POST",
          credentials: "include", // Include cookies for authentication
        }
      );

      if (!response)
        return { success: false, message: "Server is not responding." };

      const data = await response.json();
      return data;
    } catch (error) {
      // console.log("Error while toggle post like ", error);
      return { success: false, message: "Unexpected error toggle post like." };
    }
  };

  // done
  const toggleCommentLike = async (commentId) => {
    try {
      const response = await fetch(
        `${conf.serverUrl}/likes/toggle/c/${commentId}`,
        {
          method: "Post",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response)
        return { success: false, message: "Server is not responding." };

      const data = await response.json();
      return data;
    } catch (error) {
      // console.log("Error while toggle post like ", error);
      return { success: false, message: "Unexpected error toggle post like." };
    }
  };

  return (
    <LikeContext.Provider
      value={{
        getPostLikes,
        togglePostLike,
        toggleCommentLike,
      }}
    >
      {children}
    </LikeContext.Provider>
  );
};

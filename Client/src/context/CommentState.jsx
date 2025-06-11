import { createContext, useContext } from "react";
import conf from "../conf/conf";

// Create NoteContext
const CommentContext = createContext();

// useNote Hook: To easily access the NoteContext
export const useComment = () => {
  return useContext(CommentContext);
};

export const CommentProvider = ({ children }) => {

  // done
  const getPostComments = async (postId) => {
    try {
      const response = await fetch(
        `${conf.serverUrl}/comments/${postId}`,
        {
          method: "GET",
          credentials: "include", // Include cookies for authentication
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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
  const addComment = async (postId, content) => {
    try {
      const response = await fetch(
        `${conf.serverUrl}/comments/${postId}`,
        {
          method: "POST",
          credentials: "include", 
          headers: {
            "Content-Type": "application/json", 
          },
          body: JSON.stringify({ content }),
        }
      );

      if(!response)  return { success: false, message: "Server is not responding." };

      const data = await response.json();
      return data;
    } catch (error) {
      // console.log("Error while adding comment", error);
      return { success: false, message: "Unexpected error add comment." };
    }
  };

  // done
  const deleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `${conf.serverUrl}/comments/c/${commentId}`,
        {
          method: "DELETE",
          credentials: "include", 
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        // console.log(data);
      }
      return data;
    } catch (error) {
      // console.log("Error...", error);
    }
  };

  return (
    <CommentContext.Provider
      value={{
        getPostComments,
        addComment,
        // updateComment,
        deleteComment
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};


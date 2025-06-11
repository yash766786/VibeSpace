import { createContext, useContext, useState } from "react";
import conf from "../conf/conf";

// Create NoteContext
const PostContext = createContext();

// useNote Hook: To easily access the NoteContext
export const usePost = () => {
  return useContext(PostContext);
};

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [totalPage, setTotalPage] = useState(1);

  // done
  const getAllPosts = async (page) => {
    try {
      // it is working
      const response = await fetch(`${conf.serverUrl}/posts?page=${page}`, {
        method: "GET",
        credentials: "include", // Include cookies for authentication
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        setPosts(data.data.posts);
         // Instead of replacing, append new posts to the existing ones
      // setPosts((prevPosts) => [...prevPosts, ...data.data.posts]);
      // console.log(data.data.posts)
        setTotalPage(data.data.totalPages);
      }
      return data;
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  }

  // done
  const addPost = async (post) => {
    const { postFile, description } = post;
    // console.log(post);

    const formData = new FormData();
    formData.append("postFile", postFile);
    formData.append("description", description);

    try {
      const response = await fetch(`${conf.serverUrl}/posts`, {
        method: "POST",
        credentials: "include", 
        body: formData, 
      });

      if(!response)  return { success: false, message: "Server is not responding." };

      const data = await response.json();
      return data;
    } catch (error) {
      // console.log("Error while adding post", error);
      return { success: false, message: "Unexpected error add post." };
    }
  };

  // done
  const updatePost = async (postId, description) => {
    try {
      const response = await fetch(`${conf.serverUrl}/posts/${postId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });

      if(!response)  return { success: false, message: "Server is not responding." };

      const data = await response.json();
      return data;
    } catch (error) {
      // console.log("Error while updating post", error);
      return { success: false, message: "Unexpected error update post." };
    }
  };

  // done
  const deletePost = async (postId) => {
    try {
      const response = await fetch(`${conf.serverUrl}/posts/${postId}`, {
        method: "DELETE",
        credentials: "include", // Include cookies for authentication
      });

      if(!response)  return { success: false, message: "Server is not responding." };

      const data = await response.json();
      return data;
    } catch (error) {
      // console.log("Error while deleting post.", error);
      return { success: false, message: "Unexpected error delete post." };
    }
  };

  // done (see after sometime)
  const getPostByUsername = async (username) => {
    try {
      const response = await fetch(`${conf.serverUrl}/posts/p/${username}`, {
        method: "GET",
        credentials: "include", // Include cookies for authentication
      });

      const data = await response.json();

      return data;
    } catch (error) {
      // console.log("Error...", error);
    }
  };

  return (
    <PostContext.Provider
      value={{
        getAllPosts,
        addPost,
        updatePost,
        deletePost,
        getPostByUsername,
        posts,
        totalPage,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

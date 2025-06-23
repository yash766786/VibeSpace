import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Loader2, UserPlus, UserCheck, MessageCircle } from "lucide-react";

import { getUserProfile } from "../api/user.api";
import { getPostsOfUser, toggleFollowUser } from "../api/server1.api";
import { findChat } from "../api/server2.api";
// motion
import PostCard from "../components/ui/PostCard";
import FollowerModal from "../components/shared/FollowerModal";
import FollowingModal from "../components/shared/FollowingModal";
import ChatInvitationModal from "../components/shared/chatInvitationModal";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { UserPlus2 } from "lucide-react";
import { PoundSterling } from "lucide-react";
import { ImageIcon } from "lucide-react";

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState(null);
  const [chatStatus, setChatStatus] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFollowCount, setCurrentFollowCount] = useState(0);
  const [currentFollowingCount, setCurrentFollowingCount] = useState(0);
  const [currentUserFollowed, setCurrentUserFollowed] = useState(false);
  const [showFollowerModal, setShowFollowerModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showChatInvitationModal, setShowChatInvitationModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userRes = await getUserProfile(username);
        setProfile(userRes.data.data);
        setCurrentFollowCount(userRes.data.data?.followerCount);
        setCurrentFollowingCount(userRes.data.data?.followingCount);
        setCurrentUserFollowed(userRes.data.data?.isUserFollowing);

        const targetUserId = userRes?.data?.data?._id;
        const [chatRes, postRes] = await Promise.all([
          findChat(targetUserId),
          getPostsOfUser(targetUserId),
        ]);
        setChatStatus(chatRes.data.data);
        setPosts(postRes.data.data.posts);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleToggleUser = async (targetUserId) => {
    if (currentUserFollowed) setCurrentFollowCount((prev) => prev - 1);
    else setCurrentFollowCount((prev) => prev + 1);
    setCurrentUserFollowed((prev) => !prev);
    await toggleFollowUser(targetUserId);
  };

  const navigateToChat = () => {
    if (chatStatus?.haveChat) navigate(`/chat/${chatStatus.chatId}`);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[calc(100vh-70px)]">
        <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
      </div>
    );
  if (!profile) return <div className="p-4 text-center">User not found.</div>;

  return (
    <div className="pr-1 md:px-2 py-6 md:w-full max-w-5xl mx-auto h-[calc(100vh-70px)] overflow-auto scrollbar-hide relative animate-fade-in">
      {/* Header */}
      {/* <div className="flex flex-col px-1.5 sm:flex-row sm:items-start sm:gap-6">
        <img
          src={profile.avatar.url}
          alt="avatar"
          className="w-24 h-24 sm:w-36 sm:h-36 rounded-full object-cover shadow-md transition hover:scale-105 duration-300"
        />

        <div className="flex-1 mt-4 sm:mt-0">
          <div className="text-xl font-bold">@{profile.username}</div>
          <div className="text-lg font-medium">{profile.fullname}</div>
          <div className="sm:hidden text-sm mt-1 text-gray-600">{profile.bio}</div>

          <div className="flex gap-4 mt-3 text-sm text-gray-600">
            <div>
              <span className="font-semibold">{profile.postCount}</span> posts
            </div>
            <button
              onClick={() => setShowFollowerModal(true)}
              className="hover:underline"
            >
              <span className="font-semibold">{currentFollowCount}</span> followers
            </button>
            <button
              onClick={() => setShowFollowingModal(true)}
              className="hover:underline"
            >
              <span className="font-semibold">{currentFollowingCount}</span> following
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {currentUser?._id !== profile._id && (
              <button
                onClick={() => handleToggleUser(profile._id)}
                className="flex items-center gap-2 px-4 py-1 rounded bg-black text-white text-sm hover:bg-gray-900 transition"
              >
                {currentUserFollowed ? (
                  <><UserCheck className="w-4 h-4" /> Unfollow</>
                ) : (
                  <><UserPlus className="w-4 h-4" /> Follow</>
                )}
              </button>
            )}
            {currentUser?._id !== profile._id && (
              chatStatus?.haveChat ? (
                <button
                  onClick={navigateToChat}
                  className="flex items-center gap-2 px-4 py-1 rounded border text-sm hover:bg-gray-100 transition"
                >
                  <MessageCircle className="w-4 h-4" /> Chat
                </button>
              ) : (
                <button
                  onClick={() => setShowChatInvitationModal(true)}
                  className="flex items-center gap-2 px-4 py-1 rounded border text-sm hover:bg-gray-100 transition"
                >
                  <MessageCircle className="w-4 h-4" /> Chat Invitation
                </button>
              )
            )}
          </div>
        </div> */}

        {/* Desktop bio */}
        {/* <div className="hidden sm:block sm:w-1/3 text-sm text-gray-600 mt-2">
          {profile.bio}
        </div>
      </div> */}
      <motion.div
  className="flex flex-col px-3 sm:flex-row sm:items-start sm:gap-6 mb-6"
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, type: "spring" }}
>
  {/* Avatar */}
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-lg ring-4 ring-white"
  >
    <img
      src={profile.avatar.url}
      alt="avatar"
      className="object-cover w-full h-full"
    />
  </motion.div>

  {/* User Info */}
  <motion.div
    className="flex-1 mt-4 sm:mt-0 space-y-2"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.2, type: "spring" }}
  >
    <h2 className="text-2xl font-extrabold tracking-tight text-zinc-800">@{profile.username}</h2>
    <h3 className="text-lg font-medium text-zinc-600">{profile.fullname}</h3>

    {/* Bio (mobile) */}
    <p className="sm:hidden text-sm text-gray-600 mt-1">{profile.bio}</p>

    {/* Stats */}
      {/* <button
        onClick={() => setShowFollowerModal(true)}
        className="hover:underline"
      >
        <strong>{currentFollowCount}</strong> followers
      </button>
      <button
        onClick={() => setShowFollowingModal(true)}
        className="hover:underline"
      >
        <strong>{currentFollowingCount}</strong> following
      </button> */}
      {/* <div className="flex gap-3 mt-4 flex-wrap"> */}
    <div className="flex gap-4 text-sm text-gray-700 mt-3 font-medium">
      {/* <span><strong>{profile.postCount}</strong> posts</span> */}
      {/* <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.97 }}
    className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm text-gray-700 shadow-sm hover:bg-gray-200 transition"
  >
    <span>{profile.postCount}posts</span></motion.button> */}
    <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.97 }}
  className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm text-gray-700 shadow-sm hover:bg-gray-200 transition"
  >
  <ImageIcon className="w-4 h-4" />
  <span className="font-semibold">{profile.postCount}</span>
  <span className="text-gray-600">posts</span>
</motion.button>

  {/* Followers */}
  <motion.button
    onClick={() => setShowFollowerModal(true)}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.97 }}
    className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm text-gray-700 shadow-sm hover:bg-gray-200 transition"
  >
    <User className="w-4 h-4" />
    <span className="font-semibold">{currentFollowCount}</span> followers
  </motion.button>

  {/* Following */}
  <motion.button
    onClick={() => setShowFollowingModal(true)}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.97 }}
    className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm text-gray-700 shadow-sm hover:bg-gray-200 transition"
  >
    <UserPlus2 className="w-4 h-4" />
    <span className="font-semibold">{currentFollowingCount}</span> following
  </motion.button>

    </div>
{/* </div> */}

    {/* Buttons */}
    {currentUser?._id !== profile._id && (
      <div className="flex flex-wrap gap-3 pt-3">
        <motion.button
          onClick={() => handleToggleUser(profile._id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition shadow-md ${
            currentUserFollowed
              ? "bg-gray-200 text-black hover:bg-gray-300"
              : "bg-black text-white hover:bg-gray-900"
          }`}
        >
          {currentUserFollowed ? <UserCheck size={16} /> : <UserPlus size={16} />}
          {currentUserFollowed ? "Unfollow" : "Follow"}
        </motion.button>

        {chatStatus?.haveChat ? (
          <motion.button
            onClick={navigateToChat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg border text-sm font-medium hover:bg-gray-100 transition"
          >
            <MessageCircle size={16} /> Chat
          </motion.button>
        ) : (
          <motion.button
            onClick={() => setShowChatInvitationModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg border text-sm font-medium hover:bg-gray-100 transition"
          >
            <MessageCircle size={16} /> Chat Invitation
          </motion.button>
        )}
      </div>
    )}
  </motion.div>

  {/* Desktop Bio */}
  <motion.div
    className="hidden sm:block sm:w-1/3 text-sm text-gray-600 mt-2 leading-relaxed"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.2 }}
  >
    {profile.bio}
  </motion.div>
</motion.div>


      <hr className="my-6 border-gray-300" />

      {/* Posts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 sm:grid-cols-2 gap-2 animate-fade-in-up">
        {posts && posts.map((post) => <PostCard key={post._id} post={post} />)}
      </div>

      {/* Modals */}
      {showFollowerModal && (
        <FollowerModal
          userId={profile._id}
          onClose={() => setShowFollowerModal(false)}
        />
      )}
      {showFollowingModal && (
        <FollowingModal
          userId={profile._id}
          onClose={() => setShowFollowingModal(false)}
        />
      )}
      {showChatInvitationModal && (
        <ChatInvitationModal
          targetUserId={profile._id}
          onClose={() => setShowChatInvitationModal(false)}
        />
      )}
    </div>
  );
}
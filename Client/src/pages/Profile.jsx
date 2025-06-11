import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { getUserProfile } from "../api/user.api";
import { getPostsOfUser } from "../api/server1.api";
import { findChat } from "../api/server2.api";
import PostCard from "../components/container/PostCard";

const Profile = () => {
  const { username } = useParams();
  const { currentUser } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState(null);
  const [chatStatus, setChatStatus] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userRes = await getUserProfile(username);
        setProfile(userRes.data.data);
        const targetUserId = userRes?.data?.data?._id;
        const [chatRes, postRes] = await Promise.all([
          findChat(targetUserId),
          getPostsOfUser(targetUserId),
        ]);
        setChatStatus(chatRes.data.data);
        setPosts(postRes.data.data.posts);
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!profile) return <div className="p-4 text-center">User not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6">
        <img
          src={profile.avatar.url}
          alt="avatar"
          className="w-24 h-24 sm:w-36 sm:h-36 rounded-full object-cover"
        />

        <div className="flex-1 mt-4 sm:mt-0">
          <div className="text-xl font-bold">@{profile.username}</div>
          <div className="text-lg font-medium">{profile.fullname}</div>

          <div className="sm:hidden text-sm mt-1">
            {profile.bio} Lorem ipsum dolor sit amet, consectetur adipisicing
            elit. Cumque voluptatibus laudantium eos impedit ipsum obcaecati
            debitis, nisi incidunt aperiam temporibus velit expedita dicta.
            Pariatur ab ut voluptatibus asperiores, soluta expedita!
          </div>
          {/* <div className="text-sm mt-1">{profile.bio} Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde aperiam odit tenetur odio nam vero itaque pariatur quibusdam voluptatibus hic inventore aspernatur nostrum laborum doloremque consequuntur expedita, maxime quos natus.</div> */}

          <div className="flex gap-4 mt-3 text-sm text-gray-600">
            <div>
              <span className="font-semibold">{profile.postCount}</span> posts
            </div>
            <div>
              <span className="font-semibold">{profile.followerCount}</span>{" "}
              followers
            </div>
            <div>
              <span className="font-semibold">{profile.followingCount}</span>{" "}
              following
            </div>
          </div>

          <div className="flex gap-2 mt-4">

            { currentUser?._id !== profile._id && <button className="px-4 py-1 rounded bg-black text-white text-sm">
              {profile.isUserFollowing ? "Unfollow" : "Follow"}
            </button>}

            {/* {chatStatus?.haveChat ? (
              <button className="px-4 py-1 rounded border text-sm">Chat</button>
            ) : (
              <button className="px-4 py-1 rounded border text-sm">Send Invitation</button>
            )} */}
            {currentUser?._id !== profile._id &&
              (chatStatus?.haveChat ? (
                <button className="px-4 py-1 rounded border text-sm">
                  Chat
                </button>
              ) : (
                <button className="px-4 py-1 rounded border text-sm">
                  Send Invitation
                </button>
              ))}
          </div>
        </div>

        {/* Desktop bio */}
        <div className="hidden sm:block sm:w-1/3 text-sm text-gray-600 mt-2">
          {profile.bio} Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Amet similique atque pariatur perspiciatis, maxime culpa placeat cum
          dolorum in dignissimos excepturi sequi consequuntur, tempore
          necessitatibus, ipsum minima nemo sint porro.
        </div>
      </div>

      {/* Divider */}
      <hr className="my-6 border-gray-300" />

      {/* Posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {posts && posts.map((post) => <PostCard key={post._id} post={post} />)}
      </div>
    </div>
  );
};

export default Profile;

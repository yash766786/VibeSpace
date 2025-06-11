🧾 Naming Convention Cheat Sheet
🔐 Authentication / Logged-in User
Purpose	Name	Notes
Logged-in user ID	userId	Always use this for current user (from token/session)

👤 User-to-User Interaction
Purpose	Name	Use Case Example
The user being followed	targetUserId	POST /follow/:targetUserId
The user being unfollowed	targetUserId	DELETE /unfollow/:targetUserId
Viewing someone's profile	profileUserId	GET /profile/:profileUserId
Friend/following/follower	otherUserId	For generic user-to-user action

💬 Chat & Messaging
Purpose	Name	Example
Message receiver	receiverId	POST /chat/send/:receiverId
Chat partner (friend)	friendId	DELETE /chat/remove/:friendId
Chat room ID	chatId	GET /chat/:chatId/messages

📷 Post, Comment, Like
Purpose	Name	Notes
Post identifier	postId	All post-related actions
Comment identifier	commentId	Nested under post or as separate route
Like identifier	likeId	If needed for DELETE or lookup

🔔 Notifications
Purpose	Name	Example
Notification ID	notificationId	DELETE /notifications/:notificationId
User being notified	targetUserId	If notification is triggered by action

✅ Summary Rules
Use userId only for the logged-in user

Use contextual names (targetUserId, receiverId, friendId) for others

Be specific: postId, commentId, chatId, etc.

Don’t reuse userId for multiple people in the same function — that gets confusing fast

<!-- registration -->
// 1. get user detail
    // 2. check all fields -> username, email, fullname, password
    // 3. check for images -> avatar
    // 4. check existedUserByEmail
    //     # if verifed-> return email already exist
    //     # if not verified -> delete object existeduserbyemail for making new object for this user
    //                        also destroy the avatar from cloudinary
    // 5. check existedUserByUsername
    //     # if verifed-> return username already exist
    //     # if not verified -> delete object existedUserByUsername for making new object for this user
    //                        also destroy the avatar from cloudinary
    // 6. upload avatar on cloudinary for new user
    // 7. generate random code of 6 length
    // 8. create user object - create entry in db
    // 9. check for user creation successfully or not and remove password field
    // 10. Generate access token
    // 11. Send email with verification code (we will verify email through otp)
    // 12. set cookies
    // 13. send response 
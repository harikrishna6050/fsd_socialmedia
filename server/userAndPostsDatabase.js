/**
 * @description "Import MYSQL2 library for Database"
 */
const _MYSQL = require('mysql2');

/**
 * @description "Create MYSQL Connection"
 */
const _MYSQL_CONNECTION = _MYSQL.createPool({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "instrutel_iot",
    database: "social_media"
}).promise();

/**
 * @description "Get all users data from Database"
 * @returns "All users form DB"
 */
async function getUsers() {
    const _GET_USER_QUERY = "SELECT *from users;";
    const[output] = await _MYSQL_CONNECTION.query(_GET_USER_QUERY);
    return output;
}

/**
 * @description "Get Particular User Data from Database"
 * @param {*} _userId "Selected User Id"
 * @returns "Selected User Data"
 */
async function getParticularUser(_userId) {
    const _GET_PARTICULAR_USER_QUERY = `SELECT *from users where idUsers = ?`;
    const _USER_ID = [_userId];

    const[output] = await _MYSQL_CONNECTION.query(_GET_PARTICULAR_USER_QUERY, _USER_ID);
    return output;
}

/**
 * @description "Create new user"
 * @param {*} userName 
 * @param {*} profile 
 * @param {*} headline 
 * @param {*} password 
 * @returns "New User Response from database"
 */
async function addUser(userName, profile, headline, password) {
    const _ADD_USER_QUERY = `INSERT INTO users(name, profile, headline, password) VALUES(?, ?, ?, ?)`;
    const _NEW_USER_DATA = [userName, profile, headline, password];
    // console.log("DB", _NEW_USER_DATA);

    const[output] = await _MYSQL_CONNECTION.query(_ADD_USER_QUERY, _NEW_USER_DATA);
    return output;
}

/**
 * @description "Update Particular user data"
 * @param {*} userId 
 * @param {*} userName 
 * @param {*} profile 
 * @param {*} headline 
 * @returns "Update user data response from Database"
 */
async function updateUser(_userId, _userName, _profile, _headline) {
    const _UPDATE_USER_QUERY = `UPDATE users SET name = ?, profile = ?, headline = ? WHERE idUsers = ?`;
    const _UPDATE_USER_DATA = [_userName, _profile, _headline, _userId];

    // console.log(_UPDATE_USER_QUERY, _UPDATE_USER_DATA);
    const[output] = await _MYSQL_CONNECTION.query(_UPDATE_USER_QUERY, _UPDATE_USER_DATA);
    return output;
}

/**
 * @description "Update User Credentials"
 * @param {*} _userId 
 * @param {*} _pwd 
 * @returns 
 */
async function updateUserPwd(_userId, _pwd) {
    const _UPDATE_USER_PWD_QUERY = `UPDATE users SET password = ? WHERE idUsers = ?`;
    const _UPDTE_USER_PWD_DATA = [_pwd, _userId];

    const[output] = await _MYSQL_CONNECTION.query(_UPDATE_USER_PWD_QUERY, _UPDTE_USER_PWD_DATA);
    return output;
}

/**
 * @description "Delete particular user data"
 * @param {*} _userId 
 * @returns "Deleted user response form Database"
 */
async function deleteUser(_userId){
    const _DELETE_USER_QUERY = `DELETE from users WHERE idUsers = ?`;
    const _DELETE_USER_ID = [_userId];

    const[output] = await _MYSQL_CONNECTION.query(_DELETE_USER_QUERY, _DELETE_USER_ID);
    return output;
}

/**
 * 
 * @returns "All Users POSTS"
 */
async function getAllUsersPosts() {
    const _GET_ALL_USERS_POSTS_QUERY = `SELECT *from posts;`;

    const[output] = await _MYSQL_CONNECTION.query(_GET_ALL_USERS_POSTS_QUERY);
    return output;
}

/**
 * @description "Get User Wise Posts"
 * @param {*} _userId 
 * @returns "user wise posts from db"
 */
async function getUserWisePosts(_userId) {
    const _GET_USER_WISE_POSTS_QUERY = `SELECT *from posts WHERE user_idUsers = ?`;
    const _GET_PARTICULAR_USER_DATA = [_userId];

    const[output] = await _MYSQL_CONNECTION.query(_GET_USER_WISE_POSTS_QUERY, _GET_PARTICULAR_USER_DATA);
    return output;
}

/**
 * @description "Add User Post into Database"
 * @param {*} _userId 
 * @param {*} _content 
 * @returns "User Post added response from DB"
 */
async function addUserPosts(_userId, _content) {
    const _ADD_USER_POST_QUERY = `INSERT INTO posts(user_idUsers, content, likes, shares) VALUES (?, ?, ?, ?)`;
    const _ADD_USER_POST_DATA = [_userId, _content, 0, 0];

    const[output] = await _MYSQL_CONNECTION.query(_ADD_USER_POST_QUERY, _ADD_USER_POST_DATA);
    return output;
}

/**
 * @description "Update User Posts Likes Count"
 * @param {*} _postId 
 * @param {*} _likeCount 
 * @returns "DB response"
 */
async function updateUserPostLikes(_postId) {
    const [_SEL_POST_DATA] = await _MYSQL_CONNECTION.query(`SELECT *from posts WHERE idPosts = ${_postId}`);
    // console.log(_SEL_POST_DATA);
    let _selUserPostLikesCount = _SEL_POST_DATA[0].likes;
    let _likeCount = _selUserPostLikesCount + 1;

    const _UPDATE_USER_POST_LIKES_QUERY = `UPDATE posts SET likes = ? WHERE idPosts = ?`;
    const _UPDATE_USER_POST_LIKES_DATA = [_likeCount, _postId];

    const[output] = await _MYSQL_CONNECTION.query(_UPDATE_USER_POST_LIKES_QUERY, _UPDATE_USER_POST_LIKES_DATA);
    return output;
}

/**
 * @description "Update User Shares Count"
 * @param {*} _postId 
 * @param {*} _shareCount 
 * @returns "DB response"
 */
async function updateUserPostShares(_postId) {
    const [_SEL_POST_DATA] = await _MYSQL_CONNECTION.query(`SELECT *from posts WHERE idPosts = ${_postId}`);
    let _selUserPostSharesCount = _SEL_POST_DATA[0].shares;
    let _shareCount = _selUserPostSharesCount + 1;

    const _UPDATE_USER_POST_SHARES_QUERY = `UPDATE posts SET shares = ? WHERE idPosts = ?`;
    const _UPDATE_USER_POST_SHARES_DATA = [_shareCount, _postId];

    const[output] = await _MYSQL_CONNECTION.query(_UPDATE_USER_POST_SHARES_QUERY, _UPDATE_USER_POST_SHARES_DATA);
    return output;
}

/**
 * @description "Delete particular user post"
 * @param {*} _postId 
 * @returns "Deleted user POST from Database"
 */
async function deleteUserPost(_postId){
    const _DELETE_USER_POST_QUERY = `DELETE from posts WHERE idPosts = ?`;
    const _DELETE_USER_POST_ID = [_postId];

    const[output] = await _MYSQL_CONNECTION.query(_DELETE_USER_POST_QUERY, _DELETE_USER_POST_ID);
    return output;
}

module.exports = {getUsers, getParticularUser, addUser, updateUser, deleteUser, updateUserPwd, getAllUsersPosts, getUserWisePosts, addUserPosts, updateUserPostLikes, updateUserPostShares, deleteUserPost};
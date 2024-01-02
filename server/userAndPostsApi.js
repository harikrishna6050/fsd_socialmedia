/**
 * @description "Import Express Module for API's"
 */
const _EXPRESS = require('express');
const _USER_EXPRESS_API = _EXPRESS();

const _JWT = require('jsonwebtoken');
const hbs = require('hbs');
const _COOKIE_PARSER = require('cookie-parser');
const _BODY_PARSER = require('body-parser');

_USER_EXPRESS_API.set('view engine', 'hbs');
_USER_EXPRESS_API.use(_EXPRESS.json());
_USER_EXPRESS_API.use(_BODY_PARSER.json());
_USER_EXPRESS_API.use(_BODY_PARSER.urlencoded({
    extended: true
}));

_USER_EXPRESS_API.use(_COOKIE_PARSER());



/**
 * @description "Import Database related function form source"
 */
const { getUsers, getParticularUser, addUser, updateUser, deleteUser, updateUserPwd, getAllUsersPosts, getUserWisePosts, addUserPosts, updateUserPostLikes, updateUserPostShares, deleteUserPost } = require('./userAndPostsDatabase');

_USER_EXPRESS_API.get("/", (req,res) => {
    res.render("login");
});


_USER_EXPRESS_API.post('/login', async(req, res) => {
    const _USER_NAME = req.body.userName;
    const _USER_PWD = req.body.userPwd;
    // console.log(_USER_NAME, _USER_PWD);
    const _GET_ALL_USERS = await getUsers();

    let _userCount = 0;

    for(let i = 0; _GET_ALL_USERS.length > i; i++) {
        if(_USER_NAME === _GET_ALL_USERS[i].name) {
            _userCount++;
            if(_USER_PWD === _GET_ALL_USERS[i].password) {
                // res.send("ok");

                const _PAYLOAD = {"idUsers": _GET_ALL_USERS[i].idUsers, "name": _GET_ALL_USERS[i].name, "profile": _GET_ALL_USERS[i].profile, "headline": _GET_ALL_USERS[i].headline};

                const _SECRET_KEY = "abcdefghijklmnopqrstuvwxyz0123456789";

                const _TOKEN = _JWT.sign(_PAYLOAD, _SECRET_KEY);

                res.cookie("token", _TOKEN);
                res.cookie("loggedUserId", _GET_ALL_USERS[i].idUsers);
                res.redirect(`/posts/${_GET_ALL_USERS[i].idUsers}`);

            }
            else {
                res.send("Invalid Credentials");
            }
        }
    }

    if(_userCount <= 0) {
        res.send("Invalid Credentials_");
    }
});

_USER_EXPRESS_API.get("/posts/:_userId", verifyLogin, async (req, res) => {
    const _USER_ID = req.params._userId;
    const output = await getUserWisePosts(_USER_ID);
    // console.log(req.payload, output);

    res.render("posts", {
        data: output,
        userInfo: req.payload
    })
})

function verifyLogin(req, res, next) {
    const _SECRET_KEY = "abcdefghijklmnopqrstuvwxyz0123456789";
    const _TOKEN = req.cookies.token
    _JWT.verify(_TOKEN, _SECRET_KEY, (err, payload) => {
        if (err) return res.sendStatus(403)
        req.payload = payload
    })
    next()
}

/**
 * @description "Get all users"
 */
_USER_EXPRESS_API.get('/users', async(req, res) => {
    const _ALL_USERS = await getUsers();
    res.send(_ALL_USERS);
});

/**
 * @description "Get Specific User Data"
 */
_USER_EXPRESS_API.get('/users/:_userId', async(req, res) => {
    const _USER_ID = req.params._userId;
    const _USER_DATA = await getParticularUser(_USER_ID);
    res.send(_USER_DATA);
});

/**
 * @description "Add New User Data"
 */
_USER_EXPRESS_API.post('/newUser', async(req, res) => {
    const { name, profile, headline, password } = req.body;
    // console.log(req.body);
    const _NEW_USER_DB_RES = await addUser(name, profile, headline, password);
    res.redirect("/");
    // res.render("login");
    // res.send(_NEW_USER_DB_RES);
});

/**
 * @description "Upadet Selected User data"
 */
_USER_EXPRESS_API.put('/updateUser', async(req, res) => {
    const { idUsers, name, profile, headline } = req.body;
    // console.log(req.body);

    const _UPADTE_USER_DB_RES = await updateUser(idUsers, name, profile, headline);
    res.send(_UPADTE_USER_DB_RES);
});

/**
 * @description "Update user password"
 */
_USER_EXPRESS_API.put('/changePassword', async(req, res) => {
    const { idUsers, password } = req.body;

    // console.log(req.body);

    const _UPDATE_USER_PWD_DB_RES = await updateUserPwd(idUsers, password);
    res.send(_UPDATE_USER_PWD_DB_RES);
});

/**
 * @description "Deleted User"
 */
_USER_EXPRESS_API.delete('/deleteUser/:_userId', async(req, res) => {
    const _DELETE_USER_ID = req.params._userId;
    const _DELETED_USER_DB_RES = await deleteUser(_DELETE_USER_ID);

    res.send(_DELETED_USER_DB_RES);
});

/**
 * @description "All Users POSTS"
 */
_USER_EXPRESS_API.get('/usersPosts', async(req, res) => {
    const _ALL_USERS_POSTS_DATA = await getAllUsersPosts();
    res.send(_ALL_USERS_POSTS_DATA);
});

/**
 * @description "User wise POSTS"
 */
_USER_EXPRESS_API.get('/userWisePosts/:_userId', async(req, res) => {
    const _USER_ID = req.params._userId;
    const _USER_WISE_POSTS_DATA = await getUserWisePosts(_USER_ID);
    res.send(_USER_WISE_POSTS_DATA);
});

/**
 * @description "Add User New Post"
 */
_USER_EXPRESS_API.post('/addUserPost', async(req, res) => {
    const { idUsers, content } = req.body;
    // console.log(req.body);
    const _ADD_USER_POST_DB_RES = await addUserPosts(idUsers, content);
    // res.send(_ADD_USER_POST_DB_RES);

    res.redirect(`/posts/${idUsers}`);
});

/**
 * @description "Update User Posts Likes Count"
 */
_USER_EXPRESS_API.post('/updateUserPostLikes', async(req, res) => {
    const { idPosts } = req.body;
    // console.log(req.body);
    const _UPDATE_USER_POST_LIKES_DB_RES = await updateUserPostLikes(idPosts);
    // res.send(_UPDATE_USER_POST_LIKES_DB_RES);
    let _userId = req.cookies.loggedUserId;
    res.redirect(`/posts/${_userId}`);
});

/**
 * @description "Update User Posts Shares Count"
 */
_USER_EXPRESS_API.post('/updateUserPostShares', async(req, res) => {
    const { idPosts} = req.body;
    const _UPDATE_USER_POST_SHARES_DB_RES = await updateUserPostShares(idPosts);
    // res.send(_UPDATE_USER_POST_SHARES_DB_RES);
    let _userId = req.cookies.loggedUserId;
    res.redirect(`/posts/${_userId}`);
});

/**
 * @description "Delete User Post"
 */
_USER_EXPRESS_API.post('/deleteUserPost', async(req, res) => {
    const { idPosts} = req.body;
    const _DELETE_USER_POST_DB_RES = await deleteUserPost(idPosts);
    // res.send(_UPDATE_USER_POST_SHARES_DB_RES);
    let _userId = req.cookies.loggedUserId;
    res.redirect(`/posts/${_userId}`);
});

/**
 * @description "Logg-off user"
 */
_USER_EXPRESS_API.post('/loggoffuser', async(req, res) => {
    res.redirect("/");
});

/**
 * @description "User Sign UP"
 */
_USER_EXPRESS_API.post('/user-signup', async(req, res) => {
    res.render("registration");
});

/**
 * @description "Server Connection Establish"
 */
_USER_EXPRESS_API.listen(3900, () => {
    console.log("Social Media Server is Running.....");
});
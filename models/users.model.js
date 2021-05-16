const User = require('./schemas/user.schema');
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const configs = require('../configs/configs');

const register = async (username, email, password) => {

    let hashedPass = bcryptjs.hashSync(password, 10);

    let newUser = new User({
        username,
        email,
        password: hashedPass
    });

    const savedUser = await newUser.save();
    let token = jsonwebtoken.sign({id: savedUser._id}, configs.SECRET, {expiresIn: '24h'})
    if (savedUser !== null) {
        savedUser.token = token;
    }

    return savedUser;
}

const login = async (email, password) => {
    let userByEmail = await User.findOne({email: email});

    if (userByEmail) {
        let result = bcryptjs.compareSync(password, userByEmail.password);
        if (result) {
            userByEmail.token = jsonwebtoken.sign({id: userByEmail._id}, configs.SECRET, {expiresIn: '24h'});
            return userByEmail;
        } else {
            return false;
        }
    }
}


const getToken = async (username) => {
    let userByUsername = await User.findOne({username: username});
    if (userByUsername) {
        userByUsername.token = jsonwebtoken.sign({id: userByUsername._id}, configs.SECRET, {expiresIn: '24h'});
        return userByUsername;
    }
}

const getAll = async () => {
    const users = await User.find();
    return users;
}

const getById = async (id) => {
    const user = await User.findById(id);
    return user;
}

const getByUsername = async (username, myUsername) => {
    let usersByName = await User.find({username: {$regex: username, $options: 'i', $ne: myUsername}});
    return usersByName;
}

const findByUsername = async (myUsername) => {
    let userByName = await User.find({username: myUsername});
    return userByName[0];
}

const updateById = async (user) => {
    let hashedPass = bcryptjs.hashSync(user.password, 10);
    const updatedUser = await User.updateOne(
        {_id: user.id},
        {
            $set: {
                name: user.name,
                password: hashedPass
            }
        }
    );

    let updatedPostAuthor = await postsDb.updatePostAuthor(user);

    return {
        updatedUser,
        updatedPostAuthor
    };
}

const addFriend = async (me, friend) => {
    const userToAddFriend = await findByUsername(friend);
    const addingUser = await findByUsername(me);
    userToAddFriend.friends.push(addingUser);
    await userToAddFriend.save();
}

const deleteById = async (req) => {
    const user = await User.findById(req.params.id);
    let result = {};
    if (user && user._id == req.user.id) {
        let removedUser = await User.deleteOne({_id: req.params.id});
        if (removedUser.deletedCount > 0) {
            try {
                fs.unlinkSync(`src/${user.avatar}`);
            } catch (err) {
                console.error(err)
            }
            result.isDeleted = true;
            return result;
        }
    }
    if (user) {
        result.isOtherUser = true;
        return result;
    } else {
        result.isUserNotExisting = true;
        return result;
    }
}

const getUserByEmail = async (email) => {
    const user = await User.findOne({email: email});
    return user;
}


module.exports = {
    register,
    login,
    getAll,
    getById,
    getByUsername,
    findByUsername,
    updateById,
    addFriend,
    deleteById,
    getUserByEmail,
    getToken,
}
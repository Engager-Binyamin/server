const { update } = require("../DL/controllers/campaign.controller");
const userController = require("../DL/controllers/user.controller");
const scheduleService = require("./schedule.service");
const axios = require('axios')
const jwt = require('jsonwebtoken')
const secret = process.env.SECRET
const createToken = (payload) => jwt.sign(payload, secret, { expiresIn: '2h' })
const createPasswordToken = (payload) => jwt.sign(payload, secret, { expiresIn: '15m' })
const decodeToken = (token) => jwt.verify(token, secret)
const bcrypt = require('bcrypt');
const { endOfTrialPeriod } = require("./plans.service");
const saltRounds = 10;

// get all users
async function getUsers() {
    let users = await userController.read()
    if (!users) {
        throw { code: 408, msg: 'something went wrong' }
    }
    return users
}



async function getUsersDataForTable() {
    const users = await userController.readAllWithPopulate({}, '', 'subscription');
    if (!users) throw { code: 404, msg: 'something went wrong' }

    const usersArr = users.map((user) => {
        const subscription = user.subscription


        const newUser = {
            avatar: user.avatar,
            name: user.name,
            email: user.email,
            phone: user.phone,
            joinDate: user.createdDate,
            campaign: user.campaigns.length,
            subscription: subscription ? subscription.name : "לא נמצאה תוכנית",
            isOnline: user.isActive
        }
        return newUser
    })

    const heads = [
        { title: "avatar", input: "" },
        { title: "name", input: "text" },
        { title: "email", input: "text" },
        { title: "phone", input: "text" },
        { title: "joinDate", input: "date" },
        { title: "campaign", input: "text" },
        { title: "subscription", input: "text" },
        { title: "isOnline", input: "text" },
        { title: "connectedToWhatsApp", input: "" }
    ]

    return { users: usersArr, heads }
}





// get one user:
async function getOneUser(phone, select) {
    console.log("im in get one user");
    let user = await userController.readOne({ phone: phone }, select)
    console.log(user);
    if (!user) {
        throw { code: 408, msg: 'The phone is not exist' }
    }
    return user
}



async function getOneUserByEmail(email, select) {
    try {
        let user = await userController.readOne({ email: email }, select)
        return user
    } catch (error) {
        throw { code: 401, msg: 'somthing went wrong' }
    }
}


async function getGoogleOAuthTokens({ code, redirect_uri }) {
    try {
        const url = "https://oauth2.googleapis.com/token";
        const values = {
            code,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri,
            grant_type: "authorization_code",

        }
        const res = await axios.post(
            url,
            values,
            {
                headers: {
                    "Content-Type": " application/x-www-form-urlencoded"
                }
            }
        )
        return res.data
    } catch (error) {
        console.log(error.response.data.error, "Failed to fetch Google Oauth Tokens");
        throw new Error(error.message);
    }
}


async function getGoogleUser({
    id_token,
    access_token
}) {
    try {
        const res = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
            {
                headers: {
                    Authorization: `Bearer ${id_token}`,
                },
            }
        )

        // const user = await axios.get(
        //     `https://people.googleapis.com/v1/people/me?personFields=addresses,phoneNumbers`,
        //     {
        //         headers: {
        //             Authorization: `Bearer ${access_token}`,
        //         },
        //     }
        // )
        // console.log(user.data);
        return { res: res.data }
    } catch (error) {
        console.log(error, "Error fetching Google user");
        throw new Error(error.message);
    }
}


//get one user by filter Object 
async function getOneUserByFilter(filter = {}, populate) {
    let user = await userController.readOne(filter, undefined, populate)
    console.log(user);
    if (!user) {
        throw { code: 408, msg: 'The phone is not exist' }
    }
    return user
}

// delete user:
async function del(phone) {
    let user = await userController.update({ phone, isActive: true })
    if (!user) {
        throw { code: 408, msg: 'The phone is not exists' }
    }
    return user
}

// update one user:
async function updateOneUser(phone, data) {
    let user = await userController.update({ phone: phone }, data)
    if (!user) {
        throw { code: 408, msg: 'The phone is not exists' }
    }
    return user
}

// update password of one user:
async function updateOneUserPassword(phone, data) {
    var passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    let password = data.password
    if (password?.length < 8) throw { code: 408, msg: 'The password does not contain at least 8 characters' }
    if (!passwordRegex.test(password)) throw { code: 408, msg: 'The password does not contain at least 1 leter and 1 number' }
    const hash = bcrypt.hashSync(password, saltRounds);
    console.log('hash', hash);
    let user = await userController.update({ phone: phone }, { password: hash })
    if (!user) {
        throw { code: 408, msg: 'The phone is not exists' }
    }
    return user
}

async function updatePhoneUser(email, data) {
    let newData = {
        name: data.fullName,
        phone: data.phone,
        occupation: data.occupation,
        amountOfEmployees: data.amountOfEmployees
    }
    console.log("newData account service", newData);
    let user = await userController.updateOne({ email: email }, newData)
    if (!user) {
        throw { code: 408, msg: 'The email is not exists' }
    }
    return user
}


//add new user :
async function createNewUser(body) {
    var passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

    let email = body.email

    let password = body.password
    if (!email.includes("@") || !email.includes(".")) throw { code: 408, msg: 'Email is not proper' }

    if (password?.length < 8) throw { code: 408, msg: 'The password does not contain at least 8 characters' }
    if (!passwordRegex.test(password)) throw { code: 408, msg: 'The password does not contain at least 1 leter and 1 number' }

    const hash = bcrypt.hashSync(password, saltRounds);
    console.log('hash', hash);

    // האם צריך לשלוח ביצירה דיקסקרפשן של תקופת נסיון או שיש לו אופציה ישר להרשם?
    const newUser = await userController.create({ ...body, password: hash });
    let createdDate = new Date();
    const expiredDate = new Date(createdDate);
    expiredDate.setDate(expiredDate.getDate() + 14);
    // let futureDate = new Date(createdDate.getTime());
    // futureDate.setMinutes(createdDate.getMinutes() + 2);
    scheduleService.convertToDateAndExec(expiredDate, () => endOfTrialPeriod(phone));

    return newUser
}


async function createNewUserGoogle(name, email) {
    let password = await jeneratePassword()
    const hash = bcrypt.hashSync(password, saltRounds);
    console.log('hash', hash);
    let body = { name, email }
    const newUser = await userController.create({ ...body, password: hash });
    console.log("new user", newUser);
    let createdDate = new Date();
    const expiredDate = new Date(createdDate);
    expiredDate.setDate(expiredDate.getDate() + 14);
    // let futureDate = new Date(createdDate.getTime());
    // futureDate.setMinutes(createdDate.getMinutes() + 2);
    scheduleService.convertToDateAndExec(expiredDate, () => endOfTrialPeriod(phone));

    return newUser

}


async function jeneratePassword() {
    var password = '';
    var letters = 'abcdefghijklmnopqrstuvwxyz';
    var digits = '0123456789';

    for (var i = 0; i < 4; i++) {
        password += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    for (var j = 0; j < 4; j++) {
        password += digits.charAt(Math.floor(Math.random() * digits.length));
    }

    password = password.split('').sort(function () {
        return 0.5 - Math.random();
    }).join('');

    return password;
}


//Create Token using userData for links authentications(initial registeration auth, change password link)
async function createLinkToken(payload) {
    return new Promise((resolve, reject) => {

        const token = createToken(payload)
        resolve(token)
    })
}


const decodeLinkToken = (token) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {


            return { successStatus: 'Expired', msg: 'The link has expired' };
        } else {
            console.error('Token verification failed:', error.message);
            return null;
        }
    }
};




async function confirmNewUser(token) {
    try {
        //Decoding Token received from pressed Activation Link
        const decodedToken = decodeLinkToken(token)
        //Token time expired
        if (decodedToken.successStatus === 'Expired') return decodedToken

        //Payload of verified Token
        const { email, phone, id } = decodedToken

        //Checking if user is in database, could be changed to ReadOne
        const userToConfirm = await userController.read({ phone: phone, _id: id })

        //Read returns Array of user(s), there should be only 1 ([0])
        if (userToConfirm.length < 1) throw { code: 401, msg: 'User does not exist' }
        if (userToConfirm[0].isActive == true) return { successStatus: 'AlreadyActive', msg: 'User is already active', user: userToConfirm[0] }

        await updateOneUser(phone, { isActive: true })

        return { successStatus: 'Activated', msg: 'User successfully confirmed', user: userToConfirm[0] };
    } catch (err) {
        console.error(err);
        return { successStatus: 'ActivationFailed', msg: 'User could not be activated' };
    }

}


async function controlToken(token) {
    try {
        //Decoding Token received from pressed Activation Link
        const decodedToken = decodeLinkToken(token)
        //Token time expired
        if (decodedToken.successStatus === 'Expired') return decodedToken

        return { successStatus: 'ValidToken', msg: 'Token is valid' };
    } catch (err) {
        console.error(err);
        return { successStatus: 'ActivationFailed', msg: 'token not be activated' };
    }
}

async function completeUserDetails(email, data) {
    let phone = data.phone

    const phoneRegex = /^(?:0(?:[23489]|[57]\d)-\d{7})|(?:0(?:5[^7]|[2-4]|[8-9])(?:-?\d){7})$/;

    const phoneIsexists = await userController.readOne({ phone: phone });
    if (phoneIsexists) {
        throw { code: 408, msg: 'This phone already exists' };
    }
    if (!phoneRegex.test(phone)) throw { code: 408, msg: 'Phone is not proper' }

    const checkUser = await getOneUserByEmail(email)

    if (!checkUser) throw new Error("user not found")
    // const user = await updateUser(email, data);
    const user = await updatePhoneUser(email, data);
    const userWithPhone = await getOneUser(phone)
    return userWithPhone

}

module.exports = {
    createNewUser,
    getUsers,
    getOneUser,
    del,
    updateOneUser,
    getGoogleUser,
    getGoogleOAuthTokens,
    getOneUserByEmail,
    confirmNewUser,
    createLinkToken,
    getOneUserByFilter,
    controlToken,
    createPasswordToken,
    decodeToken,
    updateOneUserPassword,
    createNewUserGoogle,
    updatePhoneUser,
    createNewUserGoogle,
    completeUserDetails,
    getUsersDataForTable
}




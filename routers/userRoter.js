const express = require('express')
const router = express.Router();
const BL = require('../BL/userBL')
const authService = require('../BL/authService');
const tokenManage = new authService()
const userBL = new BL()



router.post('/signIn', async function (req, resp) {
    //user object
    const user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        user_email: req.body.user_email,
        user_password: req.body.user_password,
        user_country: req.body.user_country
    }

    try {
        //going to sign in function in BL
        let data = await userBL.signIn(user)
        return resp.status(200).json(data)
    } catch (err) {
        console.log(err);
        return resp.json(err)
    }

})



// LOGIN 
router.post('/login', async function (req, resp) {
    const password = req.body.user_password;
    const userEmail = req.body.user_email;
    try {
        let response = await userBL.logIn(userEmail, password)
        return resp.json(response)
    } catch (error) {
        return resp.json(error)
    }
})


// get all users
router.get('/', async function (req, resp) {
    const token = req.headers['x-access-token']
    let isValid = await tokenManage.auth(token)
    if (isValid.auth) {
        try {
            let myData = await userBL.getAllUsers()
            return resp.json({ data: myData, auth: true })
        } catch (error) {
            throw new Error(error)
        }


    } else return resp.json({ auth: false })
})










module.exports = router
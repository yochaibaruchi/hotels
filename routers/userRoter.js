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
        if (data === 0) {
            return resp.status(200).json(data)
        } else {
            return resp.status(201).json(data)
        }
    } catch (err) {
        console.log(err);
        return resp.json(err)
    }

})



// LOGIN 
router.post('/login', async function (req, resp) {
    console.log(req.body)
    const password = req.body.user_password;
    const userEmail = req.body.user_email;
    try {
        let response = await userBL.logIn(userEmail, password)
        return resp.status(200).json(response)
    } catch (error) {
        return resp.status(500).json(error)
    }
})


// get all users
router.get('/', async function (req, resp) {
    const token = req.headers['x-access-token']
    let isValid = await tokenManage.auth(token)
    if (isValid.auth) {
        try {
            let myData = await userBL.getAllUsers()
            return resp.status(200).json({ data: myData, auth: true })
        } catch (error) {
            throw new Error(error)
        }


    } else return resp.json({ auth: false })
})

router.get('/reservations/:id', async (req, resp) => {
    const id = req.params.id
    const token = req.headers['x-access-token']
    let isValid = await tokenManage.auth(token)
    if (isValid) {
        try {
            let data = await userBL.getUserReservetions(id)
            return resp.status(200).json(data)
        } catch (err) {
            console.log(err);
        }
    } else {
        return resp.status(200).json(false)
    }
})


router.put('/update', async (req, resp) => {
    const user = req.body
    const token = req.headers['x-access-token']
    let isValid = await tokenManage.auth(token)
    if (isValid) {
        try {
            const data = await userBL.updateUser(user)
            if (data !== 1) return resp.status(200).json("no affected rows")
            return resp.status(200).json("good")

        } catch (err) {
            console.log(err);
        }
    } else {
        return resp.status(200).json("not auth")
    }

})






module.exports = router
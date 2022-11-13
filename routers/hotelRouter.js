const express = require('express');
const router = express.Router();
const authService = require('../BL/authService');
const hotelBL = require('../BL/hotelBL')
const tokenManage = new authService()
const BL = new hotelBL();



router.get('/', async (req, resp) => {
    const token = req.headers['x-access-token']
    let isValid = await tokenManage.auth(token)
    if (isValid) {
        const startDate = req.body.start_date
        const totDate = req.body.to_date
        const capacity = req.body.room_capacity
        try {
            let myData = await BL.getHotelsByParams(startDate, totDate, capacity)
            return resp.status(200).json({ data: myData, auth: true })
        } catch (error) {
            throw error;
        }

    } else return resp.json({ auth: false })

})


router.post('/order', async (req, resp) => {
    let userId = req.body.userId
    let startDate = req.body.startDate
    let endDate = req.body.endDate
    let hotelId = req.body.hotelId
    let roomNumber = req.body.roomNumber
    const token = req.headers['x-access-token']
    let isValid = await tokenManage.auth(token)
    if (isValid) {
        let myData = await BL.createOrder(userId, startDate, endDate, hotelId, roomNumber)
        return resp.status(200).json({ data: myData, auth: true })
    } else {
        return resp.json({ auth: false })
    }

})









module.exports = router;
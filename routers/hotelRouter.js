const express = require('express');
const router = express.Router();
const authService = require('../BL/authService');
const hotelBL = require('../BL/hotelBL')
const tokenManage = new authService()
const BL = new hotelBL();


// get rooms of a particular hotel
router.get('/room', async (req, resp) => {
    const startDate = req.body.start_date
    const totDate = req.body.end_date
    const hotelId = req.body.hotelId
    try {
        let myData = await BL.getHotelRoomOptionsByParams(startDate, totDate, hotelId)
        return resp.status(200).json({ data: myData, auth: true })
    } catch (error) {
        throw error;
    }

})

// order only for loged in user 
router.post('/order', async (req, resp) => {
    let userId = req.body.userId
    let startDate = req.body.startDate
    let endDate = req.body.endDate
    let hotelId = req.body.hotelId
    let NumberOfRoom2 = req.body.NumberOfRoom2
    let NumberOfRoom3 = req.body.NumberOfRoom3
    let NumberOfRoom4 = req.body.NumberOfRoom4
    const token = req.headers['x-access-token']
    let isValid = await tokenManage.auth(token)
    if (isValid) {
        let myData = await BL.createOrder(userId, startDate, endDate, hotelId, NumberOfRoom2, NumberOfRoom3, NumberOfRoom4)
        return resp.status(200).json({ data: myData, auth: true })
    } else {
        return resp.json({ auth: false })
    }

})

// marking order as complete demand a token
router.put('/complete', async (req, resp) => {
    const order_id = req.body.order_id
    const token = req.headers['x-access-token']
    let isValid = await tokenManage.auth(token)
    if (isValid) {
        let myData = await BL.complete(order_id)
        return resp.status(200).json({ auth: true, data: myData })
    } else {
        return resp.json({ auth: false })
    }
})


// reservation for the user only if loged in 
router.get('/reservation', async (req, resp) => {
    const order_id = req.body.order_id;
    const token = req.headers['x-access-token']
    let isValid = await tokenManage.auth(token)
    if (!isValid) return resp.json({ auth: false })
    let myData = await BL.getReservation(order_id)
    return resp.status(200).json({ auth: true, data: myData })
})


// gets hotels with rooms who fit to the params
router.get('/hotel/:start_date/:end_date/:numberOfguests', async (req, resp) => {
    const start_date = req.params.start_date;
    const end_date = req.params.end_date;
    const number_of_guests = req.params.numberOfguests
    let myData = await BL.getHotelsByParams(start_date, end_date, number_of_guests)
    return resp.status(200).json({ auth: true, data: myData })
})









module.exports = router;
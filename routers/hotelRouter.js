const express = require('express');
const router = express.Router();
const authService = require('../BL/authService');
const hotelBL = require('../BL/hotelBL')
const cors = require('cors');
const tokenManage = new authService()
const BL = new hotelBL();
require('dotenv').config()

// get rooms of a particular hotel
router.get('/room/:start_date/:end_date/:hotelId', async (req, resp) => {
    const startDate = req.params.start_date
    const totDate = req.params.end_date
    const hotelId = req.params.hotelId
    try {
        const { data } = await BL.getHotelRoomOptionsByParams(startDate, totDate, hotelId)
        return resp.status(200).json({ data: data, auth: true })
    } catch (error) {
        throw error;
    }

})

// order only for loged in user 
router.post('/order', cors(), async (req, resp) => {
    let userId = req.body.userId
    let startDate = req.body.startDate
    let endDate = req.body.endDate
    let hotelId = req.body.hotelId
    let NumberOfRoom2 = req.body.NumberOfRoom2
    let NumberOfRoom3 = req.body.NumberOfRoom3
    let NumberOfRoom4 = req.body.NumberOfRoom4
    const token = req.headers['Authorization']
    let isValid = await tokenManage.auth(token)
    if (isValid) {
        let myData = await BL.createOrder(userId, startDate, endDate, hotelId, NumberOfRoom2, NumberOfRoom3, NumberOfRoom4)
        return resp.status(200).json({ data: myData[0][0].order_id, auth: true })
    } else {
        return resp.json({ auth: false })
    }

})

// marking order as complete demand a token
router.put('/complete', async (req, resp) => {
    const order_id = req.body.order_id
    const token = req.headers['Authorization']
    let isValid = await tokenManage.auth(token)
    if (isValid) {
        let myData = await BL.complete(order_id)
        return resp.status(200).json({ auth: true, data: myData })
    } else {
        return resp.json({ auth: false })
    }
})


// reservation for the user only if loged in 
router.get('/reservation/:order_id', async (req, resp) => {
    const order_id = req.params.order_id
    const token = req.headers['Authorization']
    let isValid = await tokenManage.auth(token)
    if (!isValid) return resp.json({ auth: false })
    let myData = await BL.getReservation(order_id)
    return resp.status(200).json(myData)
})


// gets hotels with rooms who fit to the params
router.get('/hotel/:start_date/:end_date/:numberOfguests', async (req, resp) => {
    const start_date = req.params.start_date;
    const end_date = req.params.end_date;
    const number_of_guests = req.params.numberOfguests
    let myData = await BL.getHotelsByParams(start_date, end_date, number_of_guests)
    return resp.status(200).json({ auth: true, data: myData })
})



router.get('/map', (req, resp) => {
    if (process.env.GOOGLE_MAP_KEY !== undefined) return resp.send(process.env.GOOGLE_MAP_KEY)
})






module.exports = router;
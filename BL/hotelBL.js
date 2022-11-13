const connect = require('../config/connection')



class hotelBL {
    // function  call Procedure for getting the right rooms from every hotel in database
    async getHotelsByParams(from_date, to_date, room_capacity) {

        try {
            const response = await new Promise((resolve, reject) => {
                const sql = `CALL hotelDB.get_room_by_param(${from_date}, ${to_date},${room_capacity})`
                connect.query(sql, (err, result) => {
                    if (err) reject(new Error(err.message))
                    if (result.length === 0) resolve({ rooms: false, message: "no room available" })
                    resolve({ room: true, data: result, message: "found rooms" })

                })
            })
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async createOrder(userId, startDate, endDate, hotelId, roomNumber) {
        try {
            const response = await new Promise((resolve, reject) => {
                const sql = `CALL hotelDB.craet_order(${userId},${startDate},${endDate},${hotelId},${roomNumber})`
                connect.query(sql, (err, result) => {
                    if (err) reject(new Error(err.message))
                    resolve(result.affectedRows)
                })
            })
            return response;
        } catch (error) {
            throw error
        }





    }






}


module.exports = hotelBL
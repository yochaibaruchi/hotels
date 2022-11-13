const connect = require('../config/connection')



class hotelBL {

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




}


module.exports = hotelBL
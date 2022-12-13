const pool = require('../config/connection')



class hotelBL {
    // function  call Procedure for getting the right rooms from every hotel in database
    async getHotelRoomOptionsByParams(from_date, to_date, hotel_id) {

        try {
            const response = await new Promise((resolve, reject) => {
                pool.getConnection((error, connect) => {
                    if (error) throw error
                    const sql = `CALL hotelDB.get_room_by_param('${from_date}', '${to_date}',${hotel_id})`
                    connect.query(sql, (err, result) => {
                        if (err) reject(new Error(err.message))
                        if (result.length === 0) resolve({ rooms: false, message: "no room available" })
                        resolve({ room: true, data: result[0], message: "rooms found" })

                    })
                    connect.release()
                })
            })
            return response;
        } catch (error) {
            console.log(error);
        }
    }


    async getHotelsByParams(start_date, end_date, number_of_guests) {
        try {
            const response = await new Promise((resolve, reject) => {
                pool.getConnection((error, connect) => {
                    if (error) throw error
                    const sql = `CALL hotelDB.get_hotel_by_param('${start_date}','${end_date}',${number_of_guests})`
                    connect.query(sql, (err, result) => {
                        if (err) reject(new Error(err.message))
                        resolve(result[0])
                    })
                    connect.release()
                })
            })
            return response;
        } catch (error) {
            console.log(error);
        }
    }




    // craeting the order and filling the room_order table as well for securing the room for thr user
    async createOrder(userId, startDate, endDate, hotelId, NumberOfRoom2, NumberOfRoom3, NumberOfRoom4) {
        try {
            const response = await new Promise((resolve, reject) => {
                pool.getConnection((error, connect) => {
                    if (error) throw error
                    const sql = `CALL hotelDB.craete_order(${userId},'${startDate}','${endDate}',${hotelId},${NumberOfRoom2} ,${NumberOfRoom3} ,${NumberOfRoom4})`
                    connect.query(sql, (err, result) => {
                        if (err) {
                            console.log(err.message);
                            reject(new Error(err.message))
                        }
                        if (result.length > 0) { resolve(result) } else { reject(new Error("result is not an empty array")) }
                    })
                    connect.release()
                })
            })
            return response;
        } catch (error) {
            throw error
        }

    }
    // update columm complete to 1 whene order completed
    async complete(orderId) {
        try {
            const response = await new Promise((resolve, reject) => {
                pool.getConnection((error, connect) => {
                    if (error) throw error
                    const sql = `UPDATE hotelDB.order SET completed = 1 WHERE order_id = ${orderId}`
                    connect.query(sql, (err, result) => {
                        if (err) reject(new Error(err.message))
                        resolve(result)
                    })
                    connect.release()
                })
            })
            return response;
        } catch (error) {
            throw error
        }
    }


    async getReservation(order_id) {
        try {
            const response = await new Promise((resolve, reject) => {
                pool.getConnection((error, connect) => {
                    if (error) throw error
                    const sql = `CALL hotelDB.show_reservation(${order_id})`
                    connect.query(sql, (err, result) => {
                        if (err) reject(new Error(err.message))
                        resolve(result)
                    })
                    connect.release()
                })
            })
            return response;
        } catch (error) {
            console.log(error);
        }
    }





}


module.exports = hotelBL
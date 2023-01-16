const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const pool = require('../config/connection')






require('dotenv').config()



class userBL {

    //generate new token
    generateAccessToken(user) {
        return jwt.sign(user, process.env.PRIVATE_KEY, { expiresIn: '1d' })
    }



    async hashnig(password) {
        const salt = await bcrypt.genSalt()
        return await bcrypt.hash(password, salt)
    }
    // more then one resulved
    //the function Gets user object passed as U 
    async signIn(u) {
        try {
            const response = await new Promise((resolve, reject) => {
                pool.getConnection((connectionError, connect) => {
                    if (connectionError) throw connectionError
                    const emailSql = `SELECT * FROM user WHERE user_email = '${u.user_email}'`
                    connect.query(emailSql, (err, result) => {
                        if (err) reject(new Error(err.message))
                        if (result.length > 0) {
                            resolve(0)
                        } else {
                            this.hashnig(u.user_password).then((hashedPassword) => {
                                const sql = `INSERT INTO user (first_name,last_name,user_email,user_password,user_country) VALUES  ('${u.first_name}','${u.last_name}','${u.user_email}','${hashedPassword}','${u.user_country}') `
                                connect.query(sql, (err, result) => {
                                    if (err) reject(new Error(err.message))
                                    //return created id
                                    resolve(result.insertId)
                                })
                            })
                        }
                    })
                    connect.release()
                })
            })
            return response;
        } catch (error) {
            throw error
        }
    }



    async logIn(user_email, user_password) {
        try {
            const response = await new Promise((resolve, reject) => {
                pool.getConnection((error, connect) => {
                    if (error) { console.log(error); } else {
                        const sql = `SELECT * FROM user WHERE user_email = '${user_email}'`
                        connect.query(sql, (err, result) => {
                            if (err) reject(new Error(err.message))
                            //check if found 
                            if (result.length > 0) {
                                bcrypt.compare(user_password, result[0].user_password).then((comparison) => {
                                    if (comparison) {
                                        let myToken = this.generateAccessToken(result[0])

                                        const returnedObj = {
                                            country: result[0].user_country,
                                            firstName: result[0].first_name,
                                            last_name: result[0].last_name,
                                            id: result[0].user_id,
                                            mail: result[0].user_email
                                        }
                                        console.log(returnedObj.country);
                                        resolve({ token: myToken, enter: true, user: returnedObj })
                                    } else {
                                        resolve({ enter: false, message: 'user name or password are not correct' })
                                    }
                                })
                            } else {
                                resolve({ enter: false, message: 'user name or password are not correct' })
                            }
                        })

                    }
                    connect.release()
                })
            })
            return response;
        } catch (error) {
            console.log(error);
        }
    }


    async getAllUsers() {
        try {
            const response = await new Promise((resolve, reject) => {
                pool.getConnection((error, connect) => {
                    if (error) throw error
                    const sql = 'SELECT * FROM user'
                    connect.query(sql, (err, result) => {
                        if (err) reject(new Error(err.message))
                        if (result[0] != null) {
                            resolve(result)
                        } else {
                            reject('no data')
                        }
                    })
                    connect.release()
                })
            })
            return response
        } catch (error) {
            throw console.log(error);
        }
    }

    //get user with id
    async getUsersById(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                pool.getConnection((error, connect) => {
                    if (error) throw error
                    const sql = `SELECT * FROM user WHERE user_id = '${id}' `
                    connect.query(sql, (err, result) => {
                        if (err) reject(new Error(err.message))
                        if (result.length > 0) {
                            resolve(result[0])
                        } else {
                            resolve(new Error("user did not found"))
                        }
                    })
                    connect.release()
                })
            })
            return response
        } catch (error) {
            throw error
        }
    }

    async getUserReservetions(userId) {
        try {
            const response = await new Promise((resolve, reject) => {
                pool.getConnection((error, connect) => {
                    if (error) throw error
                    const sql = `call hotelDB.get_user_reservations(${userId});`
                    connect.query(sql, (err, result) => {
                        if (err) reject(new Error(err.message))
                        resolve(result[0])
                    })
                    connect.release()
                })
            })
            return response
        } catch (err) { throw err }
    }


    async updateUser(user) {
        console.log(user);
        try {
            const response = await new Promise((resolve, reject) => {
                pool.getConnection((error, connect) => {
                    if (error) throw error
                    this.hashnig(user.password).then((newHashedPassword => {
                        const sql = `UPDATE hotelDB.user SET user_id='${user.userId}',first_name ='${user.firstName}', last_name = '${user.lastName}', user_email='${user.email}', user_password = '${newHashedPassword}', user_country = '${user.country}' WHERE user_id = '${user.userId}' `
                        connect.query(sql, (err, result) => {
                            if (err) reject(new Error(err.message))
                            resolve(result.affectedRows)
                        })
                    }))
                    connect.release()
                })
            })
            return response
        } catch (err) { throw err }
    }


}




module.exports = userBL 
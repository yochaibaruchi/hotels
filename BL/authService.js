const jwt = require('jsonwebtoken')
require('dotenv').config()

class authService {




    async auth(token) {
        try {
            const response = await new Promise((resolve) => {
                if (!token) resolve({ auth: false })
                jwt.verify(token, process.env.PRIVATE_KEY, (err) => {
                    if (err) resolve({ auth: false })
                    resolve({ auth: true })
                })
            })
            return response;
        } catch (error) {
            throw error
        }
    }



}


module.exports = authService
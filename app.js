const express = require('express');
const cors = require('cors');
const userRouter = require('./routers/userRoter')
const hotelRouter = require('./routers/hotelRouter')
const app = express();
let whitelist = ['http://localhost:3000', 'https://main.dpumd3a0ayks.amplifyapp.com', 'http://nodehotel-env.eba-j2swbhjm.eu-central-1.elasticbeanstalk.com']
let corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(cors(corsOptions))
app.use(express.json())
app.use('/api/user', userRouter)
app.use('/api/hotel', hotelRouter)


app.get('/', (req, resp) => {
    return resp.status(200).send('app is running')
})


const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`app running on port ${port} `);
})

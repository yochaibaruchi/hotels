const express = require('express');
const cors = require('cors');
const https = require('https')
const fs = require('fs')
const path = require('path')
const userRouter = require('./routers/userRoter')
const hotelRouter = require('./routers/hotelRouter')
const app = express();
app.use(cors());
app.use(express.json())

app.use('/api/user', userRouter)
app.use('/api/hotel', hotelRouter)


app.get('/', (req, resp) => {
    return resp.status(200).send('app is running')
})


const port = process.env.PORT || 8000


const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'server.crt'))
}, app)

sslServer.listen(port, () => console.log('secure server'))
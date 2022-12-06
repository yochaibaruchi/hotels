const express = require('express');
const cors = require('cors');
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
app.listen(port, () => {
    console.log(`app running on port ${port} `);
})

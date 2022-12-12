const express = require('express');
const cors = require('cors');
const userRouter = require('./routers/userRoter')
const hotelRouter = require('./routers/hotelRouter')
const app = express();
app.use(express.json())

app.use('/api/user', cors(), userRouter)
app.use('/api/hotel', cors(), hotelRouter)


app.get('/', (req, resp) => {
    return resp.status(200).send('app is running')
})


const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`app running on port ${port} `);
})

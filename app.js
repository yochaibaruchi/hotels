const express = require('express');
const cors = require('cors');
require('./config/connection')
const userRouter = require('./routers/userRoter')
const app = express();
app.use(cors());
app.use(express.json())

app.use('/api/user', userRouter)






const port = process.env.port || 5000
app.listen(port, () => {
    console.log(`app running on port ${port} `);
})

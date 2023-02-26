const express = require('express');
const cluster = require('cluster');
const { cpus } = require('os')
const num_processes = cpus().length;
const cors = require('cors');
console.log(num_processes);
if (cluster.isPrimary) {
    console.log(`primary ${process.pid} is running`)






    // Spawn workers.
    for (var i = 0; i < num_processes; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        cluster.fork();
    })



} else {


    const app = express();
    app.use(cors())
    const userRouter = require('./routers/userRoter')
    const hotelRouter = require('./routers/hotelRouter')
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
}
const express = require('express');
const cluster = require('cluster');
const { cpus } = require('os')
const num_processes = cpus().length;
const cors = require('cors');


if (cluster.isPrimary) {
    console.log(`primary ${process.pid} is running`)

    let workers = [];

    // Helper function for spawning worker at index 'i'.
    let spawn = function (i) {
        workers[i] = cluster.fork();

        // Optional: Restart worker on exit
        workers[i].on('exit', function (code, signal) {
            // console.log('respawning worker', i);
            spawn(i);
        });
    };


    // Spawn workers.
    for (var i = 0; i < num_processes; i++) {
        spawn(i);
    }

    // Helper function for getting a worker index based on IP address.
    // This is a hot path so it should be really fast. The way it works
    // is by converting the IP address to a number by removing non numeric
    // characters, then compressing it to the number of slots we have.
    //
    // Compared against "real" hashing (from the sticky-session code) and
    // "real" IP number conversion, this function is on par in terms of
    // worker index distribution only much faster.
    const worker_index = function (ip, len) {
        return farmhash.fingerprint32(ip) % len; // Farmhash is the fastest and works with IPv6, too
    };

}


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

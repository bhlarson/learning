console.log("Start Learning on " + process.platform + " with node version " + process.version);
require('dotenv').config({ path: './config.env' });
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');
var ioSocket;

var pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.dbhost,
    user: process.env.dbuser,
    //password: 'password',
    database: process.env.dbname
});

console.log("Dependancies Found");


//log4js.configure({
//    appenders: { command: { type: 'file', filename: 'state.log' } },
//    categories: { default: { appenders: ['command'], level: 'ALL' } }
//});
//const cmdLog = log4js.getLogger('command');

//var ov1Port = new ov1.OVPort();
//ov1Port.Output(function (data) {
//    console.log(data);
//    if (data.serialData && ioSocket) {
//        ioSocket.emit('data', data.serialData);
//    }
//});
//var config = { log: cmdLog, portName: process.env.serialport };
//ov1Port.Start(config, function (result) {
//    console.log(result);
//});
 
//command = { name: 'VRSN' };
//ov1Port.Input(command);

//// Home database credentials
//var pool = mysql.createPool({
//    connectionLimit: 10,
//    host: process.env.dbhost,
//    user: process.env.dbuser,
//    //  password        : 'password',
//    database: process.env.dbname
//});

//console.log("mysql.createPool exists=" + (typeof pool !== 'undefined'));

var port = Number(process.env.nodeport) || 1339;
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile('index.html')
});


http.listen(port, function () {
    console.log("Listening on port " + port);
});

io.on('connection', function (socket) {
    socket.broadcast.emit('Server Connected');
    ioSocket = socket;
    socket.on('disconnect', function () {
        console.log('Socket.IO  disconnected ' + socket.id);
    });
    socket.on('connect_failed', function () {
        console.log('socket.io connect_failed');
    })
    socket.on('reconnect_failed', function () {
        console.log('socket.io reconnect_failed');
    })
    socket.on('error', function (err) {
        console.log('socket.io error:' + err);
    })
    socket.on('Command', function (data) {
        console.log('Command ' + JSON.stringify(data));
    });
});


module.exports = app;
console.log("Learning Started");

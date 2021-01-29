const app = require('express')();
const http=require('http').Server(app);
const io = require('socket.io')(http);
app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/frame.html');
});
io.on('connection',(socket)=>{
console.log('a user is connected');
});
http.listen(3000,()=>{
    console.log('Listening on 3000');
});
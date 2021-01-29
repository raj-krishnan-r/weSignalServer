const app = require('express')();
const http=require('http').Server(app);
const PORT = process.env.PORT || 3000;
const io = require('socket.io')(http,{
  cors:{
      origin:"*",
      methods:["GET","POST"]
  }  
});

var userList=[];

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/frame.html');
});
io.on('connection',(socket)=>{
console.log('a user is connected');
socket.on('register',(msg)=>{
let user = new Object;
user.id=msg;
user.socketid=socket.id;
userList.push(user);
console.log(userList);
});
socket.on('request',(recipient)=>{
for(var i =0;i<userList.length;i++)
{
    if(userList[i].id==recipient.id)
    {
        let package = new Object();
        package.src=socket.id;
        package.offer=recipient.offer;
        io.to(userList[i].socketid).emit('offer',package);
    }
}
});
socket.on('answer',(package)=>{
        package.src=socket.id;
        package.answer=package.answer;
        io.to(package.recipient).emit('answer',package);
});
socket.on('ice-candidate',(incpackage)=>{
    for(var i =0;i<userList.length;i++)
    {
        if(userList[i].id==incpackage.recID)
        {
            let package = new Object();
            package.src=socket.id;
            package.candidate=incpackage.candidate;
            io.to(userList[i].socketid).emit('ice-candidate',package);
        }
    } 
});
});

http.listen(PORT,()=>{
    console.log('Listening on '+PORT);
});
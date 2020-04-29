var express    = require ('express');
var app        = express();
var port       = process.env.PORT || 4200;
var morgan     = require('morgan');
var mongoose   = require('mongoose'); 
var bodyParser = require('body-parser')
var router     = express.Router();
var businessRouter = express.Router();
var vehicleRouter = express.Router();
var appRoutes  = require('./app/routes/api')(router);
var path       = require('path');
var passport   = require('passport');
var social     = require('./app/passport/passport')(app, passport);
var businessRoutes = require('./app/routes/businessRoute')(businessRouter);
var vehicleRoutes = require('./app/routes/vehicleRoute')(vehicleRouter);

var http = require('http');
var socketio = require('socket.io');
var server = http.createServer(app);
var io = socketio(server);
var formatMessage = require('./app/models/message');
var {userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./app/models/chatUser');
var botName = "Classic Solutions Bot";


app.use(morgan('dev'));
app.use(bodyParser.json());// for parsing  application/json
app.use(bodyParser.urlencoded({ extended: true }));// parsing application/ x-www-form-urlencoded
app.use(express.static(path.join(__dirname + '/public')));// set static folder

//Run when client connects 
io.on('connection', socket => {

  socket.on('joinRoom', ({ username, room}) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to chatroom!'));

    //Broadcast when a user connects
    socket.broadcast.to(user.room).emit('message', formatMessage(botName, (user.username) + ' has joined the chat'));

    //Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });

  });

  

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id); 
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  //Runs when a client leaves the chat
  socket.on('disconnect', ()=> {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit('message', formatMessage(botName, (user.username) + '  has left the chat'));
        //Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
    });
    }
  
  });

});


//Routes
app.use('/api', appRoutes);
app.use('/businessRoute', businessRoutes);
app.use('/vehicleRoute', vehicleRoutes);
// DB connection
mongoose.connect('mongodb+srv://dk215:King1995!@vma-database-z52b4.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
 
app.get('*', function(req, res){
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'))
})

server.listen(port, function(){
    console.log('Server is running on port '+ port);
});
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('MongoDB connected'))
var express    = require ('express');
var app        = express();
var port       = process.env.PORT || 4200;
var morgan     = require('morgan');
var mongoose   = require('mongoose'); 
var bodyParser = require('body-parser')
var router     = express.Router();
var appRoutes  = require('./app/routes/api')(router);
var path       = require('path');


app.use(morgan('dev'));
app.use(bodyParser.json());// for parsing  application/json
app.use(bodyParser.urlencoded({ extended: true }));// parsing application/ x-www-form-urlencoded
app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);

mongoose.connect('mongodb+srv://dk215:King1995!@vma-database-z52b4.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
 
app.get('*', function(req, res){
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'))
})

app.listen(port, function(){
    console.log('Server is running on port '+ port);
});
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('MongoDB connected'))
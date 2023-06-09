const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const {logger} = require('./middleware/logEvent');
const errorHandler = require('./middleware/errorHandle');
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/verifyJWT');
const credentials = require('./middleware/credentials');
const multer = require('multer');
const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

//handle options credentials check - before CORS
// and fetch cookies credentials requirements
app.use(credentials);

// cross origin resource sharing middleware
app.use(cors(corsOptions));
// built-in middleware
app.use(express.urlencoded({extended: false}));
// built-in middleware
app.use(express.json({ limit: '50mb' }));

// cookie parser middleware
app.use(cookieParser());

// serve static files
app.use('/', express.static(path.join(__dirname, 'public')));


 // setting up multer as middleware for transcriptFile
 const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // limiting files to 5MB
    },
  });

// routes
//routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use('/internships', require('./routes/apis/internship'));


// verify JWT middleware
app.use(verifyJWT);
app.use('/users', require('./routes/apis/users'));
app.use('/users/getusers', require('./routes/apis/users'));

app.use('/coordinator', require('./routes/apis/coordinator'));
app.use('/coordinator/signature', require('./routes/apis/signature'));
app.use('/coordinator/requests', require('./routes/apis/coordinatorRequests'));
app.use('/student', require('./routes/apis/student'));
app.use('/careercenter', require('./routes/apis/careercenter'));
app.use('/careercenter/requests', require('./routes/apis/careerCenterApplication'));
app.use('/careercenter/response', upload.single('sgkFile'), require('./routes/apis/careerCenterApplication'));

app.use('/department', require('./routes/apis/department'));
app.use('/respondToLetter',  require('./routes/apis/respondToLetter'))
app.use('/letterrequest', upload.single('transcriptFile'), require('./routes/apis/letterReq'));
app.use('/application', upload.fields([
    { name: 'transcriptFile', maxCount: 1 },
    { name: 'applicationFile', maxCount: 1 },
  ]), require('./routes/apis/application'));
app.use('/applications/response', require('./routes/apis/applicationResponse'));
app.use('/applications/delete', require('./routes/apis/applicationResponse'));

app.use('/careercenter', require('./routes/apis/careercenter')); 
app.use('/applications/count', require('./routes/apis/getApplicationCount'));
app.use('/notification', require('./routes/apis/notification')); 
app.use('/forms/upload', upload.fields([
  { name: 'reportFile', maxCount: 1 },
  { name: 'applicationFile', maxCount: 1 },
]), require('./routes/apis/upload'));
app.use('/forms/retrieve', require('./routes/apis/upload'));
app.use('/api/chats', require('./routes/apis/chat'));
app.use('/api/chats/send', upload.fields([
  { name: 'attachments', maxCount: 10 }, // Adjust the maxCount value as per your requirements
]), require('./routes/apis/chat'));
app.use('/api/chats/reply', upload.fields([
  { name: 'attachments', maxCount: 10 }, // Adjust the maxCount value as per your requirements
]), require('./routes/apis/chat'));





app.get('*', (req, res) => {
    res.status(404);
    if(req.accepts('html')){
        res.send('Page not found');
    }
    else if( req.accepts('json')){
        res.json({error: 'Page not found'});
    }
    else{
        res.type('txt').send('Page not found');
    }
});

app.use(errorHandler); 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
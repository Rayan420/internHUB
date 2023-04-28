import express from 'express';
import morgam from 'morgan';
const app = express();

/*
    morgan is a middleware that logs the request to the console
*/
app.use(morgam('dev'));

app.get('/', (req, res) => {

    console.log('Hello World');
    res.status(200);
    res.json({ message: 'Hello World' });
});

export default app;
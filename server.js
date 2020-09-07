import 'dotenv';

import express, { static } from 'express';
const app = express();
const port = process.env.PORT || 5000;

app.use(static(__dirname + '/build'));

if(process.env.NODE_ENV === "production") {
    app.get('*', (req,res) => {
        res.sendFile(__dirname + '/build/index.html');
    });
}

app.listen(port, () => {
    console.log('Server is ON');
})
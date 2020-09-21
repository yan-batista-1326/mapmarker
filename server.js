const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/client/build'));


if(process.env.NODE_ENV === "production") {
    app.get('*', (req,res) => {
        res.sendFile(__dirname + '/client/build/index.html');
    });
}

app.listen(port, () => {
    console.log('Server is ON');
})
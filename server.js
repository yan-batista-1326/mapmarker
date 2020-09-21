const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/build'));


app.get('*', (req,res) => {
    //res.sendFile(__dirname + '/build/index.html');
    res.status(200).json({message: 'Server is serving'});
});

app.listen(port, () => {
    console.log('Server is ON');
})
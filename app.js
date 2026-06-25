const express = require('express');
const path = require('path');

const app = express();


app.use(express.static('public'));


app.get('/', (req, res) => {

    res.sendFile(
        path.join(__dirname, 'views', 'index.html')
    );

});



app.use((req, res) => {

    res.status(404).send("<h1>404 Sayfa Bulunamadı</h1>");

});


app.listen(3000, () => {

    console.log("Sunucu çalıştı");

});

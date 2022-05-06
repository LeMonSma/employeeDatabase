const express = require('express')
const db = require('./db/connection')

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.json('hello world')
})
db.connect(err => {
    if (err) throw err;
    console.log('data base connected.')
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    });
});
const express = require('express');
const router = express.Router();

const connection = require('../services/database');

router.post('/sign-up', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    if (username && password) {
        connection.query('SELECT * FROM accounts WHERE username=?',[username], function(error, results, fields){
            if (results.length > 0) {
                res.send("Username taken. Please enter new username.");
            } else {
                connection.query('INSERT INTO accounts SET ?', {username, password}, function(error, results, fields){
                    if (error) {
                        return res.status(500).send({errors: [{title: 'Database query error', detail: error.message}] });
                    } else {
                        res.send("Account created. Please login through the /auth endpoint.");
                    }
                });
            }
            
        });
    } else {
        res.send("Please enter a username and password.");
    }
    
})

module.exports = router;
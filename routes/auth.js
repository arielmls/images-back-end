const express = require('express');
const router = express.Router();

const connection = require('../services/database');


router.post('/auth', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
	if (username && password) {
		connection.query('SELECT account_id FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            if (error) {
                return res.status(500).send({errors: [{title: 'Database query error', detail: error.message}] });
            }
            else if (results.length > 0) {
				req.session.loggedin = true;
                req.session.username = username;
                req.session.account_id = results[0]['account_id']
				res.redirect('/images');
			} else {
				res.send('Incorrect Username and/or Password!');
			}			
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});

module.exports = router;
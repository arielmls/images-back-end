const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/check-session');
const isUserAllowed = require('../middleware/check_image_access');

const connection = require('../services/database');

router.get('/images', isLoggedIn, (req, res) => {
    connection.query(
        "SELECT images.*, accounts.username, (SELECT AVG(star_rating) FROM reviews WHERE reviews.image_id = images.image_id ) AS average_rating FROM images LEFT JOIN accounts ON images.account_id=accounts.account_id WHERE images.private='F' OR accounts.account_id=?",
        [req.session.account_id], 
        function(error, results, fields) {
            if (error) {
                return res.status(500).send({errors: [{title: 'Database query error', detail: error.message}] });
            } else {
                res.send(results);
            } 
        }
    );
    
});


router.get('/images/:image_id', isLoggedIn, isUserAllowed, (req, res) => {
    const image_id = parseInt(req.params.image_id);
    let responseJson;
    connection.query(
        "SELECT images.*, accounts.username, (SELECT AVG(star_rating) FROM reviews WHERE reviews.image_id = images.image_id ) AS average_rating FROM images LEFT JOIN accounts ON images.account_id=accounts.account_id WHERE images.image_id=1",
        [image_id],
        function(error, results1, fields){
            if (error) {
                return res.status(500).send({errors: [{title: 'Database query error', detail: error.message, source:'/image-details query 1'}] });
            } else {
                responseJson = results1[0];
                connection.query(
                    "SELECT reviews.*, accounts.username FROM reviews LEFT JOIN accounts ON reviews.account_id=accounts.account_id WHERE reviews.image_id=?",
                    [image_id],
                    function(error, results2, fields){
                        if (error) {
                            return res.status(500).send({errors: [{title: 'Database query error', detail: error.message, source:'/image-details query 2'}] });
                        } else {
                            responseJson.reviews = results2;
                            res.send(responseJson);
                        }
                    }
                );
            }
        }
    );   
})



router.get('/images/:image_id', isLoggedIn, isUserAllowed, async (req, res) => {
    const image_id = req.body.image_id;
    let responseJson = await connection.query(
        "SELECT images.*, accounts.username, (SELECT AVG(star_rating) FROM reviews WHERE reviews.image_id = images.image_id ) AS average_rating FROM images LEFT JOIN accounts ON images.account_id=accounts.account_id WHERE images.image_id=?",
        [image_id]
    )[0];
    let reviews = await connection.query(
        "SELECT reviews.*, accounts.username FROM reviews LEFT JOIN accounts ON reviews.account_id=accounts.account_id WHERE reviews.image_id=?",
        [image_id]
    );
    responseJson.reviews = reviews;
    res.send(responseJson);
});


module.exports = router;
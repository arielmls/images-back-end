const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/check-session');

const connection = require('../services/database');
const isImagePrivate = require('../middleware/check_private');

router.post('/leave-review', isLoggedIn, isImagePrivate, (req, res) => {
    const image_id = req.body.image_id;
    const account_id = req.session.account_id;
    const star_rating = req.body.star_rating;
    const review = req.body.review;
    connection.query("SELECT * FROM reviews WHERE image_id= ? AND account_id= ?",[image_id, account_id], function(error, results, fields){
        if (error) {
            return res.status(500).send({errors: [{title: 'Database query error', detail: error.message, source:'/leave-review'}] });
        } else if (results.length > 0 ) {
            connection.query('UPDATE reviews SET star_rating= ?, review= ? WHERE review_id= ?',[star_rating, review, results[0]['review_id']], function(error, results,fields){
                res.send("Your review has been edited successfully.");
            });
        } else {
            connection.query("INSERT INTO reviews SET ?", {image_id, account_id, star_rating, review}, function(error, results, fields){
                res.send("Thank you for leaving a review!");
            });
        }
    });
});

router.get('/see-reviews', isLoggedIn, isImagePrivate, (req, res) => {
    connection.query("SELECT reviews.*, accounts.username FROM reviews LEFT JOIN accounts ON reviews.account_id= accounts.account_id WHERE image_id=?", [req.body.image_id], function(error, results, fields){
        if (error) {
            return res.status(500).send({errors: [{title: 'Database query error', detail: error.message, source:"/see-reviews"}] });
        } else {
            res.send(results);
        }
    });
});

module.exports = router;
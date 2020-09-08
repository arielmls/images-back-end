const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/check-session');
const upload = require('../services/image-upload');
const connection = require('../services/database');

const singleImageUpload = upload.single('image');
const multipleImageUpload = upload.array('image');

router.post('/single-upload', isLoggedIn, (req, res) => {
    singleImageUpload(req, res, function(err) {
        if (err) {
            return res.status(422).send({errors: [{title: 'File Upload Error', detail: err.message, source:"/single-upload multer"}] });
        }
        
        let image_row = {account_id: req.session.account_id, image_path: req.file.location, private: req.body.private};
        if (req.body.title) {
            image_row.title = req.body.title;
        }
        if (req.body.description) {
            image_row.description = req.body.description;
        }
        connection.query('INSERT INTO images SET ?', image_row, function(error, results, fields) {
            if (error) {
                return res.status(500).send({errors: [{title: 'Database query error', detail: error.message, source:"/single-upload mysql"}] });
            } else {
                return res.json({'imageUrl': image_row.image_path});
            }
        });

        return res.json({'image_url': image_row.image_path});
    });
});

router.post('/bulk-upload', isLoggedIn, (req, res) => {
    multipleImageUpload(req, res, function(err){
        if (err) {
            return res.status(422).send({errors: [{title: 'File Upload Error', detail: err.message, source:"/bulk-upload multer"}] });
        }
        const files = req.files;
        let values = [];
        let image_urls = [];
        for (let i=0; i <files.length; i++){
            var f = files[i];
            values.push([f.originalname, f.location, req.session.account_id, req.body.private]);
            image_urls.push(f.location);
        }
        connection.query("INSERT INTO images(title, image_path, account_id, private) VALUES ?", [values], function(error, results, fields){
            if (error) {
                return res.status(500).send({errors: [{title: 'Database query error', detail: error.message, source:"/bulk-upload mysql"}] });
            }else {
                return res.json({image_urls});
            }
        })
    });
});


module.exports = router;
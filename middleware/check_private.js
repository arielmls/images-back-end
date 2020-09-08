const connection = require('../services/database');

function isImagePrivate(req, res, next) {
    connection.query("SELECT private FROM images WHERE image_id=?", [req.body.image_id], function(error, results, fields){
        if (error) {
            return res.status(500).send({errors: [{title: 'Database query error', detail: error.message, source: 'isImagePrivate'}] });
        } else if (results == 0 ) {
            res.send("Image not found.");
            res.end;
        } else if (results[0]['private'] == 'F'){
            return next();
        } else {
            res.send("This action cannot be taken on a private image.")
            res.end;
        }
    });
}

module.exports = isImagePrivate;
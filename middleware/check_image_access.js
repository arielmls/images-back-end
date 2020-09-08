const connection = require('../services/database');

function isUserAllowed(req, res, next) {
    let image_id;
    if (req.params.image_id) {
        image_id = req.params.image_id;
    } else {
        image_id = req.body.image_id
    }
    connection.query("SELECT private, account_id FROM images WHERE image_id=?", [image_id], function(error, results, fields){
        if (error) {
            return res.status(500).send({errors: [{title: 'Database query error', detail: error.message, source: 'isUserAllowed'}] });
        } else if (results == 0 ) {
            res.send("Image not found.");
            res.end;
        } else if (results[0]['private'] == 'F' || results[0]['account_id'] == req.session.account_id){
            return next();
        } else {
            res.send("You do not have access to this image.")
            res.end;
        }
    });
}

module.exports = isUserAllowed;
function isLoggedIn(req, res, next) {
    if (req.session.loggedin) {
        return next();
    } else {
        res.send("Go to auth endpoint to login");
        res.end();
    }
}

module.exports = isLoggedIn;
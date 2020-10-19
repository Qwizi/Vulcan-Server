module.exports = (req, res, next) => {
    if (!req.session.logged && !req.session.user) {
        res.redirect('/login')
    } else {
        next();
    }
};
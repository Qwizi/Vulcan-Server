module.exports = function (req, res, next) {
    if (!req.installed) {
        console.log('Nie zainstalowano jeszcze')
        res.redirect('/install')
    } else {
        next();
    }
}
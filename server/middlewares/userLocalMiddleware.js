const setUserLocals = (req, res, next) => {
    res.locals.username = req.session.user ? req.session.user.UserName : null 
    res.locals.auth = req.session.auth === true
    res.locals.verifiedUrl = req.session.user ? req.session.user.UserName : null
    res.locals.csrfToken === true
    next()
}

module.exports = setUserLocals
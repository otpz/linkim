
const exceptionMiddleware = (err, req, res, next) => {
    if (err.name === "ValidationError"){
        const errorMessages = err.inner.map(error => error.message)
        return res.json({errorValidation: errorMessages})    
    }
    return res.json({error: err})
}

module.exports = exceptionMiddleware
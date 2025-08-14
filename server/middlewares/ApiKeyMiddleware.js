require('dotenv').config()

let ApiKeyMiddleware = (req,res,next)  => {
    let apiKey = req.headers['apikey']
    if(apiKey === process.env.API_KEY) {
        next()
    } else {
        res.status(401).json({
            message: 'Unauthorized invalid apikey '
        })
    }
}

module.exports = ApiKeyMiddleware;
const JWT = require("jsonwebtoken")

module.exports = async (req, res, next) => {
    const token = req.headers['authorization'].split(" ")[1]
    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
        try {
            if (err) {
                return res.status(200).send({
                    message: "auth failed",
                    success: false
                })
            } else {
                req.body.userId = decode.id
                next()
            }
        } catch (error) {
            console.log(error)
            res.status(401).send({
                success: false,
                message: "auth failed"
            })
        }

    })
}


// const JWT = require("jsonwebtoken")

// module.exports = async (req, res, next) => {
//     const token = req.headers['authorization'].split(" ")[1]
//     JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
//         try {
//             if (err) {
//                 return res.status(200).send({
//                     message: "auth failed",
//                     success: false
//                 })
//             } else {
//                 req.body.userId = decode.id
//                 next()
//             }
//         } catch (error) {
//             console.log(error)
//             res.status(401).send({
//                 success: false,
//                 message: "auth failed"
//             })
//         }

//     })
// }
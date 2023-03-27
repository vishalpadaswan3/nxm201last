

const validation = (req, res, next) => {

    try {
        const { city } = req.body;
        if (!city) {
            return res.send("City is required")
        }
        
        if(typeof(city) !== string){
            return res.send("City must be string")
        }

        next()
    } catch (error) {
        res.send(error.message)
    }

}

module.exports = { validation }
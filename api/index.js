const fetch = require('node-fetch')

const key = '45236e8510745ee86684a5946eda8cda'

const root = "https://api.darksky.net/forecast"

module.exports = async function(req, res) {
    try {
        const {lon, lat} = req.query
        const url = `${root}/${key}/${lat},${lon}`
        const r = await fetch (url)
        const json = await r.json()
        res.status(200).send(json)
    } catch(e) {
        res.status(500).send(e.message)
    }
}
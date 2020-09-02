const username =  require('../config/appConfig').username;
const password = require('../config/appConfig').password;
const dbName = require('../config/appConfig').dbName

module.exports = mongoURI = `mongodb+srv://${username}:${password}@cluster0-pbluz.mongodb.net/${dbName}?retryWrites=true&w=majority`




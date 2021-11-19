var fs = require("fs");
 
module.exports = {
    cert: fs.readFileSync(__dirname + "/server.cer"),
    key: fs.readFileSync(__dirname + "/server.key"),
    passphrase: "12345"
};
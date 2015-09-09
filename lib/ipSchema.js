var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IpSchema = new Schema({
  userId: String,
  ip: String
});

module.exports = mongoose.model('Ip', IpSchema);
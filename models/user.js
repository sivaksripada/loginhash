var mongoose = require ('mongoose');
var argon2 = require ('argon2');



var userSchema = mongoose.Schema({
	
	email : String,
	password : String,
	clinicName : String,
	parseModel : String,
	officeManagerName: String,
	officeCellPhone:String
	
});

userSchema.methods.generateHash = function(password, cb) {
    	argon2.hash(password).then(hash => {
			cb(hash);	
	}).catch(err => {
		throw err;
	});
};

// checking if password is valid
userSchema.methods.validPassword = function(password,cb) {
  
  argon2.verify(this.password, password).then(match => {
  			if (match) {			
  					  cb(true);
  			} else {
    				cb(false);  
 			 }
				}).catch(err => {
 						throw err;
			});
		};

module.exports = mongoose.model ('User', userSchema);


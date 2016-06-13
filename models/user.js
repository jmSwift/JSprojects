var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');// used to encrypt the users password
var Schema = mongoose.Schema;



//User Schema attributes / characteristics / fields
var UserSchema = new Schema ({
	email: {type: String, unique: true, lowercase: true},
	password: String,

//
	profile:{
		name: {type: String, default:''},
		picture: {type: String, default:''}
	},

	address: String,
	//save past purchases!!
	history: [{
		date: Date,
		paid: { type: Number, default: 0},
		//item{ type: Schema.types.Objectid, ref:''}
	}]
});


//Has the password before we save it to database
//pre is a built in mongo method
UserSchema.pre('save', function(next) {
	var user = this;
	if(!user.isModified('password')){
		return next();
	}
	bcrypt.genSalt(10, function(err,salt) { //create 10 random data
		if(err) {
			console.log("error in userSchema");
		}
		bcrypt.hash(user.password, salt, null, function(err, hash) {
			user.password = hash;
			next();
		});


	});
});




//compare password in the database to the one user types in
UserSchema.methods.comparePassword = function(password){

	return bcrypt.compareSync(password, this.password);
}




//let other js use UserSchema
module.exports = mongoose.model('User', UserSchema);

const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const _ = require("lodash");

let UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required:[true, "Email is required."],
		trim: true,
		unique:true,
		lowercase: true,
		validate: {
			validator: value => validator.isEmail(value),
			message: "{VALUE} is not a valid email"
		}
	},
	username:{
		type:String,
		required: true,
		minlength: [3, "Username must be longer than three characters."],
		trim: true,
		unique: true
	},
	password: {
		type: String,
		require:true,
		minlength: [6, "Password must be at least six characters"]
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
});


UserSchema.methods.generateAuthToken = function() {
	let user = this;
	let access = "auth";
	let token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

	user.tokens.push({access,token});
	return user.save().then(() => {
		return token;
	});
};

UserSchema.methods.removeToken = function(token) {
	let user = this;

	return user.update({
		$pull: {
			tokens: {token}
		}
	});
};

UserSchema.statics.findByToken = function(token) {
	let User = this;
	let decoded;

	try{
		decoded = jwt.verify(token, process.env.JWT_SECRET);
	}catch(e){
		return Promise.reject();
	}

	return User.findOne({
		"_id": decoded._id,
		"tokens.token": token,
		"tokens.access": "auth"
	});
	
};

UserSchema.statics.findByCredentials = function(username, password){
	let User = this;
	return User.findOne({username}).then(user => {
		if(!user){
			return Promise.reject("Username not found.");
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, res) => { 
				if(res){
					resolve(user);
				} else{
					reject("The password is incorrect.");
				}
			});
		});
	});
};

UserSchema.pre("save", function(next) {
	let user = this;

	if(user.isModified("password")){
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next();
			});
		});
	}else{
		next();
	}	
});



UserSchema.methods.toJSON = function() {
	let user = this;
	let userObject = user.toObject();

	return _.pick(userObject, ["_id", "email", "username"]);
};

let User = mongoose.model("User", UserSchema);
module.exports = {User};
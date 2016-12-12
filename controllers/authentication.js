const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
	// json web tokens have a sub property (subject)
	// iat: issued at
	const timestamp = new Date().getTime();
	return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
	// User has already had their email and password auth'd
	// We just need to give them a token

	// passport's done call back gives req.user
	res.send({token: tokenForUser(req.user)});
}

exports.signup = function(req, res, next) {
	const email = req.body.email;
	const password = req.body.password;

	if (!email || !password){
		return res.status(422).send({ error: 'You must provide a password'});
	}

	// See if a user with the given email exists
	User.findOne({ email: email }, function(err, existingUser) {
		if(err) { return next(err); }

		// If a user with email DOES exist, return an error
		if(existingUser){
			return res.status(422).send({ error: 'Email is in use' }); // unprocessable entity
		}

		// If a user with email does NOT exist, create and save user record
		const user = new User({
			email: email,
			password: password
		});

		// Above only creates, this saves 
		user.save(function(err) {
			if (err) { return next(err); }

			// Respond to request indicating the user was created
			res.json({token: tokenForUser(user)});

		}); 

	});
	
}
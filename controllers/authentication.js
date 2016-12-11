const User = require('../models/user');

exports.signup = function(req, res, next) {
	const email = req.body.email;
	const password = req.body.password;

	// See if a user with the given email exists
	User.findOne({ email: email }, function(err, existingUser) {
		if(err) { return next(err); }

		// If a user with email DOES exist, return an error
		if(existingUser){
			return res.status(422).send({ error: 'Email is in use' }) // unprocessable entity
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
			res.json({success: true});

		}); 

	});
	
}
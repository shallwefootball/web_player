var path            = require('path'),
	async           = require('async'),
	LocalStrategy   = require('passport-local').Strategy,
	bcrypt          = require('bcryptjs'),
	userModel       = require('../models/userModel'),
	playerModel     = require('../models/playerModel'),
	teamModel       = require('../models/teamModel');

module.exports = function(passport) {

	passport.serializeUser(function (player, done) {
		done(null, player.email);
	});

	passport.deserializeUser(function (email, done) {

		userModel.selectUser(email, function(err, user){

			teamModel.selectCreateTeam(user.userId, function (err, createTeam) {

				playerModel.selectJoinedLeagues(user.userId, function (err, joinedLeagues) {

					delete user.password;

					user.createTeam    = createTeam;
					user.joinedLeagues = joinedLeagues;

					done(err, user);

				});
			});
		});
	});

	passport.use('local-login', new LocalStrategy({
		//input name
		usernameField 	  : 'email',
		passwordField 	  : 'password',
		passReqToCallback : true
	},
	function (req, email, password, done) {

		userModel.selectUser(email, function (err, user) {

			if (user) {

				if(!bcrypt.compareSync(password, user.password)){
					console.log("비번틀림......");
					return done(null, false, req.flash('loginMessage', '비밀번호가 틀렸어,, 알지???'));
				} else {

					// console.log('local-login  user       : ', user);
					return done(null, user);
				}

			}else {
				console.log('선수 못찾음...');
				return done(null, false, req.flash('loginMessage', '선수를 찾지못했어. 등록안했지?'));
			}

		});
	}));

	passport.use('local-signup', new LocalStrategy({
		usernameField     : 'email',
		passwordField 	  : 'password',
		passReqToCallback : true
	},
	function(req, email, password, done) {

		bcrypt.hash(password, 8, function(err, hash){
			if(err) return console.error('hash err', err);

			var player          = {};
			player.email        = email;
			player.hash         = hash;
			player.lastName     = req.body.lastName;
			player.firstName    = req.body.firstName;
			player.birthday     = req.body.birthday;

			var data = [
				player.email,
				player.hash,
				player.lastName,
				player.firstName,
				player.birthday
			];

			var playerFolderPath = path.resolve(__dirname, '..', 'images/users/', email);
			var profileImage = req.files.profileImage;

			userModel.selectUserEmail(email, function(err, arrayUser) {

				if (arrayUser[0]) {
					return done(null, false, req.flash('signupMessage', '존재하는 이메일입니다.'));
				} else {

					//transaction true => commit, false => rollback
					userModel.insertUser(data, function (err, result) {
						if (result.affectedRows == 1) {
							return done(null, player);    //success!!

						} else {
							return done(null, false, req.flash('signupMessage', '디비 인서트 에러여'));
						}
					});

				}     //end if existedUser
			});     //end selectPlayerEmail

		});

	}));


};





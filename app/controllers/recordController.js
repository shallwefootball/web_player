var recordModel = require('../models/recordModel'),
	async 		= require('async');

var Q = require('q');
require('q-foreach')(Q);

exports.recordView = function (req, res) {
	var matchId    = req.params.matchId,
		homeClubId = req.params.homeClubId,
		awayClubId = req.params.awayClubId;

	var match = {};

	async.parallel([
	    function(callback){
	    	//home
			recordModel.selectPlayersAClubForRecord(matchId, homeClubId, function (err, players) {

	            var playersObj 		= {};

				playersObj.starting = [];
				playersObj.sub      = [];

				for (var i = 0; i < players.length; i++) {
					switch (players[i].status) {
						case "starting" : playersObj.starting.push(players[i]); break;
						case "sub" 		: playersObj.sub.push(players[i]); break;
						default 		: break;
					}
				}
	            callback(null, playersObj);
			})
	    },
	    function(callback){
	    	//away
			recordModel.selectPlayersAClubForRecord (matchId, awayClubId, function (err, players) {

	            var playersObj	    = {};

				playersObj.starting = [];
				playersObj.sub      = [];

				for (var i = 0; i < players.length; i++) {
					switch (players[i].status) {
						case "starting" : playersObj.starting.push(players[i]); break;
						case "sub" : playersObj.sub.push(players[i]); break;
						default : break;
					}
				}

	            callback(null, playersObj);
			})
	    },
	    function(callback){
	    	//match info
			recordModel.selectMatchForRecord (matchId, function (err, info){

	            callback(null, info);
			})
	    },
	    function(callback){
	    	//players Recorded
	    	var sortPlayers = [];

			recordModel.selectPlayersRecorded (matchId, function (err, playersRecorded) {

				for (var i = 0; i < playersRecorded.length; i++) {

					if (playersRecorded[i].recordName == "in"){
						var sub = [];
						sub.push(playersRecorded[i]);
						sub.push(playersRecorded[i+1]);
						sortPlayers.push(sub);

					}else if (playersRecorded[i].recordName == "out") {
						// break;
					}else {
						sortPlayers.push(playersRecorded[i]);
					}
				}
				// console.log('sortPlayers  : ', sortPlayers);
	            callback(null, sortPlayers);

			})
	    },
	    function(callback){
	    	//match scorers
			recordModel.selectScorers (matchId, function (err, dbScorers){

				var scorers = {};

				var home    = [],
					away    = [];

				for (var i = 0; i < dbScorers.length; i++) {

					if (dbScorers[i].recordName == "goalScored" || dbScorers[i].recordName == "penaltyScored") {
						if (dbScorers[i].clubId == dbScorers[i].homeClubId) {
							home.push(dbScorers[i]);
						}else if (dbScorers[i].clubId == dbScorers[i].awayClubId) {
							away.push(dbScorers[i]);
						}

					//own Goal
					}else {
						if (dbScorers[i].clubId == dbScorers[i].homeClubId){
							away.push(dbScorers[i]);
						}else if (dbScorers[i].clubId == dbScorers[i].awayClubId) {
							home.push(dbScorers[i]);
						}
					}
				}
				scorers.home = home;
				scorers.away = away;


				// console.log(scorers);
	            callback(null, scorers);
			})
	    },
	],
	function(err, results){
		if(err){
			console.error(err);
			res.json(400, {error : "message"});
		}

		match.homePlayers 	  = results[0];
		match.awayPlayers 	  = results[1];
		match.info 		  	  = results[2];
		match.playersRecorded = results[3];
		match.scorers 		  = results[4];

		console.log('match   : ', match.homePlayers);
		console.log('match   : ', match.awayPlayers);
		res.render('../views/record/record', { match : match });

	});
};

exports.facebookRecordView = function (req, res) {

	var matchId    = req.params.matchId,
		homeClubId = req.params.homeClubId,
		awayClubId = req.params.awayClubId;

	var match = {};

	async.parallel([
	    function(callback){
	    	//home
			recordModel.selectPlayersAClubForRecord(matchId, homeClubId, function (err, players) {

	            var playersObj 		= {};

				playersObj.starting = [];
				playersObj.sub      = [];

				Q.forEach(players, function (player, index) {

					switch (player.status) {
						case "starting" : playersObj.starting.push(player); break;
						case "sub" 		: playersObj.sub.push(player); break;
						default 		: break;
					}

					var defer = Q.defer();
					recordModel.selectPlayerRecorded (matchId, player.lineupId, function (err, result){
						if (err) return console.error('err  : ', err);

						player.records = result;
					    defer.resolve(player);
					});


					return defer.promise;
				}).then(function (result){

		            callback(null, playersObj);
				});
			})
	    },
	    function(callback){
	    	//away
			recordModel.selectPlayersAClubForRecord (matchId, awayClubId, function (err, players) {

	            var playersObj 		= {};

				playersObj.starting = [];
				playersObj.sub      = [];

				Q.forEach(players, function (player, index) {

					switch (player.status) {
						case "starting" : playersObj.starting.push(player); break;
						case "sub" 		: playersObj.sub.push(player); break;
						default 		: break;
					}

					var defer = Q.defer();
					recordModel.selectPlayerRecorded (matchId, player.lineupId, function (err, result){
						if (err) return console.error('err  : ', err);

						player.records = result;
					    defer.resolve(player);
					});


					return defer.promise;
				}).then(function (result){

		            callback(null, playersObj);
				});
			})
	    },
	    function(callback){
	    	//match info
			recordModel.selectMatchForRecord (matchId, function (err, info){

	            callback(null, info);
			})
	    },
	],
	function(err, results){
		if(err){
			console.error(err);
			res.json(400, {error : "message"});
		}

		match.homePlayers 	  = results[0];
		match.awayPlayers 	  = results[1];
		match.info 		  	  = results[2];
		match.playersRecorded = results[3];

		console.log('facebook view home   : ', match.homePlayers);
		console.log('facebook view away   : ', match.awayPlayers);
		console.log('facebook view info   : ', match.info);
		res.render('../views/record/facebook', { match : match })

	});
}

exports.postRecord = function (req, res) {

	var minutes    = req.body.recordMinutes,
		lineupId   = req.body.selectedLineupId,
		recordName = req.body.selectedRecordName,
		recordTime = req.body.selectedRecordTime,
		recordData = [recordName, recordTime, minutes, lineupId];

	var matchId = req.params.matchId,
		score   = req.body.score;

	async.waterfall([
		function (callback) {
			recordModel.insertRecord (recordData, function (err, result) {
				if (result.affectedRows > 0) {

					callback(null, result.insertId)
				}else {
					callback(err);
				}
			});
		},
		function (recordId, callback) {
			if(score){
				recordModel.updateScore (matchId, score, function (err, result) {
					if (result.affectedRows > 0) {

						callback(null, recordId);
					}else {
						callback(err);
					}
				});
			}else {
				callback(null, recordId);
			}
		}
	], function (err, result) {
		if(err){
			console.error(err);
			res.json(400, {error : "message"});
		}
		res.json(200, {recordId : result});
	});

}

exports.recordSubs = function (req, res) {

	var minutes 		 = req.body.recordMinutes,
		recordTime 		 = req.body.subRecordTime,
		selectedLineupId = req.body.selectedLineupId,
		subLineupId 	 = req.body.subLineupId;

	var selectedData = ["out", recordTime, minutes, selectedLineupId],
		subData      = ["in", recordTime, minutes, subLineupId];

	async.waterfall([
	    function(callback){
			recordModel.insertRecord (selectedData, function (err, result) {
				if (result.affectedRows > 0) {
					callback(null, result.insertId);
				}else {
					callback(err);
				}
			});
	    },
	    function(selectedRecordId, callback){
			recordModel.insertRecord (subData, function (err, result) {
				if (result.affectedRows > 0) {

					callback(null, selectedRecordId, result.insertId);
				}else {
					callback(err);
				}
			});
	    }
	],
	function(err, selectedRecordId, subRecordId){
		if(err){
			console.error(err);
			res.json(400, {error : "message"});
		}
		res.json(200, {
			selectedRecordId : selectedRecordId,
			subRecordId : subRecordId
		});

	});
}

exports.deleteRecord = function (req, res) {

	var recordIds = req.body.recordIds,
		matchId   = req.params.matchId,
		score     = req.body.score;

	switch (recordIds.length) {
		case 1 :
			async.waterfall([
				function (callback) {
					recordModel.deleteRecord (recordIds[0], function (err, result){
						if (result.affectedRows > 0) {
							callback(null);
						}else {
							callback(err);
						}
					});
				},
				function (callback) {
					if(score){
						recordModel.updateScore (matchId, score, function (err, result) {
							if (result.affectedRows > 0) {
								callback(null);
							}else {
								callback(err);
							}
						});
					}else {
						callback(null);
					}
				}
			], function (err, result) {
				if(err){
					console.error(err);
					res.json(400, {error : "message"});
				}
				res.json(200, {message : "message"});
			});
			break;

		case 2 :
			async.parallel([
			    function(callback){
					recordModel.deleteRecord (recordIds[0], function (err, result){
						if (result.affectedRows > 0) {
							callback(null);
						}else {
							callback(err);
						}
					});
			    },
			    function(callback){
					recordModel.deleteRecord (recordIds[1], function (err, result){
						if (result.affectedRows > 0) {

							callback(null);
						}else {
							callback(err);
						}
					});
			    }
			],
			function(err, results){
				if(err){
					console.error(err);
					res.json(400, {error : "message"});
				}
				res.json(200, {message : "message"});
			});
			break;
	}
}








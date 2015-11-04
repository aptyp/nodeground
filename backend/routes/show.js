
/*
 * GET images
 */

var express = require('express');
var router = express.Router();

router.GET('/show', function(req, res) {
	res.send(200);
});

module.exports = router;
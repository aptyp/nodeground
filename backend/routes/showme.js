
/*
 * GET show call
 */

exports.index = function(req, res){
  res.render('showme', { title: 'Show' })
};
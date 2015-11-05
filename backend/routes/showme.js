
/*
 * GET show call
 */

exports.showme = function(req, res){
  res.render('showme', { title: 'Show' })
};
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '大医慢病研究院' });
});

router.get('/introduce', function (req, res, next) {
    res.render('introduce', {
        title: '平台新闻',
        /* user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString() */
    });
});
module.exports = router;

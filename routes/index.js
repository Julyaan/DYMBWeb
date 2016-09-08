var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
	title: '大医慢病研究院', 
	status1: 'active',status2: '',status3: '',status4: '',status5: '',status6: '',status7: '',status8: '',status9: ''
	});
});

router.get('/introduce', function (req, res, next) {
    res.render('introduce', {
        title: '研究所简介',
		status1: '',status2: 'active',status3: '',status4: '',status5: '',status6: '',status7: '',status8: '',status9: ''
        /* user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString() */
    });
});
module.exports = router;

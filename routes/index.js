var express = require('express');
var router = express.Router();
const fs = require('fs');

// middleware that is specific to this router
var requestTime = function (req, res, next) {
  req.requestTime = Date.now();
  next();
}

router.use(requestTime);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.all('/time', function(req, res, next) {
  var responseText = 'Hello World!<br>'
 responseText += '<small>Requested at: ' + req.requestTime + '</small>'
 res.send(responseText)
});

/*router.get('/error', function(req, res, next) {
   throw new Error('BROKEN')
}); */
router.get('/errorrr', function (req, res, next) {
  fs.readFile('/image.jpg', function (err, data) {
    if (err) {
      next(err) // Pass errors to Express.
    } else {
      res.send(data)
    }
  })
});

router.get('/error', [
  function (req, res, next) {
    fs.writeFile('/inaccessible-path', 'data', next)
  },
  function (req, res) {
    res.send('Yahoo')
  }
])






module.exports = router;

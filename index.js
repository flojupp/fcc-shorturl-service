require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


const shortUrlList = [];

function isValidUrl(url) {
  try {
    const newUrl = new URL(url);
    return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

// challenge API endpoints:
app.post('/api/shorturl', function(req, res) {
  const url = req.body.url;
  if (isValidUrl(url)) {
    const index = shortUrlList.push(url);
    res.json({ original_url: url, short_url: index - 1 });
    return;
  }
  res.json({ error: 'invalid url' });
});

app.get('/api/shorturl/:shorturl', function(req, res) {
  const shorturl = req.params.shorturl;
  const url = shortUrlList[shorturl];
  if (url) {
    res.redirect(url);
  } else {
    res.status(404).send('Not found');
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

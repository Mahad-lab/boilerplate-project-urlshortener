require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const urlparser = require('url');
const bodyParser = require('body-parser');

let numberOfUrls = 0;
short_urls = {};

function isValidUrl(urlString) {
  return !urlString.startsWith("http")
    ? false
    : dns.lookup(urlparser.parse(urlString).hostname, (error, address) => {
      return !address ? false : true;
    });
}

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


app.get("/api/shorturl/:goto", function (req, res) {
  const shortUrl = req.params.goto;
  const originalUrl = short_urls[`${shortUrl}`];
  if (originalUrl) {
    // return 
      res.redirect(originalUrl);
  } else {
    // return 
      res.json({ error: "Short URL not found" });
    }
});

app.post("/api/shorturl", function (req, res) {
  const urlString = req.body.url;
  if (isValidUrl(urlString)) {
    numberOfUrls += 1;
    short_urls[`${numberOfUrls}`] = urlString;
    res.json({ original_url: urlString, short_url: numberOfUrls });
  } else {
    res.json({ error: "invalid url" });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

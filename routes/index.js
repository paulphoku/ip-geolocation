var express = require('express');
var router = express.Router();
const maxmind = require('maxmind');
const path = require('path');

// Path to the GeoLite2 database file
const dbPath = path.join(__dirname, '../db/GeoLite2-City.mmdb');

// Initialize the maxmind reader
let lookup;

maxmind.open(dbPath)
  .then(reader => {
    lookup = reader;
  })
  .catch(err => {
    console.error('Error loading GeoLite2 database:', err);
  });


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET users listing. */
router.get('/json', function (req, res, next) {
  if (!lookup) {
    return res.status(500).json({ error: 'GeoLite2 database not loaded' });
  }

  // Fetch the client's IP address
  const ip = req.ip === '::1' ? '127.0.0.1' : req.ip; // Handle local testing

  console.log('Client IP:', ip);

  try {
    // Fetch geolocation data for the IP address
    const geoData = lookup.get(ip);

    console.log('GeoData:', geoData);

    if (!geoData) {
      return res.status(404).json({ error: 'IP address not found in the database' });
    }

    // Send the response data as JSON
    res.json(geoData);
  } catch (error) {
    console.error('Error fetching geolocation data:', error);
    res.status(500).json({ error: 'Error fetching geolocation data' });
  }
});

module.exports = router;

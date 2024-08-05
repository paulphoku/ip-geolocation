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

/* GET users listing. */
router.get('/json', function (req, res, next) {
  if (!lookup) {
    return res.status(500).json({ error: 'GeoLite2 database not loaded' });
  }

  // Fetch the client's IP address
  const ip = req.ip === '::1' ? '127.0.0.1' : req.ip; // Handle local testing

  // Fetch geolocation data for the IP address
  const geoData = lookup.get(ip);

  // Send the response data as JSON
  res.json(geoData);
});

module.exports = router;

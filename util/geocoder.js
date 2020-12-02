const NodeGeocoder = require('node-geocoder');

    const options = {
        provider: process.env.PROVIDER,
        apiKey: process.env.GOOGLE_API_KEY,
        httpAdapter:'https',
        formatter: null
    };
    const geocoder = NodeGeocoder(options);


module.exports = geocoder;



'use strict'

var request = require('request')
const bodyParser = require('body-parser');

// Local variables
// var api_URI = 'https://api.flickr.com/services/feeds/photos_public.gne?format=json&nojsoncallback=?'
var api_URI = 'https://api.flickr.com/services/feeds/photos_public.gne?format=json&nojsoncallback=?&safe_search=1'

class assetUrlGetter {
  constructor() {

    this.getArray = function (callback) {
      console.log('getting urls')
      // Get info from server
      request(api_URI, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          // console.log(body) // Print the response.
          var dataJSON = JSON.parse(body);
          let assets = []
          dataJSON["items"].forEach(function(item) {
            let media = item["media"]
            assets.push(media["m"])
          })
    
          console.log("got assets");
          return callback(assets)
        } else {
          console.log('No valid response from URL');
          // process.exit()
        }
      })
    }
  }
}

module.exports = assetUrlGetter;
require("dotenv").config();
var moment = require('moment');
var axios = require("axios");
var Spotify = require('node-spotify-api');
var keys = require("./keys");

//Make global 

// take in input to determine which function to call
function liriInput() {
    var userCommand = process.argv[2];

    if (userCommand === "spotify-this-song") {
        searchSpotify();
    } else if (userCommand === "concert-this") {
        searchBandsInTown();
    } else if (userCommand === "movie-this") {
        searchOMDB();
    } else if (userCommand === "do-what-it-says") {
        searchRandomTXT();
    } else {
        console.log("Not a valid command, please use on of the following commands: \nspotify-this-song \nconcert-this \nmovie-this \ndo-what-it-says");
    }
}

// SPOTIFY SECTION
function searchSpotify() {
    var spotify = new Spotify(keys.spotify);
    var songArray = process.argv;
    var song = "";
    var spotifyBaseURL = "https://api.spotify.com/v1"

    // https://developer.spotify.com/documentation/web-api/reference/object-model/
    // https://www.npmjs.com/package/node-spotify-api

    for (var i = 3; i < songArray.length; i++) {
        if (i > 3 && i < songArray.length) {
            song = song + "+" + songArray[i];
        } else {
            song += songArray[i];
        }

        // create a default song in case nothing is entered
        if (process.argv[3] === "") {
            song = "The Sign";
        } else {
            spotify.search({ type: 'track', query: song }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }
            })
        }

        spotify.search({ type: 'track', query: song }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            console.log("\n----------------------------------------------------------------------------------------- \n");
            console.log("Artist(s): " + data.tracks.items[0].album.artists[0].name);
            console.log("Song Title: " + data.tracks.items[0].name);
            console.log("Song Preview Link: " + data.tracks.items[0].preview_url);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("\n----------------------------------------------------------------------------------------- \n");
        });
    }
}

//BANDS IN TOWN SECTION

function searchBandsInTown() {
    var bandName = "";
    var bandArray = process.argv;
    for (var i = 3; i < bandArray.length; i++) {

        if (i > 3 && i < bandArray.length) {
            bandName = bandName + "+" + bandArray[i];
        }
        else {
            bandName += bandArray[i];
        }
    }
    var queryUrl = "https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=codingbootcamp"

    axios.get(queryUrl).then(
        function (response) {
            var importedDataTime = response.data[0].datetime;
            var timeConverted = moment(importedDataTime).format('MMMM Do YYYY, h:mm:ss a');

            console.log("\n----------------------------------------------------------------------------------------- \n");
            console.log("See " + response.data[0].lineup + " at: ");
            console.log("Venue Name: " + response.data[0].venue.name);
            console.log("Venue Location: " + response.data[0].venue.city + ", " + response.data[0].venue.region + ", " + response.data[0].venue.country);
            console.log("Event Date Converted: " + timeConverted);
            console.log("\n----------------------------------------------------------------------------------------- \n");
        }
    )
}


//OMDB SECTION
function searchOMDB() {
    var movieName = "";
    var movieArray = process.argv;

    for (var i = 3; i < movieArray.length; i++) {

        if (i > 3 && i < movieArray.length) {
            movieName = movieName + "+" + movieArray[i];
        }
        else {
            movieName += movieArray[i];
        }
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    axios.get(queryUrl).then(
        function (response) {
            console.log("\n----------------------------------------------------------------------------------------- \n");
            console.log("Title: " + response.data.Title);
            console.log("Release Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country Produced: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("\n");
            console.log("Actors: " + response.data.Actors);
            console.log("\n----------------------------------------------------------------------------------------- \n");
        }
    );
}

// CALL TO TEXT FILE SECTION
function searchRandomTXT() {
    var fs = require("fs");
    var recallOperation = process.argv;

    //create a new file and add "spotify-this-song, I Want it That Way"
    fs.writeFile("log.txt", "spotify-this-song, I Want it That Way", function(err) {
        if (err) {
            return console.log(err);
        }
    });

    fs.readFile("log.txt", "utf8", function(error, data) {
        var readOperator = data.split(", ")[0];
        var readValue = data.split(", ")[1];

        console.log("read Operator: " + readOperator);
        console.log("read Value: " + readValue);

        if (error) {
            return console.log(error);
        }

        function rinseAndRepeat() {
            if (readOperator === "spotify-this-song") {
                function Spotify() {
                    spotify.search({ type: 'track', query: readValue }, function (err, data) {
                        if (err) {
                            return console.log('Error occurred: ' + err);
                        }
            
                        console.log("\n----------------------------------------------------------------------------------------- \n");
                        console.log("Artist(s): " + data.tracks.items[0].album.artists[0].name);
                        console.log("Song Title: " + data.tracks.items[0].name);
                        console.log("Song Preview Link: " + data.tracks.items[0].preview_url);
                        console.log("Album: " + data.tracks.items[0].album.name);
                        console.log("\n----------------------------------------------------------------------------------------- \n");
                    });
                }
            } else if (readOperator === "concert-this") {
                function BandsInTown() {
                    var queryUrl = "https://rest.bandsintown.com/artists/" + readValue + "/events?app_id=codingbootcamp"
                    axios.get(queryUrl).then(
                        function (response) {
                            var importedDataTime = response.data[0].datetime;
                            var timeConverted = moment(importedDataTime).format('MMMM Do YYYY, h:mm:ss a');
                            console.log("\n----------------------------------------------------------------------------------------- \n");
                            console.log("See " + response.data[0].lineup + " at: ");
                            console.log("Venue Name: " + response.data[0].venue.name);
                            console.log("Venue Location: " + response.data[0].venue.city + ", " + response.data[0].venue.region + ", " + response.data[0].venue.country);
                            console.log("Event Date Converted: " + timeConverted);
                            console.log("\n----------------------------------------------------------------------------------------- \n");
                        }
                    )
                }

            } else if (readOperator === "movie-this") {
                function OMDB() {
                    var queryUrl = "http://www.omdbapi.com/?t=" + readValue + "&y=&plot=short&apikey=trilogy";
                    axios.get(queryUrl).then(
                        function (response) {
                            console.log("\n----------------------------------------------------------------------------------------- \n");
                            console.log("Title: " + response.data.Title);
                            console.log("Release Year: " + response.data.Year);
                            console.log("IMDB Rating: " + response.data.Ratings[0].Value);
                            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
                            console.log("Country Produced: " + response.data.Country);
                            console.log("Language: " + response.data.Language);
                            console.log("Plot: " + response.data.Plot);
                            console.log("\n");
                            console.log("Actors: " + response.data.Actors);
                            console.log("\n----------------------------------------------------------------------------------------- \n");
                        }
                    );
                }
            } else if (readOperator === "do-what-it-says") {
                console.log("Give me a break, choose something else");
            } else {
                console.log("Not a valid command, please use on of the following commands: \nspotify-this-song \nconcert-this \nmovie-this \ndo-what-it-says");
            }
        }
    
    rinseAndRepeat();

    });

    

}

liriInput();
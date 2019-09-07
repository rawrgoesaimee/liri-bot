require("dotenv").config();
var keys = require("./keys.js");
var request = require('request');
var moment = require('moment');
var fs = require("fs");

var spotify = new Spotify(keys.spotify);

var nodeArg = process.argv;

var userInput = "";
var nextUserInput = "";

//songs, artists, movie name
for (var i = 3; i < nodeArg.length; i++){

    if(i > 3 && i < nodeArg.length) {
        userInput = userInput + "%20" + nodeArg[i];
    }
    else {
        userInput += nodeArg[i];
    }
    console.log(userInput);
}
//log.txt removing 20%
for (var i = 3; i < nodeArg.length; i++){
    nextUserInput = userInput.replace(/%20/g, " ");
}

var userCommand = process.argv[2];
console.log(userCommand);
console.log(process.argv);
switchCase();

//Switch statment
function switchCase() {
    switch (userCommand) {
        case "concert-this":
            fs.appendFileSync("log.txt", nextUserInput + "\n----------------\n", function (error) {
                if (error) {
                    console.log(error);
                };
            });

            var queryURL = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=trilogy"
            request(queryURL, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    
                    var data = JSON.parse(body);
                    console.log(data);
                    
                    for (var i = 0; i < data.length; i++) {
                        console.log("Venue: " + data[i].venue.name);
                        fs.appendFileSync("log.txt", "Venue: " + data[i].venue.name + "\n", function (error) {
                            if (error) {
                                console.log(error);
                            };
                        });

                        if (data[i].venue.region == "") {
                            console.log("Location: " + data[i].venue.city + ", " + data[i].venue.country);   
                            fs.appendFileSync("log.txt", "Location: " + data[i].venue.city + ", " + data[i].venue.country + "\n", function (error) {
                                if (error) {
                                    console.log(error);
                                };
                            });

                        } else {
                            console.log("Location: " + data[i].venue.city + ", " + data[i].venue.region + ", " + data[i].venue.country);
                            fs.appendFileSync("log.txt", "Location: " + data[i].venue.city + ", " + data[i].venue.region + ", " + data[i].venue.country + "\n", function (error) {
                                if (error) {
                                    console.log(error);
                                };
                            });
                        }

                        //Show Date
                        var date = data[i].datetime;
                        date = moment(date).format("MM/DD/YYYY");
                        console.log("Date: " + date)
                        fs.appendFileSync("log.txt", "Date: " + date + "\n----------------\n", function (error) {
                            if (error) {
                                console.log(error);
                            };
                        });
                        console.log("----------------")
                    }
                }
            });

            break;
        case "spotify-this-song":
        console.log("here");
          
            if (!userInput) {
                userInput = "The%20Sign";
                nextUserInput = userInput.replace(/%20/g, " ");

            }
            fs.appendFileSync("log.txt", nextUserInput + "\n----------------\n", function (error) {
                if (error) {
                    console.log(error);
                };
            });

            console.log(spotify);
            spotify.search({

                type: "track",
                query: userInput
            }, function (err, data) {
                if (err) {
                    console.log("Error occured: " + err)
                }

                //Assign data being used to a variable
                var info = data.tracks.items
                // console.log(info);

                //Loop through all the "items" array
                for (var i = 0; i < info.length; i++) {
                    //Store "album" object to variable
                    var albumObject = info[i].album;
                    var trackName = info[i].name
                    var preview = info[i].preview_url
                    //Store "artists" array to variable
                    var artistsInfo = albumObject.artists
                    //Loop through "artists" array
                    for (var j = 0; j < artistsInfo.length; j++) {
                        console.log("Artist: " + artistsInfo[j].name)
                        console.log("Song Name: " + trackName)
                        console.log("Preview of Song: " + preview)
                        console.log("Album Name: " + albumObject.name)
                        console.log("----------------")
                        //Append data to log.txt
                        fs.appendFileSync("log.txt", "Artist: " + artistsInfo[j].name + "\nSong Name: " + trackName + "\nPreview of Song: " + preview + "\nAlbum Name: " + albumObject.name + "\n----------------\n", function (error) {
                            if (error) {
                                console.log(error);
                            };
                        });
                    }
                }
            })

            break;
        case "movie-this":
            //If statement for no movie provided
            if (!userInput) {
                userInput = "Mr%20Nobody";
                nextUserInput = userInput.replace(/%20/g, " ");
            }

            //Append userInput to log.txt
            fs.appendFileSync("log.txt", nextUserInput + "\n----------------\n", function (error) {
                if (error) {
                    console.log(error);
                };
            });

            //Run request to OMDB
            var queryURL = "https://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy"
            request(queryURL, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    var info = JSON.parse(body);
                    console.log("Title: " + info.Title)
                    console.log("Release Year: " + info.Year)
                    console.log("OMDB Rating: " + info.Ratings[0].Value)
                    console.log("Rating: " + info.Ratings[1].Value)
                    console.log("Country: " + info.Country)
                    console.log("Language: " + info.Language)
                    console.log("Plot: " + info.Plot)
                    console.log("Actors: " + info.Actors)

                    //Append data to log.txt
                    fs.appendFileSync("log.txt", "Title: " + info.Title + "\nRelease Year: " + info.Year + "\nIMDB Rating: " + info.Ratings[0].Value + "\nRating: " +
                        info.Ratings[1].Value + "\nCountry: " + info.Country + "\nLanguage: " + info.Language + "\nPlot: " + info.Plot + "\nActors: " + info.Actors + "\n----------------\n",
                        function (error) {
                            if (error) {
                                console.log(error);
                            };
                        });
                }
            });

            break;
    }
}

if (userCommand == "follow-instructions") {
    var fs = require("fs");

    //Read random.txt file
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error)
        }

        //Split data into array
        var textArr = data.split(",");
        userCommand = textArr[0];
        userInput = textArr[1];
        nextUserInput = userInput.replace(/%20/g, " ");
        switchCase();
    })
}
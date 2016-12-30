var QrveyUtil = require('./lib/qrveyutil');

//Change the URL here if you have a dedicated server plan.
const appURL = "https://api.qrvey.com";

//Insert your API key
//Get a free API key from https://www.qrvey.com/developers.html
const apikey = "<your api key>";

//Get the Survey object to be created
var qrveyBody = require('./lib/qrveyBody');

//Default user object to be created if no users exists in the system
var userBody = {
    "email": "testuser@email.com",
    "password": "test",
    "first_name": "Test",
    "organization": "ABC",
    "last_name": "User"
};

//Create and activate the survey and return a URL.
QrveyUtil.createQrvey(appURL, apikey, qrveyBody, userBody, function (err, data) {
    if (err) {
        console.log("Got error: " + err);
    } else {
        console.log("done");
    }
});
var request = require('request');
var _ = require('lodash');

/*
* This function will create a new Survey using the JSON object defined
* in qrveyBody.json file. Here are the overall steps
* 1. Get a userid (create one if it does not exists). This step is to make this code easier to run, in a real app you'll have a userid 
* 2. Create a new Survey (POST)
* 3. Update the Survey with questions (PUT) and other properties from qrveyBody.json file
* 4. Activate the survey. This call will return a URL that can be shared with respondents who are going to answer the Survey.
*/
exports.createQrvey = function (appURL, apikey, qrveyBody, defaultUserBody, done) {

    //First get a userid. Create one if there are no users.
    getOrCreateUserID(appURL, apikey, defaultUserBody, function gotUser(err, userid){
        if(err) return done(err);
        console.log("Got userid: " + userid);

        var qBody = buildQrveyModel(qrveyBody); //Build or change the model as needed

        //Create the Survey and it will return a qrveyid
        createQrveyFromModel(appURL, apikey, userid, qBody, function (err, qDetails) {
            if (err) return done(err);

            //PUT the survey model
            updateQrveyFromModel(appURL, apikey, userid, qDetails, qBody, function (err, qrveyDetails) {
                if (err) return done(err);

                //Activate this Survey
                activateQrvey(appURL, apikey, userid, qDetails.qrveyid, function (err, actDetails) {
                    if (err) return done(err);

                    console.log("------Activation Details----------");
                    console.log(actDetails);

                    done(err, actDetails);
                });
            });
        });
    });
};

var buildQrveyModel = function (qrveyBody) {
    var qBody = _.cloneDeep(qrveyBody);

    //Make any changes to the Survey model here
    
    return qBody;
}

/*
* Call the POST on <appURL>/user/:userid/survey to create a new Survey
*/
var createQrveyFromModel = function (appURL, apikey, userid, qBody, done) {

    var createModel = {
        name: qBody.name,
        description: qBody.description
    };

    request.post({
        url: appURL + '/user/' + userid + '/survey', json: createModel, headers: {
            'x-api-key': apikey
        }
    }, function (err, httpResponse, body) {
        if (err) return done(err);
        console.log("Survey created with ID: " + body.qrveyid);

        return done(err, body);
    });
};

/*
* Call the PUT on <appURL>/user/:userid/survey/:surveyid to update the survey with questions
*/
var updateQrveyFromModel = function (appURL, apikey, userid, qDetails, qBody, done) {

    var qrveyid = qDetails.qrveyid;
    var updateModel = _.defaults(qBody, qDetails);

    request.put({
        url: appURL + '/user/' + userid + '/survey/' + qrveyid, json: updateModel, headers: {
            'x-api-key': apikey
        }
    }, function (err, httpResponse, body) {
        if (err) return done(err);
        console.log("Survey updated");

        return done(err, body);
    });
};

/*
* Activate the survey by calling POST <appURL>/user/:userid/survey/:surveyid/activate 
*/
var activateQrvey = function (appURL, apikey, userid, qrveyid, done) {

    request.post({
        url: appURL + '/user/' + userid + '/survey/' + qrveyid + '/activate', json: {}, headers: {
            'x-api-key': apikey
        }
    }, function (err, httpResponse, body) {
        if (err) return done(err);
        console.log("Survey is active!");

        return done(err, body);
    });
};

/*
* Get a list of all users under this account and if no users are found then create a new user.
*/
function getOrCreateUserID(appURL, apikey, userBody, done){

    getUsers(appURL, apikey, function(err, usersList){
        if(err) return done(err);

        if(usersList && _.head(usersList)){
            //There are users, use the first one.
            return done(null, _.head(usersList).userid);
        }else{
            //Create a new User
            createNewUser(appURL, apikey, userBody, function(err, user){
                if(err) return done(err);
                return done(null, user.userid);
            })
        }
    });
};

/*
* Get a list of users by calling GET <appURL>/user
*/
function getUsers(appURL, apikey, done){
    request.get({
        url: appURL + '/user', headers: {
            'x-api-key': apikey
        }
    }, function (err, httpResponse, body) {
        if (err) return done(err);

        return done(err, JSON.parse(body));
    });
}

/*
* Create a new user by POST <appURL>/user
*/
function createNewUser(appURL, apikey, userBody, done){
    
    request.post({
        url: appURL + '/user', json: userBody, headers: {
            'x-api-key': apikey
        }
    }, function (err, httpResponse, body) {
        if (err) return done(err);
        console.log("user created. " + JSON.stringify(body));

        return done(err, body);
    });
}
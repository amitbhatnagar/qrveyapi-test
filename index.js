var QrveyUtil = require('./lib/qrveyutil');

QrveyUtil.createQrvey(function(err, data){
    if(err) {
        console.log("Got error: " + err);
    }else{
        console.log("done");
    }
});
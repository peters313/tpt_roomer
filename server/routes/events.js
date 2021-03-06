// use this block for development
var googleConfig = {
    clientID: '270120115745-e2n1h3h8aufb1brf05hbin6r54orduop.apps.googleusercontent.com',
    clientSecret: 'uwWUU7VuuVSxZwZ5GT132DHv',
    calendarId: 'tpt.roomer@gmail.com',
    redirectURL: 'http://localhost:3000/auth'
};

// use this block for heroku app
/*var googleConfig = {
    clientID: '721997656029-ltfbn93eoag67dtfd2vmpok1pgpqltnd.apps.googleusercontent.com',
    clientSecret: 'tU-MvIgxQskkYgXJ89uoko-v',
    calendarId: 'tpt.roomer@gmail.com',
    redirectURL: 'https://tpt-demo.herokuapp.com/auth'
};*/

var express = require('express');
var moment = require('moment');
var google = require('googleapis');
var router = express.Router();
var path = require('path');

var app = express(),
    calendar = google.calendar('v3');
oAuthClient = new google.auth.OAuth2(googleConfig.clientID, googleConfig.clientSecret, googleConfig.redirectURL),
    authed = false;

router.post('/', function(req,res,next){
    //var today = moment().format('YYYY-MM-DD') + 'T';
    console.log(req.body);
    console.log("post hit");
    var event = {
        summary: req.body.summary,
        location: req.body.location,
        start: {
            'dateTime': req.body.start,
            'timeZone': 'America/Chicago'
        },
        end: {
            'dateTime': req.body.end,
            'timeZone': 'America/Chicago'
        }
    };

    console.log(event);
    calendar.events.insert({
        calendarId: googleConfig.calendarId,
        resource: event,
        auth: oAuthClient
    }, function(err, event){
        if (err) {
            console.log('There was an error contacting google calendar: ' + err);
            return;
        }
        res.send("yes");
        console.log('event created', event.htmlLink);
    });
});

router.get('/', function(req, res) {
    console.log(req.params[0]);

    var today = moment().format('YYYY-MM-DD') + 'T';

    calendar.events.list({
        calendarId: googleConfig.calendarId,
        maxResults: 9999,
        timeMin: today + '00:00:00.000Z',
        timeMax: today + '23:59:59.000Z',
        auth: oAuthClient
        }, function(err, events) {
            if(err) {
                console.log('Error fetching events');
            } else {
                console.log('Successfully fetched events');
                console.log(events);
                res.json(events);

            }
        });
    //}
});

router.get("/*", function(req,res){
    var file = req.params[0] || '/assets/views/index.html';
    //console.log(file);
    res.sendFile(path.join(__dirname, '../public', file));

});

module.exports = router;

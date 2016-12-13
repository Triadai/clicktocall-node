var test = require('tape');
var twilio = require('twilio');
var request = require('supertest');
var cheerio = require('cheerio');
var server = require('../server');

test('home page responds with 200', function (t) {
    t.plan(1);

    request(server).get('/').expect(200).end(function(err, response) {
        if (err) {
            t.fail('HTTP request did not return 200 OK.');
        } else {
            t.pass('HTTP request successful');
        }
    });

});

test('TwiML response is valid', function (t) {
    t.plan(3);

    var url = '/outbound/' + encodeURIComponent('+15555555555');

    request(server).post(url).expect(200).end(function(err, response) {
        if (err) {
            t.fail('HTTP request did not return 200 OK.');
        } else {
            t.pass('HTTP request successful');
        }

        // Test contents of the XML response
        var $ = cheerio.load(response.text);

        t.equal($('Response').children().length, 2,
            'response should have 2 children');
        t.equal($('Say').attr('voice'), 'alice',
            'Say tag should be using the alice voice');
    });

});

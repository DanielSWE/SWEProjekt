"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const Question_1 = require('./Question');
const DataSource_1 = require('./DataSource');
const QuestionDAO_1 = require('./QuestionDAO');
const app = express();
const port = process.env.PORT || 8080;
const router = express.Router();
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(allowCrossDomain);
app.use('/wwm', router);
app.listen(port);
console.log('http://127.0.0.1:' + port + '/wwm');
DataSource_1.DataSource.getInstance().initDatabase();
router.get('/', function (req, res) {
    res.json({ "message": 'WWM server is running ...' });
});
router.get('/listQuestions', function (req, res) {
    var callback = function (rows) {
        var response = JSON.stringify(rows);
        console.log("callback executed" + rows);
        res.json(JSON.parse(response));
    };
    QuestionDAO_1.QuestionDAO.getAllQuestions(callback);
});
router.get('/question/:id', function (req, res) {
    var id = req.params.id;
    var callback = function (question) {
        var response = JSON.stringify(question);
        res.json(JSON.parse(response));
    };
    QuestionDAO_1.QuestionDAO.getQuestionById(id, callback);
});
router.put('/question/create', function (req, res) {
    var jsonQuestion = JSON.parse(JSON.stringify(req.body));
    var question = new Question_1.Question(jsonQuestion['id'], jsonQuestion['question'], jsonQuestion['answerA'], jsonQuestion['answerB'], jsonQuestion['answerC'], jsonQuestion['answerD'], jsonQuestion['correctAnswer']);
    QuestionDAO_1.QuestionDAO.createQuestion(question).then((resolve) => {
        res.json(JSON.parse(resolve.toString()));
    });
});

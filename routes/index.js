const express = require('express');
const router = express.Router();
const knex = require('../db/knex');


router.get('/', function (req, res, next) {

  const isAuth = req.isAuthenticated();

  if (isAuth) {

    const userId = req.user.id;

    knex("tasks")
      .select("*")
      .where({
        user_id: userId
      })
      .then(function (results) {

        res.render('index', {
          title: 'ToDo App',
          todos: results,
          isAuth: isAuth,
        });

      })
      .catch(function (err) {

        console.error(err);

        res.render('index', {
          title: 'ToDo App',
          isAuth: isAuth,
          errorMessage: [err.sqlMessage],
        });

      });

  } else {

    res.render('index', {
      title: 'ToDo App',
      isAuth: isAuth,
    });

  }

});



router.post('/', function (req, res, next) {

  const isAuth = req.isAuthenticated();
  const userId = req.user.id;

  const todo = req.body.add;

  const startDate = req.body.start_date;
  const endDate = req.body.end_date;

  const startTime = req.body.start_time;
  const endTime = req.body.end_time;

  const typeId = req.body.type_id;



  knex("tasks")
    .insert({

      user_id: userId,

      content: todo,

      start_date: startDate,
      end_date: endDate,

      start_time: startTime,
      end_time: endTime,

      type_id: typeId

    })
    .then(function () {

      res.redirect('/');

    })
    .catch(function (err) {

      console.error(err);

      res.render('index', {
        title: 'ToDo App',
        isAuth: isAuth,
        errorMessage: [err.sqlMessage],
      });

    });

});

router.post('/delete/:id', function (req, res, next) {

  const taskId = req.params.id;

  knex("tasks")
    .where({
      id: taskId
    })
    .del()
    .then(function () {

      res.redirect('/');

    })
    .catch(function (err) {

      console.error(err);

      res.status(500).send("delete error");

    });

});



// FullCalendar用API
router.get('/calendar/events', function (req, res) {

  const userId = req.user.id;

  knex("tasks")
    .select(
      "content",
      "start_date",
      "end_date",
      "start_time",
      "end_time"
    )
    .where({
      user_id: userId
    })
    .then(function (results) {


      const events = results
        .filter(task => task.start_date && task.end_date)
        .map(function (task) {


          const startDate =
            new Date(task.start_date)
              .toISOString()
              .split('T')[0];


          const endDate =
            new Date(task.end_date)
              .toISOString()
              .split('T')[0];


          return {

            title: task.content,

            start:
              startDate +
              "T" +
              task.start_time,

            end:
              endDate +
              "T" +
              task.end_time

          };


        });


      res.json(events);


    })
    .catch(function (err) {

      console.error(err);

      res.status(500).json({
        error: err
      });

    });

});

router.use('/signup', require('./signup'));
router.use('/signin', require('./signin'));
router.use('/logout', require('./logout'));


module.exports = router;
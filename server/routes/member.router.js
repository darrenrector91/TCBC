const express = require('express');
const encryptLib = require('../modules/encryption');
const userStrategy = require('../strategies/sql.localstrategy');
const isAuthenticated = require('../modules/isAuthenticated');
const pool = require('../modules/pool.js');
const router = express.Router();

router.get('/viewProfile', isAuthenticated, function (req, res) {
     ('in viewProfile event');
     ('this is the user', req.user);
  const queryText =
    `SELECT *
      FROM member_info
      WHERE member_id = $1`;
  pool.query(queryText, [req.user.member_id])
    .then((result) => {
         ('query results:', result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
         ('error making query:', err);
      res.sendStatus(500);
    });
});

router.get('/userRole', isAuthenticated, function (req, res) {
     ('in get user role router');
  const queryText =
    `SELECT
    id,
    role
    FROM 
    user_roles
    ORDER BY 
    id ASC`;
  pool.query(queryText)
    .then((result) => {
         ('query get user role results:', result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
         ('error making query:', err);
      res.sendStatus(500);
    });
});

router.get('/findRider/riderInfo/:first_name/:last_name/:member_id', isAuthenticated, function (req, res) {
  
  const queryText =
    ` SELECT users.id AS user_id, 
    users.first_name, 
    users.last_name, 
    users.member_id, 
    user_roles.id AS role_id, 
    user_roles.role
    FROM users 
    JOIN user_roles 
    ON users.role = user_roles.id
    WHERE member_id = $1
    OR first_name ILIKE $2
    OR last_name ILIKE $3
    ORDER BY member_id ASC;`
  pool.query(queryText, [req.params.member_id, '%' + req.params.first_name + '%' , '%' + req.params.last_name + '%'])
    .then((result) => {
         ('result of search for person: ', result.rows);
      
      res.send(result.rows);
    })
    .catch((err) => {
         ('error making member search query:', err);
      res.sendStatus(500);
    });
});


router.put(`/changeRole`, isAuthenticated, function (req, res) {
  let memID = req.body.member_id;
  const queryText =
    `UPDATE users
  SET role = $1
  WHERE member_id = $2;`
  pool.query(queryText, [req.body.role.id, memID])
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
         ('error changing user role:', err);
      res.sendStatus(500);
    })
})

router.get(`/adminViewMemberPastRides/:user_id`, isAuthenticated, function (req, res) {
     ('in past rides router');
  let userID = req.params.user_id;
  const queryText = `
    SELECT * 
    FROM rides
    JOIN rides_users on rides_users.ride_id = rides.id
    WHERE rides_users.user_id = $1
    AND rides.completed = true
    AND rides.cancelled = false
    AND rides.approved = true;`
  pool.query(queryText, [userID])
    .then((result) => {
         ('query results for past rides ', result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
         ('error getting user past rides ', err);
      res.sendStatus(500);
    })

})


router.get('/stats/goal', isAuthenticated, (req, res)=>{
  
  const userId = req.user.id;
  const getGoalQuery = `
  SELECT goal
  FROM users
  WHERE users.id = $1;`
   pool.query(getGoalQuery,[userId])
    .then((result)=>{
         ('GET goal for User: ', result.rows);
      
      res.send(result.rows);
    })
    .catch((err)=>{
      res.sendStatus(500);
    })
})

router.put('/stats/goal', isAuthenticated, (req, res)=>{
     ('SET stats Goal: ', req.body , 'for user: ', req.user);
  
  const userId = req.user.id;
  const newGoal = req.body.setGoal;
  const setGoalQuery = `
    UPDATE users
    SET goal = $1
    WHERE id = $2`;
  
  pool.query(setGoalQuery,[newGoal, userId])
    .then((result)=>{
      res.sendStatus(201);
    })
    .catch((err)=>{
         ('error updating goal: ', err);
      res.sendStatus(500);
    }) 
})














module.exports = router;
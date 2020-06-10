const express = require('express');
const route = express.Router();
const { email } = require('./utils/connection');

route
  .route('/')
  .get((req, res) => {
    res.json({ message: 'Hello world' });
  })
  .post((req, res) => {
    email.create(
      {
        emailId: req.body.email,
      },
      (err, data) => {
        if (err) {
          console.log('--post', err);
          res.status(500).json({ message: 'Error' });
        } else {
          res.status(200).json(data);
        }
      }
    );
  });
route.delete('/:id', (req, res) => {
  console.log(req.params.id);

  email.findByIdAndDelete(req.params.id.trim(), (err, data) => {
    if (err) {
      console.log('--delete', err);
      res.status(500).json({ message: 'Error' });
    } else {
      res.status(200).json({ deleted: data });
    }
  });
});

module.exports = route;

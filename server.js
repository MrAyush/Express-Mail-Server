require('dotenv').config();
const express = require('express');
const app = express();
const route = require('./routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', route);

app.listen(process.env.PORT, () => {
  console.log(`server started ${process.env.PORT}`);
});

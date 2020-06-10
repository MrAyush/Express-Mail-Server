const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const sendmail = require('sendmail')({
  devPort: process.env.DEV_PORT, 
  devHost: process.env.DEV_HOST, 
  smtpPort: process.env.SMTP_PORT, 
  smtpHost: process.env.SMTP_HOST,
});
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);

const emailSchema = new Schema({
  emailId: {
    type: String,
    unique: true,
    validate: [
      function (val) {
        return /^[a-zA-Z]*[a-zA-Z0-9_]*@[a-z]{2,7}.[a-z.]{2,7}$/.test(val);
      },
      'Invalid Email',
    ],
  },
});

mongoose.connect(process.env.DB_CONNECTION).then((db) => {
  const email = db.connection.collection('emails');
  const changeStream = email.watch();
  changeStream.on('change', (data) => {
    // console.log(data);
    if (data.operationType === 'insert') {
      sendmail(
        {
          from: 'no-reply@watchDBtest.com',
          to: data.fullDocument.emailId,
          subject: 'Welcome Test Mail',
          html:
            'This is a computer generated email used for testing change stream in mongoDB',
        },
        (err, reply) => {
          console.log('--err', err);
          console.log('--reply', reply);
        }
      );
      console.log('New id added in database', data);
    }
  });
});
exports.email = mongoose.model('emails', emailSchema);

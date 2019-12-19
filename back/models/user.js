const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  dateOfRegistration: Date,
  email: {
    address: String,
    verified: Boolean
  },
  password: String,
  files: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File'
    }
  ],
  co_owned: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File'
    }
  ]
});

userSchema.set('toJSON', { // rObj = object that being returned
  transform: (document, rObj) => {
    rObj.id = rObj._id.toString();
    delete password;
    delete rObj._id;
    delete rObj.__v;
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  dateOfRegistration: Date,
  username: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    address: {
      type: String,
      required: true
    },
    verified: Boolean
  },
  password: {
    type: String,
    required: true
  },
  spaceAccess: {
    type: Number,
    required: true
  },
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
    delete rObj.password;
    delete rObj._id;
    delete rObj.__v;
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
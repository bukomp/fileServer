const mongoose = require('mongoose');

const fileSchema = mongoose.Schema({
  name: String,
  size: Number,
  path: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  co_owners: [
    {
      permissions: {
        download: Boolean,
        view: Boolean,
        edit: Boolean
      },
      user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ],
});

fileSchema.set('toJSON', { // rObj = object that being returned
  transform: (document, rObj) => {
    rObj.id = rObj._id.toString();
    delete rObj._id;
    delete rObj.__v;
  }
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['Principal', 'Teacher', 'Student']
    },  
    rollNo: {
        type: String,
        required: function () {
          return this.role === "Student"; // Required only for students
        },
      },
      classroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classroom",
        required: function () {
          return this.role === "Student"; // Required only for students
        },
      },
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;

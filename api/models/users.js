
//importing dependencies
const mongoose = require('mongoose')
const { SYSTEM_ROLES_ENUM } = require('../../config/constants')

const usersSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true,"Must provide user first name"],
      trim: true
    },
    lastName: {
      type: String,
      required:[true,"Must provide user last name"],
      trim: true
    },
    employee: {
      type: mongoose.Types.ObjectId,
      ref:'Employee'
    },
    email: {
      type: String,
      required:[true,"Must provide user email"],
      unique: true,
    },
    phoneNumber: {
      type: String,
      required:true
    },
    password: {
      type: String,
      required:[true,"Must provide user last name"],
      // maxLength:[12,"Please provide atmost 12 chracters password"],
    },
    uniqueKeys: {
      type: [String]
    },
    OTP: {
      type: String
    },
    systemRole: {
      type: String,
      enum: SYSTEM_ROLES_ENUM
    },
    resetPasswordToken: {type:String},
    resetPaswordExpire: {type:Date},
  },
  {
    timestamps: true,
    strict: true,
    collection: 'users'
  }
)

module.exports = mongoose.model('User', usersSchema)

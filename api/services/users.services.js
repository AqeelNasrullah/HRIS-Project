//importing model
const UsersModel = require('../models/users')

const createUser = async user => {
  try {
    const newUser = new UsersModel(user)

    return await newUser.save()
  } catch (error) {
    throw error
  }
}

const getUserById = async userId => {
  try {
    const user = await UsersModel.findById(userId).select({password:0,resetPasswordToken:0,resetPaswordExpire:0,createdAt:0,updatedAt:0,__v:0}).lean()

    return user
  } catch (error) {
    throw error
  }
}

const getDetailedUserById = async userId => {
  try {
    const user = await UsersModel.findById(userId).populate('employee').select({password:0,uniqueKeys:0,resetPasswordToken:0,resetPaswordExpire:0,createdAt:0,updatedAt:0,__v:0}).lean()

    return user
  } catch (error) {
    throw error
  }
}

const getUserExistance = async ({ email}) => {
  try {
    const existingUser = await UsersModel.findOne({
       email: { $eq: email } 
    }).select({uniqueKeys:0,resetPasswordToken:0,resetPaswordExpire:0,createdAt:0,updatedAt:0,__v:0}).lean()

    return existingUser
  } catch (error) {
    throw error
  }
}

const updateUser = async ( {userId, dataToUpdate} ) => {
  try {
    console.log(userId,dataToUpdate);
    const userUpdated = await UsersModel.findByIdAndUpdate(userId, dataToUpdate, {
      new: true
      // upsert: true
    }).select({password:0,uniqueKeys:0,resetPasswordToken:0,resetPaswordExpire:0,createdAt:0,updatedAt:0,__v:0})

    return userUpdated
  } catch (error) {
    throw error
  }
}

//find user against reset token
const userResetToken = async (token) => {
  try {
    return await UsersModel
      .findOne({
        resetPasswordToken: token,
        resetPaswordExpire: { $gt: Date.now() },
      })
      .lean();
  } catch (error) {
    throw error;
  }
};

// const verifyOTP = async ({ userId, OTP }) => {
//   try {
//     const user = await UsersMOdel.findOne({ _id: userId, OTP })
//       .lean()
//       .select('-password')

//     console.log('*** OTP verified ***', user)

//     return user
//   } catch (error) {
//     throw error
//   }
// }

module.exports = {
  createUser,
  getUserExistance,
  getUserById,
  updateUser,
  userResetToken,
  getDetailedUserById
  // verifyOTP
}

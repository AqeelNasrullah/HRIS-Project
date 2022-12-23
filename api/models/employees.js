//importing dependencies
const mongoose = require("mongoose");
const {
  EMPLOYEE_STATUS,
  EMPLOYEE_GENDER,
  EMPLOYEE_MARITAL_STATUS,
  EMPLOYEE_SHIRT_SIZE,
  EMPLOYEE_PAY_SCHEDULE,
  EMPLOYEE_PAY_TYPE,
  EMPLOYEE_OVERTIME_STATUS,
  EMPLOYEE_PAY_CHANGE_REASON,
  EMPLOYEE_PAY_PER,
  EMPLOYEE_DEGREE,
  EMPLOYMENT_STATUS,
  TASKS_STATUS,
  BENEFITS_STATUS,
  DOCUMENT_CATEGORY
} = require("../../config/constants");

const employeeSchema = new mongoose.Schema(
  {
    hireDate: {
      type: Date,
    },
    profileImage: {
      type: String,
    },
    basicInformation: {
      firstName: {
        type: String,
        required: [true, "Please provide first name of employee"],
        trim: true,
      },
      lastName: {
        type: String,
        required: [true, "Please provide first name of employee"],
        trim: true,
      },
      DOB: {
        type: Date,
      },
      gender: {
        type: String,
        enum: EMPLOYEE_GENDER,
      },
      maritalStatus: {
        type: String,
        enum: EMPLOYEE_MARITAL_STATUS,
      },
      SSN: {
        type: String,
        required: [true, "Please provide SSN of employee"],
        unique: true,
      },
      shirtSize: {
        type: String,
        enum: EMPLOYEE_SHIRT_SIZE,
      },
      allergies: {
        type: [String],
      },
    },
    address: {
      house: {
        type: String,
        trim: true,
      },
      streetNumber: {
        type: String,
        trim: true,
      },
      postalCode: {
        type: Number,
      },
      city: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
    },
    contact: {
      phoneNumber: {
        type: String,
        required: [true, "Please provide phone number of employee"],
        trim: true,
      },
      email: {
        type: String,
        unique: true,
        trim: true,
      },
    },
    education: [
      {
        institute: {
          type: String,
          trim: true,
        },
        degree: {
          type: String,
          enum: EMPLOYEE_DEGREE,
        },
        major: {
          type: String,
          trim: true,
        },
        CGPA: {
          type: Number,
        },
        startDate: {
          type: Date,
        },
        endDate: {
          type: Date,
        },
      },
    ],
    jobDescription: [
      {
        effectiveDate: { type: Date },
        job: {
          type: mongoose.Types.ObjectId,
          ref: "Job",
        },
        reportsTo: {
          type: mongoose.Types.ObjectId,
          ref: "Employee",
        },
      },
    ],
    compensation: [
      {
        effectiveDate: {
          type: Date,
        },
        paySchedule: {
          type: String,
          enum: EMPLOYEE_PAY_SCHEDULE,
        },
        payType: {
          type: String,
          enum: EMPLOYEE_PAY_TYPE,
        },
        payRate: {
          type: Number,
        },
        payPer: {
          type: String,
          enum: EMPLOYEE_PAY_PER,
        },
        overtimeStatus: {
          type: String,
          enum: EMPLOYEE_OVERTIME_STATUS,
        },
        changeReason: {
          type: String,
          enum: EMPLOYEE_PAY_CHANGE_REASON,
        },
        comment: {
          type: String,
          trim: true,
        },
      },
    ],
    employment: {
      effectiveDate: { type: Date },
      employmentStatus: { type: String, enum: EMPLOYMENT_STATUS },
      comment: { type: String, trim: true },
    },
    onboarding: [
      {
        onboardingTask: {
          type: mongoose.Types.ObjectId,
          ref: "Onboarding",
        },
        date: {
          type: Date,
        },
        status: {
          type: String,
          enum: TASKS_STATUS,
          default:TASKS_STATUS[0]
        },
        description:{
          type:String,
          trim:true
        }
      },
    ],
    offboarding: [
      {
        offboardingTask: {
          type: mongoose.Types.ObjectId,
          ref: "Offboarding",
        },
        date: {
          type: Date,
        },
        status: {
          type: String,
          enum: TASKS_STATUS,
          default:TASKS_STATUS[0]
        },
        description:{
          type:String,
          trim:true
        }
      },
    ],
    status: {
      type: String,
      enum: EMPLOYEE_STATUS,
      default: EMPLOYEE_STATUS[0],
    },
    benefits: [
      {
        benefitId: {
          type: mongoose.Types.ObjectId,
          ref: "Benefit",
        },
        effectiveDate: {
          type: Date,
        },
        employeePays: {
          type: Number,
        },
        status: {
          type: String,
          enum: BENEFITS_STATUS,
        },
      },
    ],
    documents:[
      {
        category: {
          type: String,
          enum: DOCUMENT_CATEGORY,
        },
        documentUrl: {
          type: String,
        }
      }
    ]
  },
  {
    timestamps: true,
    strict: true,
    collection: "employees",
  }
);

module.exports = mongoose.model("Employee", employeeSchema);

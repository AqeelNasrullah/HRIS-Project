//importing services
const Employees = require("../services/employee.services");
const { getExistingJobById } = require("../services/jobs.services");
const {
  getExistingOnboardingById,
} = require("../services/onboardings.services");
const {
  getExistingOffboardingById,
} = require("../services/offboardings.services");
const { getExistingBenefitById } = require("../services/benefits.services");
const { getEmployeeAssets } = require("../services/assets.services");
const { getEmployeeTimeoff } = require("../services/timeoffs.services");

//importing middlewares
const asyncErrorHandler = require("../middlewares/errors/asyncErrorHandler");

//impoting utils
const ErrorHandler = require("../utils/classes/errorHandler");
const sendResponse = require("../utils/sendResponse");

//importing constants
const { EMPLOYEE_STATUS } = require("../../config/constants");

//methods

/*  ---------EMPLOYEE PERSONAL INFO----------- */
//creating Employee
const createEmployee = asyncErrorHandler(async (req, res, next) => {
  const employee = req.body;
  if (!req.body.hireDate) {
    employee.hireDate = Date.now();
  }

  //if Employee exists?
  const existedEmployee = await Employees.getExistingEmployee(
    employee.basicInformation.SSN
  );

  if (existedEmployee) {
    return next(
      new ErrorHandler("This SSN already belongs to other employee", 409)
    );
  }

  // creating employee
  const createdEmployee = await Employees.employeeCreate(employee);

  if (!createdEmployee) {
    return next(new ErrorHandler("INTERNAL SERVER ERROR", 500));
  }

  sendResponse({ createdEmployee }, 201, res);
});

//upload profile Image
const uploadProfileImage = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.query;
  const { fileName } = req;

  if (!fileName) {
    return next(new ErrorHandler("Please provide file", 404));
  }

  //checking existance
  const existedEmployee = await Employees.getEmployeeById(_id);
  if (!existedEmployee) {
    return next(new ErrorHandler("Employee with given Id doesn't exists", 404));
  }

  //uploading
  const toBeUpdate = {
    profileImage: `uploads/${fileName}`,
  };
  const updatedEmployee = await Employees.employeePersonalInfoUpdate(
    _id,
    toBeUpdate
  );
  if (!updatedEmployee) {
    return next(new ErrorHandler("Updation Failed.", 500));
  }

  return sendResponse({ updatedEmployee }, 200, res);
});

//get all Employees
const findAllEmployees = asyncErrorHandler(async (req, res, next) => {
  const query = req.query;
  const { result } = req.query;
  const allEmployees = await Employees.getAllEmployees(query, result);
  const countedEmployees = allEmployees.length;
  if (!allEmployees) {
    return next(new ErrorHandler("Not a single employee found", 404));
  }
  return sendResponse({ countedEmployees, allEmployees }, 200, res);
});

//get single Employee
const getEmployee = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.query;
  const existedEmployee = await Employees.getEmployeeById(_id);
  if (!existedEmployee) {
    return next(new ErrorHandler("Employee with given Id doesn't exists", 404));
  }

  return sendResponse({ existedEmployee }, 200, res);
});

//update Employee
const updateEmployee = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.query;
  //checking existance
  const existedEmployee = await Employees.getEmployeeById(_id);
  if (!existedEmployee) {
    return next(new ErrorHandler("Employee with given Id doesn't exists", 404));
  }

  //updating
  const toBeUpdate = req.body;
  const updatedEmployee = await Employees.employeePersonalInfoUpdate(
    _id,
    toBeUpdate
  );
  if (!updatedEmployee) {
    return next(new ErrorHandler("Updation Failed.", 500));
  }

  return sendResponse({ updatedEmployee }, 200, res);
});

// remove Employee
const deleteEmployee = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.query;
  //checing existance
  const existedEmployee = await Employees.getEmployeeById(_id);
  if (!existedEmployee) {
    return next(new ErrorHandler("Employee with given Id doesn't exists", 404));
  }

  //removing
  const toBeUpdate = { status: EMPLOYEE_STATUS[1] };
  const deletedEmployee = await Employees.employeePersonalInfoUpdate(
    _id,
    toBeUpdate
  );
  return sendResponse({ deletedEmployee }, 200, res);
});

/*  ---------EMPLOYEE EDUCATION INFO----------- */
//add education of  Employee
const addEducation = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.query;
  //checking employee existance
  const existedEmployee = await Employees.getEmployeeById(_id);
  if (!existedEmployee) {
    return next(new ErrorHandler("Employee with given Id doesn't exists", 404));
  }

  if (existedEmployee.education.length > 0) {
    //checking existance of degree
    const existed = existedEmployee.education?.find(
      (edu) => edu.degree === req.body.degree && edu.major === req.body.major
    );
    if (existed) {
      return next(
        new ErrorHandler("This degree has already added with same major", 409)
      );
    }
  }

  //updating
  existedEmployee.education.push(req.body);
  const toBeUpdate = { education: existedEmployee.education };
  const updatedEmployee = await Employees.employeePersonalInfoUpdate(
    _id,
    toBeUpdate
  );
  if (!updatedEmployee) {
    return next(new ErrorHandler("Updation Failed.", 500));
  }

  return sendResponse({ updatedEmployee }, 200, res);
});

//update education of  Employee
const updateEducation = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.query;
  //checking employee existance
  const existedEmployee = await Employees.getEmployeeById(_id);
  if (!existedEmployee) {
    return next(new ErrorHandler("Employee with given Id doesn't exists", 404));
  }

  const { educationId } = req.params;

  //checking existance of education for same emplooyee
  const educationExistance = existedEmployee.education?.find((edu) =>
    edu._id.equals(educationId)
  );
  if (!educationExistance) {
    return next(
      new ErrorHandler(
        "Education with this doesn't belong to this employee",
        404
      )
    );
  }
  //checking existance of time
  if (req.body.degree) {
    if (!req.body.major) {
      return next(new ErrorHandler("Please provide major also", 400));
    }
    //checking existance of degree for same employee
    const existed = existedEmployee.education?.find(
      (edu) => edu.degree === req.body.degree && edu.major === req.body.major
    );
    if (existed) {
      return next(
        new ErrorHandler("This degree has already added with same major", 409)
      );
    }
  }

  //updating
  educationExistance.institute = req.body.institute
    ? req.body.institute
    : educationExistance.institute;
  educationExistance.major = req.body.major
    ? req.body.major
    : educationExistance.major;
  educationExistance.CGPA = req.body.CGPA
    ? req.body.CGPA
    : educationExistance.CGPA;
  educationExistance.startDate = req.body.startDate
    ? req.body.startDate
    : educationExistance.startDate;
  educationExistance.endDate = req.body.endDate
    ? req.body.endDate
    : educationExistance.endDate;
  educationExistance.degree = req.body.degree
    ? req.body.degree
    : educationExistance.degree;

  const toBeUpdate = { education: existedEmployee.education };
  const updatedEmployee = await Employees.employeePersonalInfoUpdate(
    _id,
    toBeUpdate
  );
  if (!updatedEmployee) {
    return next(new ErrorHandler("Updation Failed.", 500));
  }

  return sendResponse({ updatedEmployee }, 200, res);
});

/*  ---------EMPLOYEE JOB INFO----------- */
//add job of Employee
const addJob = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.query;
  //checking employee existance
  const existedEmployee = await Employees.getExistingEmployeeById(_id);
  if (!existedEmployee) {
    return next(new ErrorHandler("Employee with given Id doesn't exists", 404));
  }

  if (existedEmployee.jobDescription.length > 0) {
    const existedEffectiveDate = existedEmployee.jobDescription?.find(
      (jobdes) => jobdes.effectiveDate.toJSON() === req.body.effectiveDate
    );
    if (existedEffectiveDate) {
      return next(
        new ErrorHandler("Job already added in same effective date", 404)
      );
    }
  }

  //checking existance of job for same emplooyee
  const existed = existedEmployee.jobDescription?.find((jobdes) =>
    jobdes.job.equals(req.body.job)
  );
  if (existed) {
    return next(
      new ErrorHandler(
        "Job with given Id already assigned to this employee",
        400
      )
    );
  }

  //checking job existance
  const existedJob = await getExistingJobById(req.body.job);
  if (!existedJob) {
    return next(new ErrorHandler("Job with given Id doesn't exists", 404));
  }

  //checkimg reporting employee existance
  if (req.body.reportsTo) {
    if (_id === req.body.reportsTo) {
      return next(
        new ErrorHandler("Employee cannot report to him/herself", 400)
      );
    }
    const reportedEmployee = await Employees.getExistingEmployeeById(
      req.body.reportsTo
    );
    if (!reportedEmployee) {
      return next(
        new ErrorHandler(
          "Employee for reporting with given Id doesn't exists",
          404
        )
      );
    }
  }

  //updating
  existedEmployee.jobDescription.push(req.body);
  const toBeUpdate = { jobDescription: existedEmployee.jobDescription };
  const updatedEmployee = await Employees.employeeUpdate(_id, toBeUpdate);
  if (!updatedEmployee) {
    return next(new ErrorHandler("Updation Failed.", 500));
  }

  return sendResponse({ updatedEmployee }, 200, res);
});

//update job of Employee
const updateJob = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.query;
  const { jobId } = req.params;

  //checking employee existance
  const existedEmployee = await Employees.getExistingEmployeeById(_id);
  if (!existedEmployee) {
    return next(new ErrorHandler("Employee with given Id doesn't exists", 404));
  }

  //checking existance of job for same emplooyee
  const jobExistance = existedEmployee.jobDescription?.find((jobdes) =>
    jobdes._id.equals(jobId)
  );
  if (!jobExistance) {
    return next(
      new ErrorHandler("Job with this id never assigned to this employee", 400)
    );
  }

  //checking existance of job for same emplooyee
  if (req.body.job) {
    const existed = existedEmployee.jobDescription?.find((jobdes) =>
      jobdes.job.equals(req.body.job)
    );
    if (existed) {
      return next(
        new ErrorHandler(
          "Job with given Id already assigned to this employee",
          400
        )
      );
    }
    //checking job existance
    const existedJob = await getExistingJobById(req.body.job);
    if (!existedJob) {
      return next(new ErrorHandler("Job with given Id doesn't exists", 404));
    }
  }

  //checking effective date
  if (req.body.effectiveDate) {
    const existedEffectiveDate = existedEmployee.jobDescription?.find(
      (jobdes) => jobdes.effectiveDate.toJSON() === req.body.effectiveDate
    );
    if (existedEffectiveDate) {
      return next(
        new ErrorHandler("Job already added in same effective date", 404)
      );
    }
  }

  //checkimg reporting employee existance
  if (req.body.reportsTo) {
    if (_id === req.body.reportsTo) {
      return next(
        new ErrorHandler("Employee cannot report to him/herself", 400)
      );
    }
    const reportedEmployee = await Employees.getExistingEmployeeById(
      req.body.reportsTo
    );
    if (!reportedEmployee) {
      return next(
        new ErrorHandler(
          "Employee for reporting with given Id doesn't exists",
          404
        )
      );
    }
  }
  jobExistance.effectiveDate = req.body.effectiveDate
    ? req.body.effectiveDate
    : jobExistance.effectiveDate;
  jobExistance.job = req.body.job ? req.body.job : jobExistance.job;
  jobExistance.reportsTo = req.body.reportsTo
    ? req.body.reportsTo
    : jobExistance.reportsTo;

  //updating
  const toBeUpdate = { jobDescription: existedEmployee.jobDescription };
  const updatedEmployee = await Employees.employeeUpdate(_id, toBeUpdate);
  if (!updatedEmployee) {
    return next(new ErrorHandler("Updation Failed.", 500));
  }

  return sendResponse({ updatedEmployee }, 200, res);
});

//get all jobs,employment and compensation of employee
const findAllJobs = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.query;
  const employee = await Employees.getAllJobs(_id);
  if (!employee) {
    return next(new ErrorHandler("Employee with this id doesn't exists", 404));
  }
  return sendResponse({ employee }, 200, res);
});

/*  ---------EMPLOYEE COMPENSATION INFO----------- */
//add compensation of  Employee
const addCompensation = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.query;
  //checking employee existance
  const existedEmployee = await Employees.getExistingEmployeeById(_id);
  if (!existedEmployee) {
    return next(new ErrorHandler("Employee with given Id doesn't exists", 404));
  }

  if (existedEmployee.compensation.length > 0) {
    //checking existance of time
    const existed = existedEmployee.compensation?.find(
      (com) => com.effectiveDate.toJSON() === req.body.effectiveDate
    );
    if (existed) {
      return next(
        new ErrorHandler(
          "Compensation already added in same effective date",
          404
        )
      );
    }
  }

  //updating
  existedEmployee.compensation.push(req.body);
  const toBeUpdate = { compensation: existedEmployee.compensation };
  const updatedEmployee = await Employees.employeeUpdate(_id, toBeUpdate);
  if (!updatedEmployee) {
    return next(new ErrorHandler("Updation Failed.", 500));
  }

  return sendResponse({ updatedEmployee }, 200, res);
});

//update compensation of  Employee
const updateCompensation = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.query;
  //checking employee existance
  const existedEmployee = await Employees.getExistingEmployeeById(_id);
  if (!existedEmployee) {
    return next(new ErrorHandler("Employee with given Id doesn't exists", 404));
  }

  const { compensationId } = req.params;
  //checking existance of compensation for same emplooyee
  const compensationExistance = existedEmployee.compensation?.find((com) =>
    com._id.equals(compensationId)
  );
  if (!compensationExistance) {
    return next(
      new ErrorHandler(
        "Compensation with this id has never given to this employee",
        400
      )
    );
  }
  //checking existance of time
  if (req.body.effectiveDate) {
    const existed = existedEmployee.compensation?.find(
      (com) => com.effectiveDate.toJSON() === req.body.effectiveDate
    );
    if (existed) {
      return next(
        new ErrorHandler(
          "Compensation already added in same effective date",
          400
        )
      );
    }
  }

  //updating
  compensationExistance.effectiveDate = req.body.effectiveDate
    ? req.body.effectiveDate
    : compensationExistance.effectiveDate;
  compensationExistance.paySchedule = req.body.paySchedule
    ? req.body.paySchedule
    : compensationExistance.paySchedule;
  compensationExistance.payType = req.body.payType
    ? req.body.payType
    : compensationExistance.payType;
  compensationExistance.payRate = req.body.payRate
    ? req.body.payRate
    : compensationExistance.payRate;
  compensationExistance.payPer = req.body.payPer
    ? req.body.payPer
    : compensationExistance.payPer;
  compensationExistance.overtimeStatus = req.body.overtimeStatus
    ? req.body.overtimeStatus
    : compensationExistance.overtimeStatus;
  compensationExistance.changeReason = req.body.changeReason
    ? req.body.changeReason
    : compensationExistance.changeReason;
  compensationExistance.comment = req.body.comment
    ? req.body.comment
    : compensationExistance.comment;

  const toBeUpdate = { compensation: existedEmployee.compensation };
  const updatedEmployee = await Employees.employeeUpdate(_id, toBeUpdate);
  if (!updatedEmployee) {
    return next(new ErrorHandler("Updation Failed.", 500));
  }

  return sendResponse({ updatedEmployee }, 200, res);
});

/*  ---------EMPLOYEE EMPLOYMENT INFO----------- */
//add  employment
const employment = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.query;
  //checking employee existance
  const existedEmployee = await Employees.getExistingEmployeeById(_id);
  if (!existedEmployee) {
    return next(new ErrorHandler("Employee with given Id doesn't exists", 404));
  }
  existedEmployee.employment = {
    effectiveDate: req.body.effectiveDate,
    employmentStatus: req.body.employmentStatus,
    comment: req.body.comment,
  };

  const toBeUpdate = { employment: existedEmployee.employment };
  const updatedEmployee = await Employees.employeeUpdate(_id, toBeUpdate);
  if (!updatedEmployee) {
    return next(new ErrorHandler("Updation Failed.", 500));
  }

  return sendResponse({ updatedEmployee }, 200, res);
});

//update  employment
const updateEmployment = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.query;
  //checking employee existance
  const existedEmployee = await Employees.getExistingEmployeeById(_id);
  if (!existedEmployee) {
    return next(new ErrorHandler("Employee with given Id doesn't exists", 404));
  }

  //updating
  existedEmployee.employment.effectiveDate = req.body.effectiveDate
    ? req.body.effectiveDate
    : existedEmployee.employment.effectiveDate;
  existedEmployee.employment.employmentStatus = req.body.employmentStatus
    ? req.body.employmentStatus
    : existedEmployee.employment.employmentStatus;
  existedEmployee.employment.comment = req.body.comment
    ? req.body.comment
    : existedEmployee.employment.comment;
  const toBeUpdate = { employment: existedEmployee.employment };
  const updatedEmployee = await Employees.employeeUpdate(_id, toBeUpdate);
  if (!updatedEmployee) {
    return next(new ErrorHandler("Updation Failed.", 500));
  }

  return sendResponse({ updatedEmployee }, 200, res);
});

/*  ---------EMPLOYEE ONBOARDING INFO----------- */
//add ONBOARDING TASKS of Employee
const addOnboarding = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.query;
  //checking employee existance
  const existedEmployee = await Employees.getExistingEmployeeById(_id);
  if (!existedEmployee) {
    return next(new ErrorHandler("Employee with given Id doesn't exists", 404));
  }

  if (existedEmployee.jobDescription.length > 0) {
    //checking existance of task for same emplooyee
    const existed = existedEmployee.onboarding?.find((task) =>
      task.onboardingTask.equals(req.body.onboardingTask)
    );
    if (existed) {
      return next(
        new ErrorHandler(
          "Task with given Id has already assigned to this employee",
          400
        )
      );
    }
  }

  //checking task existance
  const existedTask = await getExistingOnboardingById(req.body.onboardingTask);
  if (!existedTask) {
    return next(new ErrorHandler("Task with given Id doesn't exists", 404));
  }

  //updating
  existedEmployee.onboarding.push(req.body);
  const toBeUpdate = { onboarding: existedEmployee.onboarding };
  const updatedEmployee = await Employees.employeeUpdate(_id, toBeUpdate);
  if (!updatedEmployee) {
    return next(new ErrorHandler("Updation Failed.", 500));
  }

  return sendResponse({ updatedEmployee }, 200, res);
});

//update ONBOARDING TASKS of Employee
const updateOnboarding = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.query;
  //checking employee existance
  const existedEmployee = await Employees.getExistingEmployeeById(_id);
  if (!existedEmployee) {
    return next(new ErrorHandler("Employee with given Id doesn't exists", 404));
  }

  const { taskId } = req.params;
  //checking existance of task for same emplooyee
  const taskExistance = existedEmployee.onboarding?.find((task) =>
    task._id.equals(taskId)
  );
  if (!taskExistance) {
    return next(
      new ErrorHandler(
        "Task with this id has never given to this employee",
        400
      )
    );
  }

  //checking existance of task for same emplooyee
  if (req.body.onboardingTask) {
    const existed = existedEmployee.onboarding?.find((task) =>
      task.onboardingTask.equals(req.body.onboardingTask)
    );
    if (existed) {
      return next(
        new ErrorHandler(
          "Task with given Id has already assigned to this employee",
          400
        )
      );
    }
    //checking task existance
    const existedTask = await getExistingOnboardingById(
      req.body.onboardingTask
    );
    if (!existedTask) {
      return next(new ErrorHandler("Task with given Id doesn't exists", 404));
    }
  }

  taskExistance.onboardingTask = req.body.onboardingTask
    ? req.body.onboardingTask
    : taskExistance.onboardingTask;
  taskExistance.date = req.body.date ? req.body.date : taskExistance.date;
  taskExistance.status = req.body.status
    ? req.body.status
    : taskExistance.status;
  taskExistance.description = req.body.description
    ? req.body.description
    : taskExistance.description;
  //updating
  const toBeUpdate = { onboarding: existedEmployee.onboarding };
  const updatedEmployee = await Employees.employeeUpdate(_id, toBeUpdate);
  if (!updatedEmployee) {
    return next(new ErrorHandler("Updation Failed.", 500));
  }

  return sendResponse({ updatedEmployee }, 200, res);
});

/*  ---------EMPLOYEE OFFBOARDING INFO----------- */
//add OffBOARDING TASKS of Employee
const addOffboarding = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.query;
  //checking employee existance
  const existedEmployee = await Employees.getExistingEmployeeById(_id);
  if (!existedEmployee) {
    return next(new ErrorHandler("Employee with given Id doesn't exists", 404));
  }

  //checkimg inactive employee
  if (existedEmployee.status === EMPLOYEE_STATUS[0]) {
    return next(
      new ErrorHandler(
        "Currently employee with given Id is active. To perform offboarding tasks terminate employee.",
        404
      )
    );
  }

  if (existedEmployee.jobDescription.length > 0) {
    //checking existance of task for same emplooyee
    const existed = existedEmployee.offboarding?.find((task) =>
      task.offboardingTask.equals(req.body.offboardingTask)
    );
    if (existed) {
      return next(
        new ErrorHandler(
          "Task with given Id has already assigned to this employee",
          400
        )
      );
    }
  }

  //checking task existance
  const existedTask = await getExistingOffboardingById(
    req.body.offboardingTask
  );
  if (!existedTask) {
    return next(new ErrorHandler("Task with given Id doesn't exists", 404));
  }

  //updating
  existedEmployee.offboarding.push(req.body);
  const toBeUpdate = { offboarding: existedEmployee.offboarding };
  const updatedEmployee = await Employees.employeeUpdate(_id, toBeUpdate);
  if (!updatedEmployee) {
    return next(new ErrorHandler("Updation Failed.", 500));
  }

  return sendResponse({ updatedEmployee }, 200, res);
});

//update ONBOARDING TASKS of Employee
const updateOffboarding = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.query;
  //checking employee existance
  const existedEmployee = await Employees.getExistingEmployeeById(_id);
  if (!existedEmployee) {
    return next(new ErrorHandler("Employee with given Id doesn't exists", 404));
  }

  const { taskId } = req.params;
  //checking existance of task for same emplooyee
  const taskExistance = existedEmployee.offboarding?.find((task) =>
    task._id.equals(taskId)
  );
  if (!taskExistance) {
    return next(
      new ErrorHandler(
        "Task with this id has never given to this employee",
        400
      )
    );
  }

  //checking existance of task for same emplooyee
  if (req.body.offboardingTask) {
    const existed = existedEmployee.offboarding?.find((task) =>
      task.offboardingTask.equals(req.body.offboardingTask)
    );
    if (existed) {
      return next(
        new ErrorHandler(
          "Task with given Id has already assigned to this employee",
          400
        )
      );
    }
    //checking task existance
    const existedTask = await getExistingOffboardingById(
      req.body.offboardingTask
    );
    if (!existedTask) {
      return next(new ErrorHandler("Task with given Id doesn't exists", 404));
    }
  }

  taskExistance.offboardingTask = req.body.offboardingTask
    ? req.body.offboardingTask
    : taskExistance.offboardingTask;
  taskExistance.date = req.body.date ? req.body.date : taskExistance.date;
  taskExistance.status = req.body.status
    ? req.body.status
    : taskExistance.status;
  taskExistance.description = req.body.description
    ? req.body.description
    : taskExistance.description;

  //updating
  const toBeUpdate = { offboarding: existedEmployee.offboarding };
  const updatedEmployee = await Employees.employeeUpdate(_id, toBeUpdate);
  if (!updatedEmployee) {
    return next(new ErrorHandler("Updation Failed.", 500));
  }

  return sendResponse({ updatedEmployee }, 200, res);
});

//get all on and offboardings of employee
const findAllTasks = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.query;
  const employee = await Employees.getAllTasks(_id);
  if (!employee) {
    return next(new ErrorHandler("Employee with this id doesn't exists", 404));
  }
  return sendResponse({ employee }, 200, res);
});

/*  ---------EMPLOYEE BENEFITS INFO----------- */
//add benefit of Employee
const addBenefit = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.query;
  //checking employee existance
  const existedEmployee = await Employees.getExistingEmployeeById(_id);
  if (!existedEmployee) {
    return next(new ErrorHandler("Employee with given Id doesn't exists", 404));
  }

  if (existedEmployee.jobDescription.length > 0) {
    //checking existance of benefit for same emplooyee
    const existed = existedEmployee.benefits?.find((benefit) =>
      benefit.benefitId.equals(req.body.benefitId)
    );
    if (existed) {
      return next(
        new ErrorHandler(
          "Benefit with given Id already assigned to this employee",
          400
        )
      );
    }
  }

  //checking benefit existance
  const existedBenefit = await getExistingBenefitById(req.body.benefitId);
  if (!existedBenefit) {
    return next(new ErrorHandler("Benefit with given Id doesn't exists", 404));
  }

  //updating
  existedEmployee.benefits.push(req.body);
  const toBeUpdate = { benefits: existedEmployee.benefits };
  const updatedEmployee = await Employees.employeeUpdate(_id, toBeUpdate);
  if (!updatedEmployee) {
    return next(new ErrorHandler("Updation Failed.", 500));
  }

  return sendResponse({ updatedEmployee }, 200, res);
});

//add benefit of Employee
const updateBenefit = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.query;
  //checking employee existance
  const existedEmployee = await Employees.getExistingEmployeeById(_id);
  if (!existedEmployee) {
    return next(new ErrorHandler("Employee with given Id doesn't exists", 404));
  }

  const { benefitId } = req.params;
  //checking existance of benefit for same emplooyee
  const benefitExistance = existedEmployee.benefits?.find((benefit) =>
    benefit._id.equals(benefitId)
  );
  if (!benefitExistance) {
    return next(
      new ErrorHandler(
        "Benefit with this id has never given to this employee",
        400
      )
    );
  }

  if (req.body.benefitId) {
    //checking existance of benefit for same emplooyee
    const existed = existedEmployee.benefits?.find((benefit) =>
      benefit.benefitId.equals(req.body.benefitId)
    );
    if (existed) {
      return next(
        new ErrorHandler(
          "Benefit with given Id already assigned to this employee",
          400
        )
      );
    }
    //checking benefit existance
    const existedBenefit = await getExistingBenefitById(req.body.benefitId);
    if (!existedBenefit) {
      return next(
        new ErrorHandler("Benefit with given Id doesn't exists", 404)
      );
    }
  }

  //updating
  benefitExistance.benefitId = req.body.benefitId
    ? req.body.benefitId
    : benefitExistance.benefitId;
  benefitExistance.effectiveDate = req.body.effectiveDate
    ? req.body.effectiveDate
    : benefitExistance.effectiveDate;
  benefitExistance.employeePays = req.body.employeePays
    ? req.body.employeePays
    : benefitExistance.employeePays;
  benefitExistance.status = req.body.status
    ? req.body.status
    : benefitExistance.status;
  const toBeUpdate = { benefits: existedEmployee.benefits };
  const updatedEmployee = await Employees.employeeUpdate(_id, toBeUpdate);
  if (!updatedEmployee) {
    return next(new ErrorHandler("Updation Failed.", 500));
  }

  return sendResponse({ updatedEmployee }, 200, res);
});

//get all benefits of employee
const findEmployeeBenefits = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.query;
  const employee = await Employees.getEmployeeBenefits(_id);
  if (!employee) {
    return next(new ErrorHandler("Employee with this id doesn't exists", 404));
  }
  return sendResponse({ employee }, 200, res);
});

/*  ---------EMPLOYEE DOCUMENTS INFO----------- */
//add document of Employee
const addDocument = asyncErrorHandler(async (req, res, next) => {
  const { _id, category } = req.query;
  //checking employee existance
  const existedEmployee = await Employees.getExistingEmployeeById(_id);
  if (!existedEmployee) {
    return next(new ErrorHandler("Employee with given Id doesn't exists", 404));
  }

  const { fileName } = req;
  if (!fileName) {
    return next(new ErrorHandler("Please provide file to be uploaded.", 400));
  }

  const document = {
    category: category,
    documentUrl: `uploads/${fileName}`,
  };

  //updating
  existedEmployee.documents?.push(document);
  const toBeUpdate = { documents: existedEmployee.documents };
  const updatedEmployee = await Employees.employeeUpdate(_id, toBeUpdate);
  if (!updatedEmployee) {
    return next(new ErrorHandler("Updation Failed.", 500));
  }

  return sendResponse({ updatedEmployee }, 200, res);
});

//update document of Employee
const updateDocument = asyncErrorHandler(async (req, res, next) => {
  const { _id, category } = req.query;
  //checking employee existance
  const existedEmployee = await Employees.getExistingEmployeeById(_id);
  if (!existedEmployee) {
    return next(new ErrorHandler("Employee with given Id doesn't exists", 404));
  }

  const { documentId } = req.params;
  //checking existance of document for same emplooyee
  const documentExistance = existedEmployee.documents?.find((doc) =>
    doc._id.equals(documentId)
  );
  if (!documentExistance) {
    return next(
      new ErrorHandler(
        "Document with this id has never given to this employee",
        400
      )
    );
  }

  const { fileName } = req;

  //updating
  documentExistance.category = category ? category : documentExistance.category;
  documentExistance.documentUrl = fileName
    ? `uploads/${fileName}`
    : documentExistance.documentUrl;

  const toBeUpdate = { documents: existedEmployee.documents };
  const updatedEmployee = await Employees.employeeUpdate(_id, toBeUpdate);
  if (!updatedEmployee) {
    return next(new ErrorHandler("Updation Failed.", 500));
  }

  return sendResponse({ updatedEmployee }, 200, res);
});

//get all documents of employee
const findAllDocuments = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.query;
  const employee = await Employees.getAllDocuments(_id);
  if (!employee) {
    return next(new ErrorHandler("Employee with this id doesn't exists", 404));
  }
  return sendResponse({ employee }, 200, res);
});

/*  ---------EMPLOYEE ASSETS INFO----------- */

const getEmployeeAseet = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.query;
  //checking employee existance
  const existedEmployee = await Employees.getExistingEmployeeById(_id);
  if (!existedEmployee) {
    return next(new ErrorHandler("Employee with given Id doesn't exists", 404));
  }

  const allAssets = await getEmployeeAssets(_id);
  if (allAssets.length < 1) {
    return next(new ErrorHandler("Not a single asset found", 404));
  }
  return sendResponse({ allAssets }, 200, res);
});

/*  ---------EMPLOYEE TIMEOFFS INFO----------- */

const getEmployeeTimeoffs = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.query;
  //checking employee existance
  const existedEmployee = await Employees.getExistingEmployeeById(_id);
  if (!existedEmployee) {
    return next(new ErrorHandler("Employee with given Id doesn't exists", 404));
  }

  const allTimeoffs = await getEmployeeTimeoff(_id);
  if (allTimeoffs.length < 1) {
    return next(new ErrorHandler("Not a single timeoff found", 404));
  }
  return sendResponse({ allTimeoffs }, 200, res);
});

module.exports = {
  createEmployee,
  uploadProfileImage,
  findAllEmployees,
  updateEmployee,
  deleteEmployee,
  getEmployee,
  addJob,
  updateJob,
  addCompensation,
  updateCompensation,
  employment,
  findAllJobs,
  addOnboarding,
  updateOnboarding,
  addOffboarding,
  updateOffboarding,
  findAllTasks,
  addBenefit,
  updateBenefit,
  findEmployeeBenefits,
  addDocument,
  updateDocument,
  findAllDocuments,
  getEmployeeAseet,
  getEmployeeTimeoffs,
  addEducation,
  updateEducation,
  updateEmployment,
};

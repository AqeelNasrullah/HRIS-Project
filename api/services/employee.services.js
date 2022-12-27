//importing model
const { EMPLOYEE_STATUS, EMPLOYEE_DEGREE } = require("../../config/constants");
const EmployeesModel = require("../models/employees");

//importing utils
const ApiFatures = require("../utils/classes/apiFeatures");

//creating Employee object
const employeeCreate = async (employee) => {
  try {
    const newEmployee = new EmployeesModel(employee);
    return await newEmployee.save();
  } catch (error) {
    throw error;
  }
};

//get all employees
const getAllEmployees = async (query, resultPerPage) => {
  try {
    const apiFeatures = new ApiFatures(
      EmployeesModel.find()
        .lean()
        .select(
          "hireDate profileImage basicInformation address contact education"
        ),
      query
    )
      .search()
      .filter()
      .pagination(resultPerPage);
    const allEmployees = await apiFeatures.query;

    return allEmployees;
  } catch (error) {
    throw error;
  }
};

//finding Employee by id
const getExistingEmployeeById = async (employeeId) => {
  try {
    const existedEmployee = await EmployeesModel.findById(employeeId).lean();
    return existedEmployee;
  } catch (error) {
    throw error;
  }
};

//finding Employee by id
const getEmployeeById = async (employeeId) => {
  try {
    const existedEmployee = await EmployeesModel.findById(employeeId)
      .select(
        "hireDate profileImage basicInformation address contact education"
      )
      .lean();
    return existedEmployee;
  } catch (error) {
    throw error;
  }
};

//update Employee's any field
const employeeUpdate = async (employeeId, toBeUpdate) => {
  try {
    //  const error= toBeUpdate.validateSync();
    //  console.log(error);
    return await EmployeesModel.findByIdAndUpdate(employeeId, toBeUpdate, {
      new: true,
      runValidators: true,
    }).lean();
  } catch (error) {
    throw error;
  }
};

//update Employee's any field
const employeePersonalInfoUpdate = async (employeeId, toBeUpdate) => {
  try {
    //  const error= toBeUpdate.validateSync();
    //  console.log(error);
    return await EmployeesModel.findByIdAndUpdate(employeeId, toBeUpdate, {
      new: true,
      runValidators: true,
    })
      .select(
        "hireDate profileImage basicInformation address contact education"
      )
      .lean();
  } catch (error) {
    throw error;
  }
};

//getting employee by ssn
const getExistingEmployee = async (ssn) => {
  try {
    const existedEmployee = EmployeesModel.findOne({
      basicInformation: { SSN: { $eq: ssn } },
    }).lean();
    return existedEmployee;
  } catch (error) {
    throw error;
  }
};

//getting employee by ssn
const getExistingHR = async (job) => {
  try {
    const existedEmployee = EmployeesModel.find({ status: EMPLOYEE_STATUS[0] })
      .populate({ path: "jobDescription.job", match: { jobTitle: job } })
      .lean();
    return existedEmployee;
  } catch (error) {
    throw error;
  }
};

//get all jobs of employee
const getAllJobs = async (_id) => {
  try {
    const employee = await EmployeesModel.findById(_id).select(
      "jobDescription compensation employment"
    );
    return employee;
  } catch (error) {
    throw error;
  }
};

//get all tasks of employee
const getAllTasks = async (_id) => {
  try {
    const employee = await EmployeesModel.findById(_id).select(
      "onboarding offboarding"
    );
    return employee;
  } catch (error) {
    throw error;
  }
};

//get all benefits of employee
const getEmployeeBenefits = async (_id) => {
  try {
    const employee = await EmployeesModel.findById(_id).select("benefits");
    return employee;
  } catch (error) {
    throw error;
  }
};

//get all benefits
const getAllBenefits = async (query, resultPerPage) => {
  try {
    const apiFeatures = new ApiFatures(
      EmployeesModel.find()
        .populate({
          path: "benefits.benefitId jobDescription.job",
          select: "title category amount jobTitle",
        })
        .select("basicInformation.firstName benefits.status")
        .lean(),
      query
    )
      .search()
      .filter()
      .pagination(resultPerPage);
    const allEmployees = await apiFeatures.query;
    if (!allEmployees) {
      return null;
    }
    return allEmployees;
  } catch (error) {
    throw error;
  }
};

//get all documents of employee
const getAllDocuments = async (_id) => {
  try {
    const employee = await EmployeesModel.findById(_id).select("documents");
    return employee;
  } catch (error) {
    throw error;
  }
};

//get all benefits
const getAllEmployements = async (query, resultPerPage) => {
  try {
    const apiFeatures = new ApiFatures(
      EmployeesModel.find()
        .select(
          "basicInformation.firstName basicInformation.lastName compensation"
        )
        .lean(),
      query
    )
      .search()
      .filter()
      .pagination(resultPerPage);
    const allEmployees = await apiFeatures.query;

    return allEmployees;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  employeeCreate,
  employeePersonalInfoUpdate,
  getEmployeeById,
  getAllEmployees,
  getExistingEmployeeById,
  employeeUpdate,
  getExistingEmployee,
  getExistingHR,
  getAllJobs,
  getAllTasks,
  getAllDocuments,
  getEmployeeBenefits,
  getAllBenefits,
  getAllEmployements,
};

//importing model
const { EMPLOYEE_STATUS } = require("../../config/constants");
const EmployeesModel = require("../models/employees");

//importing utils
const ApiFatures=require("../utils/classes/apiFeatures")

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
    const apiFeatures = new ApiFatures(EmployeesModel.find(), query)
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


//finding Employee by id
const getExistingEmployeeById = async (employeeId) => {
  try {
    const existedEmployee = await EmployeesModel.findById(employeeId).lean();
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
      runValidators:true
    }).lean();
  } catch (error) {
    throw error;
  }
};

//getting employee by ssn
const getExistingEmployee=async(ssn)=>{
  try {

    const existedEmployee=EmployeesModel.findOne({basicInformation:{SSN:{$eq:ssn}}}).lean();
    return existedEmployee
  } catch (error) {
    throw error
  }

}

//getting employee by ssn
const getExistingHR=async(job)=>{
  try {
    const existedEmployee=EmployeesModel.find({status:EMPLOYEE_STATUS[0]}).populate({path:'jobDescription.job',match:{'jobTitle':job}}).lean();
    return existedEmployee
  } catch (error) {
    throw error
  }

}

//get docs count
const getCount=async()=>{
try {
  return await EmployeesModel.countDocuments();
} catch (error) {
  throw error
}
}


module.exports = {
  employeeCreate,
  getAllEmployees,
  getExistingEmployeeById,
  employeeUpdate,
  getExistingEmployee,
  getCount,
  getExistingHR
};

const TimeoffsModel = require("../models/timeoffs");
const EmployeesModel = require("../models/employees");

const hoursByRange = async (from, to, status) => {
  try {
    const aggregationPipeline = [
      {
        $match: {
          startTime: {
            $gt: new Date(from),
          },
          endTime: {
            $lt: new Date(to),
          },
          status: status,
        },
      },
      {
        $group: {
          _id: "$employeeId",
          totalHours: {
            $sum: "$hour",
          },
        },
      },
      {
        $project: {
          employee: "$_id",
          _id: 0,
          totalHours: 1,
        },
      },
    ];

    const results = await TimeoffsModel.aggregate(aggregationPipeline);

    return results;
  } catch (error) {
    throw error;
  }
};

const genderPercentage = async () => {
  try {
    const total=await EmployeesModel.count()
    const aggregationPipeline = [
        {
          '$group': {
            '_id': '$basicInformation.gender', 
            'totalEmployees': {
              '$sum': 1
            }
          }
        }, {
          '$project': {
            'gender': '$_id', 
            '_id': 0, 
            'totalEmployees': 1
          }
        }, {
          '$addFields': {
            'percent': {
              '$divide': [
                {
                  '$multiply': [
                    '$totalEmployees', 100
                  ]
                }, total
              ]
            }
          }
        }
      ];

    const results = await EmployeesModel.aggregate(aggregationPipeline);

    return results;
  } catch (error) {
    throw error;
  }
};

const agePercentage = async (limit) => {
    try {
      const total=await EmployeesModel.count()
      const aggregationPipeline =[
        {
          '$addFields': {
            'age': {
              '$dateDiff': {
                'startDate': '$basicInformation.DOB', 
                'endDate': new Date(Date.now()), 
                'unit': 'year'
              }
            }
          }
        }, {
          '$set': {
            'range': {
              '$cond': [
                {
                  '$gt': [
                    '$age', limit
                  ]
                }, 'greater', 'smaller'
              ]
            }
          }
        }, {
          '$group': {
            '_id': '$range', 
            'totalEmployees': {
              '$sum': 1
            }
          }
        }, {
          '$addFields': {
            'percent': {
              '$divide': [
                {
                  '$multiply': [
                    '$totalEmployees', 100
                  ]
                },total
              ]
            }
          }
        }
      ];
  
      const results = await EmployeesModel.aggregate(aggregationPipeline);
  
      return results;
    } catch (error) {
      throw error;
    }
  };


module.exports = { hoursByRange,genderPercentage,agePercentage };

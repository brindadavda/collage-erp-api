import { Request, Response } from "express";
import { I_Student, StudentModel } from "../student/student.model";
import { attendanceModel } from "./attendance.model";
const faker = require('faker');

//generate randomly data
export async function createAttendanceData(req: Request, res: Response) {
  try {
    //if year passed invalid then data can not generate
    if (req.body.year > new Date().getFullYear() || req.body.year < 2010) {
      return res.send('Data cannot generate');
    }

    const attend = new attendanceModel();

    const branches = [
      {
        name: 'C.E',
        totalStudentsIntake: faker.random.number({ min: 50, max: 200 }),
      },
      {
        name: 'I.T',
        totalStudentsIntake: faker.random.number({ min: 50, max: 200 }),
      },
      {
        name: 'M.E',
        totalStudentsIntake: faker.random.number({ min: 50, max: 200 }),
      },
      {
        name: 'E.E',
        totalStudentsIntake: faker.random.number({ min: 50, max: 200 }),
      },
      {
        name: "E.C",
        totalStudentsIntake: faker.random.number({ min: 50, max: 200 }),
      }
    ];

    attend.branches = branches;


    const { year, attendance } = await generateDate(req.body.year);

    attend.year = year;
    attend.attendance = attendance;

    //if data not found of student on that year
    if (!year && !attendance) {
      return res.send('Data cannot generate');
    }


    const savedAttendanceData = await attend.save();

    res.status(201).json(savedAttendanceData);
  } catch (error) {
    res.status(500).json({ error });
  }
}

const generateDate = async (year: number) => {
  // req.body.branches.filter(async (student: I_Student) => {
  const findStudent = await StudentModel.find({ batch: year });

  if (findStudent.length === 0) {
    return {
      year: undefined,
      attendance: undefined
    }
  }

  // Generate random dates and associate them with students for the entire year
  const attendance = Array.from({ length: 365 }, (_, day) => {
    const date = new Date(year, 0, day + 1); // Create a date for each day of the year
    const studentAttendance = findStudent.map((student) => ({
      studentId: student._id,
      isPresent: faker.datatype.boolean(),// Randomly set student presence
    }));

    return {
      date,
      student: studentAttendance,
    };
  });



  return {
    year,
    attendance,
  };
}


export async function query1(req: Request, res: Response) {
  const findData = await attendanceModel.aggregate([
    {
      $unwind: {
        path: "$branches"
      }
    },
    {
      $group: {
        _id: "$year",
        totalStudents: {
          $sum: "$branches.totalStudentsIntake"
        },
        branches: {
          $push: {
            k: "$branches.name",
            v: "$branches.totalStudentsIntake"
          }
        }
      }
    },
    {
      $sort: {
        totalStudents: -1
      }
    },
    {
      $project: {
        _id: 0,
        year: "$_id",
        totalStudents: 1,
        branches: {
          $arrayToObject: "$branches"
        }
      }
    },
    {
      $replaceRoot: {
        newRoot: {
          year: "$year",
          totalStudents: "$totalStudents",
          branches: "$branches"
        }
      }
    }
  ])
  res.send(findData);
}

export async function getAbsentStudents(req: Request, res: Response) {
  try {
    const { year, branch, semester, date } = req.query;

    // Parse the date as a Date object
    const specificDate = new Date(date as string);

    // Use the date to find attendance data for the specific day
    const attendanceData = await attendanceModel.aggregate([
      {
        $unwind: '$attendance',
      },
      {
        $match: {
          'attendance.date': specificDate
        },
      },
      {
        $unwind: '$attendance.student', // Only consider absent students'
      },
      {
        $match: {
          'attendance.student.isPresent': false, // Only consider absent students
        },
      },
      {
        $lookup: {
          from: 'students', // Name of the student collection
          localField: 'attendance.student.studentId', // Field in attendanceModel
          foreignField: '_id', // Field in StudentModel
          as: 'studentDetails',
        },
      },
      {
        $project: {
          '_id': 0,
          'studentDetails': 1
        },
      },
    ]);

    //

    const dataArray = [];

    if (branch && semester) {
      const data = attendanceData.filter((data) => {
        if ((data.studentDetails[0].current_sem == semester) && (data.studentDetails[0].department === branch)) {
          return data;
        }
      })

      dataArray.push(data);
      return res.status(200).json(dataArray);
    }


    if (branch) {
      const data = attendanceData.filter((data) => (data.studentDetails[0].department) === branch)
      dataArray.push(data);

      return res.status(200).json(dataArray);
    }

    if (semester) {
      const data = attendanceData.filter((data) => data.studentDetails[0].current_sem == semester)
      dataArray.push(data);

      return res.status(200).json(dataArray);
    }


    res.status(200).json(attendanceData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getAttendanceLessthen75(req: Request, res: Response) {
  try {
    const { year, branch, semester, date } = req.query;

    const pipeline = [];

    if (year) {
      pipeline.push({
        $match: {
          'year': parseInt(year.toString())
        }
      })
    }

    pipeline.push({
      $unwind: '$attendance',
    },
      {
        $unwind: '$attendance.student', // Only consider absent students'
      },
      {
        $match: {
          $and: [{
            'attendance.student.isPresent': true
          }, {
            'attendance.date': { $lte: new Date(date as string) }
          }], // Only consider absent students
        },
      },
      {
        $group: {
          _id: '$attendance.student.studentId',
          totalPresent: {
            $sum: 1
          }
        }
      },
      {
        $lookup: {
          from: "students", // Name of the student collection
          localField: "_id", // Field in attendanceModel
          foreignField: "_id", // Field in StudentModel
          as: "studentDetails", // Name of the field to store student details
        }
      },
      {
        $project: {
          '_id': 0,
          studentId: '$_id',
          'totalPresent': 1,
          'studentDetails': 1
        },
      },)

    // Use the date to find attendance data for the specific day
    const attendanceData = await attendanceModel.aggregate(pipeline);

    // const studentData = await StudentModel.aggregate(pipeline);

    const studentsWithLowAttendance = attendanceData.filter((data) => {
      const totalDays = 365;
      const presentDays = data.totalPresent;
      const attendancePercentage = (presentDays / totalDays) * 100;
      return attendancePercentage < 75;
    });

    if (branch && semester) {
      const data = studentsWithLowAttendance.filter((data) => (data.studentDetails[0].department === branch) && (data.studentDetails[0].current_sem == semester));
      return res.send(data);
    }

    if (branch) {
      const data = studentsWithLowAttendance.filter((data) => data.studentDetails[0].department === branch);
      return res.send(data);
    }

    if (semester) {
      const data = studentsWithLowAttendance.filter((data) => data.studentDetails[0].current_sem == semester);
      return res.send(data);
    }




    res.status(200).json(studentsWithLowAttendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}


export async function getVacantSeatsYearWise(req: Request, res: Response) {
  try {
    // Get the batch and branch from the request query (if provided)
    const { batch, branch } = req.query;

    // Define the aggregation pipeline for calculating vacant seats
    const pipeline = [];

    // Match stage to filter by batch and branch (if provided)
    pipeline.push({
      $group: {
        _id: '$department',
        total: {
          $sum: 1
        }
      }
    })

    //getting 
    // [
    //   {
    //       "_id": "E.E",
    //       "total": 53
    //   },
    // ]
    const toalStudentBranchWise = await StudentModel.aggregate(pipeline);

    const pipeline2 = [
      {
        $unwind:
          {
            path: "$branches",
          },
      },
      {
        $project:
          {
            _id: 0,
            branches: 1,
          },
      },
    ];

    //getting 
    // [
    //   {
    //       "branches": {
    //           "name": "C.E",
    //           "totalStudentsIntake": 162,
    //           "_id": "653a29410bf3376b6296fd1b"
    //       }
    //   },
    // ]
    const branchWiseTotalStudentIntake = await attendanceModel.aggregate(pipeline2)

    

    // Execute the aggregation pipeline
    const vacantSeats = await StudentModel.find({});

    return res.status(200).json(branchWiseTotalStudentIntake);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

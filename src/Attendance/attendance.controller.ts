import { Request, Response } from "express";
import { StudentModel } from "../student/student.model";
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

  console.log(findStudent.length);

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
      isPresent: faker.datatype.boolean(), // Randomly set student presence
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

    // Define a match object to filter the data based on the input parameters


    // Parse the date as a Date object
    const specificDate = new Date(date as string);

    // Use the date to find attendance data for the specific day
    const attendanceData = await attendanceModel.aggregate([
      {
        $unwind: '$attendance',
      },
      {
        $match: {
          'attendance.date': specificDate,

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

    // const match: any = {};

    //

    const dataArray = [];

    if (branch) {
      // console.log(data.studentDetails.department === branch);
      const data = attendanceData.forEach((data) => console.log((data.studentDetails[0].department) == branch))
          


      dataArray.push(data);
    }
    // if (data.studentDetails.semester === semester) {
    //   return data;
    // }
    // })

    res.status(200).json(dataArray);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

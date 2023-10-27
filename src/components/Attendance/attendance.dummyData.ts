const faker = require("faker");
import { Request, Response } from "express";
import { attendanceModel } from "./attendance.model";
import { StudentModel } from "../student/student.model";

//generate randomly data
export async function createAttendanceData(req: Request, res: Response) {
  try {
    //if year passed invalid then data can not generate
    if (req.body.year > new Date().getFullYear() || req.body.year < 2010) {
      return res.send("Data cannot generate");
    }

    const attend = new attendanceModel();

    const branches = [
      {
        name: "C.E",
        totalStudentsIntake: faker.random.number({ min: 50, max: 200 }),
      },
      {
        name: "I.T",
        totalStudentsIntake: faker.random.number({ min: 50, max: 200 }),
      },
      {
        name: "M.E",
        totalStudentsIntake: faker.random.number({ min: 50, max: 200 }),
      },
      {
        name: "E.E",
        totalStudentsIntake: faker.random.number({ min: 50, max: 200 }),
      },
      {
        name: "E.C",
        totalStudentsIntake: faker.random.number({ min: 50, max: 200 }),
      },
    ];

    attend.branches = branches;

    const { year, attendance } = await generateDate(req.body.year);

    attend.year = year;
    attend.attendance = attendance;

    //if data not found of student on that year
    if (!year && !attendance) {
      return res.send("Data cannot generate");
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
      attendance: undefined,
    };
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
};

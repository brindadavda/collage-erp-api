import { Request, Response } from "express";
import { StudentModel } from "../student/student.model";
import { attendanceModel } from "./attendance.model";

//query 1
export async function query1(req: Request, res: Response) {
  const findData = await StudentModel.aggregate([
    {
      $group: {
        _id: {
          year: "$batch",
          department: "$department",
        },
        yearTotalStudents: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: "$_id.year",
        yearTotalStudents: { $sum: "$yearTotalStudents" },
        branches: {
          $push: {
            k: "$_id.department",
            v: "$yearTotalStudents",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        year: "$_id",
        totalStudents: "$yearTotalStudents",
        branches: { $arrayToObject: "$branches" },
      },
    },
  ]);
  res.send(findData);
}

//query 2
export async function getAbsentStudents(req: Request, res: Response) {
  try {
    const { branch, semester, date } = req.query;

    // Parse the date as a Date object
    const specificDate = new Date(date as string);

    // Use the date to find attendance data for the specific day
    const attendanceData = await attendanceModel.aggregate([
      {
        $unwind: "$attendance",
      },
      {
        $match: {
          "attendance.date": specificDate,
        },
      },
      {
        $unwind: "$attendance.student", // Only consider absent students'
      },
      {
        $match: {
          "attendance.student.isPresent": false, // Only consider absent students
        },
      },
      {
        $lookup: {
          from: "students", // Name of the student collection
          localField: "attendance.student.studentId", // Field in attendanceModel
          foreignField: "_id", // Field in StudentModel
          as: "studentDetails",
        },
      },
      {
        $project: {
          _id: 0,
          studentDetails: 1,
        },
      },
    ]);

    //

    const dataArray = [];

    if (branch && semester) {
      const data = attendanceData.filter((data) => {
        if (
          data.studentDetails[0].current_sem == semester &&
          data.studentDetails[0].department === branch
        ) {
          return data;
        }
      });

      dataArray.push(data);
      return res.status(200).json(dataArray);
    }

    if (branch) {
      const data = attendanceData.filter(
        (data) => data.studentDetails[0].department === branch,
      );
      dataArray.push(data);

      return res.status(200).json(dataArray);
    }

    if (semester) {
      const data = attendanceData.filter(
        (data) => data.studentDetails[0].current_sem == semester,
      );
      dataArray.push(data);

      return res.status(200).json(dataArray);
    }

    res.status(200).json(attendanceData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//query 3
export async function getAttendanceLessthen75(req: Request, res: Response) {
  try {
    const { year, branch, semester, date } = req.query;

    const pipeline = [];

    if (year) {
      pipeline.push({
        $match: {
          year: parseInt(year.toString()),
        },
      });
    }

    pipeline.push(
      {
        $unwind: "$attendance",
      },
      {
        $unwind: "$attendance.student", // Only consider absent students'
      },
      {
        $match: {
          $and: [
            {
              "attendance.student.isPresent": true,
            },
            {
              "attendance.date": { $lte: new Date(date as string) },
            },
          ], // Only consider absent students
        },
      },
      {
        $group: {
          _id: "$attendance.student.studentId",
          totalPresent: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: "students", // Name of the student collection
          localField: "_id", // Field in attendanceModel
          foreignField: "_id", // Field in StudentModel
          as: "studentDetails", // Name of the field to store student details
        },
      },
      {
        $project: {
          _id: 0,
          studentId: "$_id",
          totalPresent: 1,
          studentDetails: 1,
        },
      },
    );

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
      const data = studentsWithLowAttendance.filter(
        (data) =>
          data.studentDetails[0].department === branch &&
          data.studentDetails[0].current_sem == semester,
      );
      return res.send(data);
    }

    if (branch) {
      const data = studentsWithLowAttendance.filter(
        (data) => data.studentDetails[0].department === branch,
      );
      return res.send(data);
    }

    if (semester) {
      const data = studentsWithLowAttendance.filter(
        (data) => data.studentDetails[0].current_sem == semester,
      );
      return res.send(data);
    }

    res.status(200).json(studentsWithLowAttendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//query 4
export async function getVacantSeatsYearWise(req: Request, res: Response) {
  // Function to get vacant seats year-wise
  // First, calculate the totalStudents and totalStudentsIntake for the specified year and branch
  const findDataIntake = await attendanceModel.aggregate([
    {
      $unwind: "$branches",
    },
    {
      $group: {
        _id: "$year",
        totalStudentsIntake: {
          $sum: "$branches.totalStudentsIntake",
        },
        branches: { $addToSet: "$branches" }, // Use $addToSet to get unique branch names
      },
    },
    {
      $sort: {
        totalStudentsIntake: -1,
      },
    },
    {
      $project: {
        _id: 0,
        year: "$_id",
        totalStudentsIntake: 1,
        branches: 1,
      },
    },
  ]);

  const findData = await StudentModel.aggregate([
    {
      $group: {
        _id: {
          year: "$batch",
          department: "$department",
        },
        yearTotalStudents: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: "$_id.year",
        yearTotalStudents: { $sum: "$yearTotalStudents" },
        branches: {
          $addToSet: {
            name: "$_id.department",
            totalStudents: "$yearTotalStudents",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        year: "$_id",
        totalStudents: "$yearTotalStudents",
        branches: 1,
      },
    },
  ]);

  const result: output[] = [];

  type output = {
    batch: number;
    totalStudents: number;
    totalStudentsIntake: number;
    availableIntake: number;
    branches: {
      [branchName: string]: BranchData;
    };
  };

  interface BranchData {
    totalStudents: number;
    totalStudentsIntake: number;
    availableIntake: number;
  }

  type objectOutput = {
    name: string;
    totalStudents: number;
    totalStudentsIntake?: number;
    _id?: object;
  };

  findDataIntake.forEach((data) => {
    const obj: output = {
      batch: 0,
      totalStudents: 0,
      totalStudentsIntake: 0,
      availableIntake: 0,
      branches: {},
    };

    findData.forEach((data1) => {
      if (data.year == data1.year) {
        obj.batch = data.year;
        obj.totalStudentsIntake = data.totalStudentsIntake;
        obj.totalStudents = data1.totalStudents;
        obj.availableIntake = obj.totalStudentsIntake - obj.totalStudents;
        data.branches.forEach((branch1: objectOutput) => {
          data1.branches.forEach((branch2: objectOutput) => {
            if (branch1.name === branch2.name) {
              const branchName: string = branch1.name;
              obj.branches[branchName] = {
                totalStudents: branch2.totalStudents,
                totalStudentsIntake: branch1.totalStudentsIntake,
                availableIntake:
                  branch1.totalStudentsIntake - branch2.totalStudents,
              };
            }
          });
        });
      }
    });

    result.push(obj);
  });

  res.send(result);
}

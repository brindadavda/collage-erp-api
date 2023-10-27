"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVacantSeatsYearWise = exports.getAttendanceLessthen75 = exports.getAbsentStudents = exports.query1 = void 0;
const student_model_1 = require("../student/student.model");
const attendance_model_1 = require("./attendance.model");
async function query1(req, res) {
    const findData = await student_model_1.StudentModel.aggregate([
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
exports.query1 = query1;
async function getAbsentStudents(req, res) {
    try {
        const { branch, semester, date } = req.query;
        // Parse the date as a Date object
        const specificDate = new Date(date);
        // Use the date to find attendance data for the specific day
        const attendanceData = await attendance_model_1.attendanceModel.aggregate([
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
                    from: "students",
                    localField: "attendance.student.studentId",
                    foreignField: "_id",
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
                if (data.studentDetails[0].current_sem == semester &&
                    data.studentDetails[0].department === branch) {
                    return data;
                }
            });
            dataArray.push(data);
            return res.status(200).json(dataArray);
        }
        if (branch) {
            const data = attendanceData.filter((data) => data.studentDetails[0].department === branch);
            dataArray.push(data);
            return res.status(200).json(dataArray);
        }
        if (semester) {
            const data = attendanceData.filter((data) => data.studentDetails[0].current_sem == semester);
            dataArray.push(data);
            return res.status(200).json(dataArray);
        }
        res.status(200).json(attendanceData);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
exports.getAbsentStudents = getAbsentStudents;
async function getAttendanceLessthen75(req, res) {
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
        pipeline.push({
            $unwind: "$attendance",
        }, {
            $unwind: "$attendance.student", // Only consider absent students'
        }, {
            $match: {
                $and: [
                    {
                        "attendance.student.isPresent": true,
                    },
                    {
                        "attendance.date": { $lte: new Date(date) },
                    },
                ], // Only consider absent students
            },
        }, {
            $group: {
                _id: "$attendance.student.studentId",
                totalPresent: {
                    $sum: 1,
                },
            },
        }, {
            $lookup: {
                from: "students",
                localField: "_id",
                foreignField: "_id",
                as: "studentDetails", // Name of the field to store student details
            },
        }, {
            $project: {
                _id: 0,
                studentId: "$_id",
                totalPresent: 1,
                studentDetails: 1,
            },
        });
        // Use the date to find attendance data for the specific day
        const attendanceData = await attendance_model_1.attendanceModel.aggregate(pipeline);
        // const studentData = await StudentModel.aggregate(pipeline);
        const studentsWithLowAttendance = attendanceData.filter((data) => {
            const totalDays = 365;
            const presentDays = data.totalPresent;
            const attendancePercentage = (presentDays / totalDays) * 100;
            return attendancePercentage < 75;
        });
        if (branch && semester) {
            const data = studentsWithLowAttendance.filter((data) => data.studentDetails[0].department === branch &&
                data.studentDetails[0].current_sem == semester);
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
exports.getAttendanceLessthen75 = getAttendanceLessthen75;
async function getVacantSeatsYearWise(req, res) {
    // Function to get vacant seats year-wise
    // First, calculate the totalStudents and totalStudentsIntake for the specified year and branch
    const findDataIntake = await attendance_model_1.attendanceModel.aggregate([
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
    const findData = await student_model_1.StudentModel.aggregate([
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
    const result = [];
    findDataIntake.forEach((data) => {
        const obj = {
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
                data.branches.forEach((branch1) => {
                    data1.branches.forEach((branch2) => {
                        if (branch1.name === branch2.name) {
                            const branchName = branch1.name;
                            obj.branches[branchName] = {
                                totalStudents: branch2.totalStudents,
                                totalStudentsIntake: branch1.totalStudentsIntake,
                                availableIntake: branch1.totalStudentsIntake - branch2.totalStudents,
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
exports.getVacantSeatsYearWise = getVacantSeatsYearWise;

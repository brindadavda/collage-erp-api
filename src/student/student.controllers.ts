/* eslint-disable */
import { Request, Response } from "express";
/* eslint-disable */
import { JwtRequest } from "../utils/auth";
/* eslint-disable */
import { checkRole } from "./student.middleware";
import { StudentModel } from "./student.model";
import { attendanceModel } from "../Attendance/attendance.model";

class StudentController {
  //creating user
  static async createStudent(req: JwtRequest, res: Response) {
    const valid = checkRole(req.user.role);

    //valid user
    if (valid) {
      if (Object.keys(req.body).length != 0) {
        try {
          const student = new StudentModel(req.body);

          await student.save();

          return res.status(201).send("Student Data created successfully");
        } catch (e) {
          return res.send({ error: e.message });
        }
      }

      return res.send("Please provide the data");
    }

    return res.send(
      `Forbidden, you are a ${req.role} and this service is only available for STAFF OR ADMIN`,
    );
  }

  // Read the student data
  static async readStudents(req: Request, res: Response) {
    const studentData = await StudentModel.find({});

    return res.send(studentData);
  }

  //update the student data
  static async updateStudents(req: JwtRequest, res: Response) {
    const valid = checkRole(req.user.role);

    if (valid) {
      //check for the property is correct or not
      try {
        const allowedUpdates = [
          "name",
          "phone_number",
          "department",
          "batch",
          "current_sem",
        ]; // defineing update property
        const updates = Object.keys(req.body);

        //checking for valid value or not
        const isvalidOperation: boolean[] = updates.map((update) =>
          allowedUpdates.includes(update),
        );

        let operationValid: boolean = false;

        isvalidOperation.forEach((value) => {
          if (value) {
            return (operationValid = true);
          }
        });

        if (!operationValid) {
          return res.status(400).json({ error: "Invalid updates!" });
        }

        await StudentModel.findByIdAndUpdate({ _id: req.params.id }, req.body);

        return res.send("Data update successfully!");
      } catch (e) {
        return res.status(404).json({ error: e });
      }
    }

    return res.send(
      `Forbidden, you are a ${req.role} and this service is only available for STAFF OR ADMIN`,
    );
  }

  //update the student attendance data
  // static async updateStudentsAttendance(req: JwtRequest, res: Response) {
  //   const valid = checkRole(req.user.role);

  //   if (valid) {
  //     //check for the property is correct or not
  //     try {
  //       // Use the date to find attendance data for the specific day
  //       const attendanceData = await attendanceModel.aggregate([
  //         {
  //           $unwind: '$attendance',
  //         },
  //         {
  //           $unwind: '$attendance.student', // Only consider absent students'
  //         },
  //         {
  //           $match: {
  //             'attendance.student.isPresent': true, // Only consider absent students
  //           },
  //         },
  //         {
  //           $project: {
  //             '_id': 0,
  //             'attendance.student': 1
  //           },
  //         }
  //       ]);

  //       await StudentModel.updateMany(
  //         {},
  //         { $unset: { attendanceId: 1 } } // Use new ObjectId("1") to create an ObjectId
  //       );


  //       // { $push: { attendanceId: data.attendance.student._id } }

  //       attendanceData.forEach(async (data) => {
  //         try {
  //           const student = await StudentModel.updateOne({ _id : data.attendance.student.studentId} , {} );
          
        
  //           // if (student) {
  //           //  console.log(student);
  //           // }

            
  //         } catch (error) {
  //           console.error("Error updating student's attendance:", error);
  //         }

          
  //       // })
  //       return res.send('Updated');
  //     } catch (error) {
  //       return res.send({ error });
  //     }



  //   }
  //   }}

  //delete the student data
  static async deleteStudent(req: JwtRequest, res: Response) {
    const valid = checkRole(req.user.role);

    if (valid) {
      await StudentModel.findByIdAndDelete({ _id: req.params.id });

      return res.send("Data Deleted Sccuessfully");
    }

    return res.send(
      `Forbidden, you are a ${req.role} and this service is only available for STAFF OR ADMIN`,
    );
  }
}

export default StudentController;

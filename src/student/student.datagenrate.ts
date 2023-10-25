import mongoose from "mongoose";
const faker = require('faker');
const validator = require("validator");
import { Request, Response } from "express";

// Import your mongoose model and schema here
import { StudentModel } from "./student.model";


export function StudentDataGenerate(req: Request, res: Response) {
    const generateRandomStudentData = () => {
        return {
          name: faker.name.findName(),
          phone_number: faker.random.number({ min: 1000000000, max: 9999999999 }), // Generate a random 10-digit number as a phone number
          department: faker.random.arrayElement(["C.E", "E.C", "I.T", "M.E", "E.E"]),
          batch: faker.random.number({ min: 2010, max: new Date().getFullYear() }),
          current_sem: faker.random.number({ min: 1, max: 8 }),
        };
      };
      
    const generateAndSaveRandomStudents = async (count: number) => {
        for (let i = 0; i < count; i++) {
            const randomStudentData = generateRandomStudentData();
            if (randomStudentData) {
                const student = new StudentModel(randomStudentData);
                await student.save();
            }
        }
    };

    const dataCount: number = 300;

    generateAndSaveRandomStudents(dataCount)
        .then(() => {
            console.log(`Generated and saved ${dataCount} random students.`);
            res.send(`Generated and saved ${dataCount} random students.`);

        })
        .catch((err) => {
            console.error("Error generating data:", err);
            res.send("Error generating data:" + err);
        });
}


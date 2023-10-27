"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentDataGenerate = void 0;
const faker = require("faker");
// Import your mongoose model and schema here
const student_model_1 = require("./student.model");
function StudentDataGenerate(req, res) {
    const generateRandomStudentData = () => {
        return {
            name: faker.name.findName(),
            phone_number: faker.random.number({ min: 1000000000, max: 9999999999 }),
            department: faker.random.arrayElement([
                "C.E",
                "E.C",
                "I.T",
                "M.E",
                "E.E",
            ]),
            batch: faker.random.number({ min: 2010, max: new Date().getFullYear() }),
            current_sem: faker.random.number({ min: 1, max: 8 }),
        };
    };
    const generateAndSaveRandomStudents = async (count) => {
        for (let i = 0; i < count; i++) {
            const randomStudentData = generateRandomStudentData();
            if (randomStudentData) {
                const student = new student_model_1.StudentModel(randomStudentData);
                await student.save();
            }
        }
    };
    const dataCount = 300;
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
exports.StudentDataGenerate = StudentDataGenerate;

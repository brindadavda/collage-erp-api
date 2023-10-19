import { Request, Response, Router } from "express";
import auth from "../middleware/auth";
import { JwtRequest } from "../middleware/auth";
import UserController  from "../controllers/user";


export const userRouter: Router = Router();

//testing purpose
userRouter.get('', (req: Request, res: Response) => {
    res.send('User router is working');
})

//create user 
userRouter.post('/create' , UserController.createUser);

//login user
userRouter.post('/login' , UserController.loginUser);


// userRouter.get('/admin-only', auth, checkRole(['ADMIN']), async (req: JwtRequest, res: Response) => {
//     res.status(200).json({ message: 'This can only be accessed by admins' });
// });

// userRouter.get('/admin-and-staff', auth, checkRole(['ADMIN', 'STAFF']), async (req: JwtRequest, res: Response) => {
//     res.status(200).json({ message: 'This can only be accessed by admins and teachers' });
// });

// userRouter.get('/admin-staff-students', auth, checkRole(['ADMIN', 'STAFF', 'STUDENT']), async (req: JwtRequest, res: Response) => {
//     res.status(200).json({ message: 'This can only be accessed by admins, teachers and students' });
// });

//logout user 
userRouter.post('/logout', auth, UserController.logout);

//logout all token 
userRouter.post('/logoutall',auth,UserController.logoutall);

//getting user data
userRouter.get('/me', auth, async (req : JwtRequest, res : Response) => {
    res.send(req.user);
})


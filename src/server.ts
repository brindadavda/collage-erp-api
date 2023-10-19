import express, { Request, Response } from "express";
import "./db/mongooseConn";
import { userRouter } from "./user/router/user";

const app: express.Application = express();

const port  = parseInt(process.env.PORT) || 3000;

app.use(express.json());
//set all the routers
app.use('/user',userRouter);

//testing purpose only
app.get('', (req: Request, res: Response) => {
    res.send('server is running');
})

app.listen(port, '0.0.0.0', () => {
    console.log(`server is running on localhost:${port}`)
})
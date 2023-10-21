import { Router, Request, Response } from "express";
import { analyticsModel } from "./analytics.model";

export const analyticsRouter: Router = Router();

analyticsRouter.get("", async (req: Request, res: Response) => {
  const batches_data = await analyticsModel.find({});

  res.send(batches_data);
});

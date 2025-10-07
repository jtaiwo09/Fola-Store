import { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser & { _id: any; role: any };
      file?: Express.Multer.File;
      files?: Express.Multer.File[];
    }
  }
}

export {};

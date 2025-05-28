export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

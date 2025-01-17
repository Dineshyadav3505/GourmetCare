interface IUser {
  id?: number;
  name: string;
  dateOfBirth: Date;
  email: string;
  password: string;
  status: boolean;
  phoneNumber: string;
  profession: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User implements IUser {
  id?: number;
  name: string;
  dateOfBirth: Date;
  email: string;
  password: string;
  status: boolean;
  phoneNumber: string;
  profession: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(user: IUser) {
    this.name = user.name;
    this.dateOfBirth = user.dateOfBirth;
    this.email = user.email;
    this.password = user.password;
    this.status = user.status;
    this.phoneNumber = user.phoneNumber;
    this.profession = user.profession;
  }
}

export default User;
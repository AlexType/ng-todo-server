export default class UserDto {
  id!: string;
  email!: string;
  firstName!: string;
  lastName!: string;

  constructor(model: any) {
    this.id = model._id;
    this.email = model.email;
    this.firstName = model.firstName;
    this.lastName = model.lastName;
  }
}

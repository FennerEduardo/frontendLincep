export class AuthUserCredentials {
  email!: string;
  password!: string;
}

export class AccessTokenModel {
  expires_in!: number;
  token!: string;
  message!: string;
}

export class UserModel {
  id: number = 0;
  email!: string;
  username!: string;
  created_at!: string;
  updated_at!: string;
  Projects!: ProjectModel[];
}

export class AuthSignUpModel {
  username: string = '';
  email: string = '';
  password: string = '';
  password_confirmation: string = '';
}

export class ProjectModel {
  id!: number;
  user_id!: number;
  name!: string;
  description!: string;
  created_at!: string;
  updated_at!: string;
}


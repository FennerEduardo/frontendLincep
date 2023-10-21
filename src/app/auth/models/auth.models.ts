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
  id!: number;
  email!: string;
  username!: string;
  created_at!: string;
  updated_at!: string;
}



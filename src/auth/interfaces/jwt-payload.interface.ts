export interface IAuthJwtPayload {
  user_id: number;
  login_id: number;
  iat?: number;
  exp?: number;
}

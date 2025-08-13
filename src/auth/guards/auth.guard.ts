import _ from 'lodash';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AllowPublic, AllowRoles } from '../decorators/allow.decorator';
import { AuthServiceProxy } from '../auth.service.proxy';
import { setItem } from 'src/shared/modules/instances/context.instance';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authProxy: AuthServiceProxy,
    private reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext) {
    const handler = ctx.getHandler();
    const isPublic = this.reflector.get(AllowPublic, handler);
    if (isPublic) return true;

    const allowedRoles: string[] | undefined = this.reflector.get(
      AllowRoles,
      handler,
    );
    const req = ctx.switchToHttp().getRequest();

    const token =
      _.replace(
        (req.headers['authorization'] as string) || '',
        /^Bearer +/,
        '',
      ) || (req.query.authorization as string);

    if (!token) throw new UnauthorizedException('Missing token');

    const { user, login } = await this.authProxy.service.introspectToken(token);

    if (
      allowedRoles?.length &&
      !allowedRoles.includes(typeof user.role === 'string' ? user.role : '')
    ) {
      throw new ForbiddenException();
    }

    setItem('login', login);
    setItem('user', user);
    req.user = { userId: user.id, email: user.email, role: user.role };

    return true;
  }
}

import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    // Este reflector me ayuda a ver info de decoradores y metadata del mismo método o donde esté puesto
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Pide el nombre de la metadata y el target (función)
    const validRoles: string[] = this.reflector.get(
      'roles',
      context.getHandler(),
    );
    // console.log({ validRoles });

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) throw new BadRequestException('User not found');

    for (const role of user.roles) {
      if (validRoles.includes(role)) return true;
    }

    throw new ForbiddenException(
      `User ${user.fullName} needs a valid role: [${validRoles}]`,
    );
  }
}

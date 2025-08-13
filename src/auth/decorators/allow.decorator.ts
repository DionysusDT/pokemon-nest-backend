import { Reflector } from '@nestjs/core';
export const AllowRoles = Reflector.createDecorator<string[]>();
export const AllowPublic = Reflector.createDecorator<boolean>();

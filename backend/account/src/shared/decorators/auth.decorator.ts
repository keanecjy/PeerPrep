import { applyDecorators, Type, UseGuards } from '@nestjs/common';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';
import { IAuthGuard } from '@nestjs/passport';

export function UseAuth(
  guard: Type<IAuthGuard>,
  unauthorizedMessage = 'Unauthorized'
) {
  return applyDecorators(
    UseGuards(guard),
    ApiUnauthorizedResponse({ description: unauthorizedMessage })
  );
}

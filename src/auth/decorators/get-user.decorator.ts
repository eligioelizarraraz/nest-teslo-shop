import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    // La data es lo que se pone dentro como parámetro del decorador y el contexto es el contexto en elc ual se está ejecutando (tengo acceso a la request)
    // console.log({ data, context });

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    // Es 500 porque estoy intentando obtener un usuario pero no estoy pudiendo pasarlo por el Guard
    if (!user)
      throw new InternalServerErrorException('User not found (request');

    return !data ? user : user[data];
  },
);

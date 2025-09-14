import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RawHeader = createParamDecorator(
  (data, context: ExecutionContext) => {
    const { rawHeaders } = context.switchToHttp().getRequest();
    return rawHeaders;
  },
);

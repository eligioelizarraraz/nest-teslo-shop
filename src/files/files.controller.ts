import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
    }),
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    // El interceptor sólo evalúa que esté dentro del request
    // Por eso también se debe evaluar en Nest
    if (!file)
      throw new BadRequestException('Asegúrate que el archivo es una imagen');

    return {
      fieldName: file.originalname,
    };
  }
}

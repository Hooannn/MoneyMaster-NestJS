import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
  Req,
  Query,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { File } from './entities/file.entity';
import Response from 'src/response.entity';
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload/single')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingleFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
    @Query('folder') folder,
  ) {
    const res = await this.filesService.uploadSingle(
      file,
      folder,
      req.auth?.userId,
    );

    return new Response<File>({
      code: 201,
      data: res,
      message: 'Uploaded',
      success: true,
    });
  }

  @Post('upload/multiple')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultipleFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req,
    @Query('folder') folder,
  ) {
    const res = await this.filesService.uploadMultiple(
      files,
      folder,
      req.auth?.userId,
    );

    return new Response<File[]>({
      code: 201,
      data: res,
      message: 'Uploaded',
      success: true,
    });
  }

  @Get()
  async findAll() {
    const res = await this.filesService.findAll();

    return new Response<File[]>({
      code: 200,
      data: res,
      success: true,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.filesService.findOne(+id);

    return new Response<File>({
      code: 200,
      data: res,
      success: true,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const res = await this.filesService.remove(+id);

    return new Response<File>({
      code: 200,
      data: res,
      success: true,
      message: 'Deleted',
    });
  }
}

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
import ResponseBuilder from 'src/utils/response';
import { File } from './entities/file.entity';
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  private readonly responseBuilder = new ResponseBuilder<File | File[]>();

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
    return this.responseBuilder
      .code(201)
      .data(res)
      .message('Uploaded')
      .success(true)
      .build();
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
    return this.responseBuilder
      .code(201)
      .data(res)
      .message('Uploaded')
      .success(true)
      .build();
  }

  @Get()
  async findAll() {
    const res = await this.filesService.findAll();
    return this.responseBuilder
      .code(200)
      .data(res)
      .message('ok')
      .success(true)
      .build();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.filesService.findOne(+id);
    return this.responseBuilder
      .code(200)
      .data(res)
      .message('ok')
      .success(true)
      .build();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const res = await this.filesService.remove(+id);
    return this.responseBuilder
      .code(200)
      .data(res)
      .message('Deleted')
      .success(true)
      .build();
  }
}

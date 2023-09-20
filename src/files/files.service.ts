import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { File } from './entities/file.entity';
import { v2 } from 'cloudinary';
import { DataURI } from 'datauri/types';
import DataURIParser from 'datauri/parser';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
const parser = new DataURIParser();

const bufferToDataURI = (fileFormat: string, buffer: DataURI.Input) =>
  parser.format(fileFormat, buffer);

@Injectable()
export class FilesService {
  constructor(
    @Inject('CLOUDINARY') private readonly client: typeof v2,
    @InjectKnex() private readonly knex: Knex,
  ) {}
  async uploadSingle(
    file: Express.Multer.File,
    folder?: string,
    uploadedBy?: number,
  ) {
    try {
      const { base64, fileFormat } = this.prepare(file);
      const res = await this.client.uploader.upload(
        `data:image/${fileFormat};base64,${base64}`,
        {
          folder: folder ?? 'default',
        },
      );
      const [createdFile] = await this.knex<File>('files').insert(
        {
          name: res.asset_id,
          description: res.public_id,
          provider_metadata: res,
          created_by: uploadedBy,
          updated_by: uploadedBy,
          url: res.url,
          format: res.format,
          resource_type: res.resource_type,
        },
        '*',
      );
      return createdFile;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async uploadMultiple(
    files: Array<Express.Multer.File>,
    folder?: string,
    uploadedBy?: number,
  ) {
    try {
      const preparedFiles = files.map((file) => this.prepare(file));
      const cloudinaryFiles = await Promise.all(
        preparedFiles.map(({ fileFormat, base64 }) =>
          this.client.uploader.upload(
            `data:image/${fileFormat};base64,${base64}`,
            {
              folder: folder ?? 'default',
            },
          ),
        ),
      );

      const createdFiles = await this.knex<File>('files').insert(
        cloudinaryFiles.map((res) => ({
          name: res.asset_id,
          description: res.public_id,
          provider_metadata: res,
          created_by: uploadedBy,
          updated_by: uploadedBy,
          url: res.url,
          format: res.format,
          resource_type: res.resource_type,
        })),
        '*',
      );
      return createdFiles;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      const res = await this.knex<File>('files').select();
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      const res = await this.knex<File>('files').where('id', id).first();

      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      const [res] = await this.knex<File>('files').where('id', id).del('*');
      await this.client.uploader.destroy(
        res.provider_metadata?.public_id ?? res.description,
      );
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  private prepare(file: Express.Multer.File) {
    const fileFormat = file.mimetype.split('/')[1];
    const { base64 } = bufferToDataURI(fileFormat, file.buffer);

    return { base64, fileFormat };
  }
}

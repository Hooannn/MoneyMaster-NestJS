import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { v2 } from 'cloudinary';
import config from 'src/configs';
@Module({
  controllers: [FilesController],
  providers: [
    FilesService,
    {
      provide: 'CLOUDINARY',
      useFactory: () => {
        v2.config({
          cloud_name: config.CLOUDINARY_CLOUD_NAME,
          api_key: config.CLOUDINARY_API_KEY,
          api_secret: config.CLOUDINARY_API_SECRET,
        });

        return v2;
      },
    },
  ],
  exports: ['CLOUDINARY', FilesService],
})
export class FilesModule {}

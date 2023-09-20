import { UploadApiResponse as CloudinaryFile } from 'cloudinary';
import { DefaultEntity } from 'src/shared/entity';

export class File extends DefaultEntity {
  readonly name: string;
  readonly description?: string;
  readonly url: string;
  readonly format: string;
  readonly resource_type: string;
  readonly provider_metadata: CloudinaryFile;
}

import { Pipe, PipeTransform } from '@angular/core';
import { S3File } from '@models/utils/file.model';

@Pipe({
  name: 'image',
  standalone: true
})
export class ImagePipe implements PipeTransform {

  transform(file: S3File): string {
    return `data:${file.extension};base64,${file.content}`;
  }

}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { S3File } from '@models/utils/file.model';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { ButtonComponent } from '../button/button.component';
import { ImagePipe } from 'src/app/core/pipes/image/image.pipe';

@Component({
  selector: 'app-input-file',
  standalone: true,
  imports: [ImagePipe, FileUpload, ButtonComponent, CommonModule],
  templateUrl: './input-file.component.html'
})
export class InputFileComponent implements OnChanges {

  @Input() fileLimit: number = 1;
  @Input() label: string = '';
  @Input() filesUploaded: S3File[] = [];
  filesUploadedCopy: S3File[] = [...this.filesUploaded];

  @Output() uploadFilesEvent = new EventEmitter<S3File[]>();
  @Output() deleteFileEvent = new EventEmitter<S3File>();

  filesToUpload: S3File[] = [];

  selectEnable: boolean = true;
  sendEnable: boolean = false;
  clearEnable: boolean = false;
  removeEnable: boolean = false;

  constructor() { }

  ngOnChanges(): void {
    this.filesUploadedCopy = [...this.filesUploaded];
  }

  callback(callback: () => void) {
    callback();
  }

  onSelect($event: FileSelectEvent) {
    this.filesToUpload = [];
    $event.currentFiles.forEach(uploadedFile => {
      const file = new S3File();
      file.name = uploadedFile.name;
      file.extension = uploadedFile.type;
      file.size = uploadedFile.size;

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        file.content = base64;
      }
      reader.readAsDataURL(uploadedFile);
      this.filesToUpload.push(file);
    })
    this.sendEnable = true;
    this.removeEnable = true;
    this.clearEnable = true;
  }

  onSend() {
    this.uploadFilesEvent.emit(this.filesToUpload);
    this.selectEnable = false;
    this.sendEnable = false;
    this.clearEnable = false;
    this.removeEnable = false;
  }

  onRemove($event: File, index: number, removeFileCallback?: (file: File, index: number) => void) {
    this.filesToUpload = this.filesToUpload.filter(file => file.name !== $event.name);

    if(typeof removeFileCallback === 'function')
      removeFileCallback($event, index);

    if (this.filesToUpload.length === 0) {
      this.selectEnable = true;
      this.sendEnable = false;
      this.clearEnable = false;
    }
  }

  onClear() {
    this.selectEnable = true;
    this.sendEnable = false;
    this.clearEnable = false;
    this.filesToUpload = [];
  }

  removeUploaded(fileToDelete: S3File) {
    this.deleteFileEvent.emit(fileToDelete);
    this.filesUploadedCopy = this.filesUploadedCopy.filter(file => file.name != fileToDelete.name);
  }

}

import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  imports: [],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css',
})
export class ImageUpload {
  protected imageSrc = signal<string | ArrayBuffer | null | undefined>(null);
  isDragging = false;
  private fileToUpload: File | null = null;
  uploadFile = output<File>();
  loading = input<boolean>(false);


  onDragEvent(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDropEvent(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      this.previewImage(file);
      this.fileToUpload = file;
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.previewImage(file);
      this.fileToUpload = file;
    }
  }

  onCancel() {
    this.imageSrc.set(null);
    this.fileToUpload = null;
  }

  onUploadFile() {
    if (this.fileToUpload) {
      this.uploadFile.emit(this.fileToUpload);
    }
  }

  private previewImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => this.imageSrc?.set(e.target?.result);
    reader.readAsDataURL(file);
  }
}

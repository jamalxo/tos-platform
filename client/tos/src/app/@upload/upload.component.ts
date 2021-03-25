import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DocumentService } from '../@core/service/document/document.service';
import { Router } from '@angular/router';
import { DocumentListService } from '../@core/service/documentList/document-list.service';

@Component({
  selector: 'tos-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  uploadForm = new FormGroup({
    title: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required),
  });

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private documentListService: DocumentListService
  ) {}

  ngOnInit(): void {}

  files: any[] = [];
  gotFile = false;
  copyPasteOpen = false;

  /**
   * on file drop handler
   */
  onFileDropped($event: any) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(target: any) {
    this.prepareFilesList(target.files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.gotFile = false;
    this.files.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    this.gotFile = files.length > 0;
    if (files.length > 0) {
      const item = files[0];
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: number, decimals: number) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  get f() {
    return this.uploadForm.controls;
  }

  upload() {
    if (this.uploadForm.invalid) {
      return;
    }

    const document = {
      title: this.f.title.value,
      content: this.f.content.value,
    };

    this.documentService.upload(document).subscribe(
      (res) => {
        this.router.navigate([`editor/${res._id}`]);
        console.log(res);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  uploadFile(i: number) {
    this.documentService.uploadFile(this.files[i]).subscribe(
      (res) => {
        this.deleteFile(i);
        this.router.navigate([`editor/${res._id}`]);
      },
      (error) => {
        this.deleteFile(i);
        console.log(error);
      }
    );
  }

  colNum() {
    return this.gotFile || this.copyPasteOpen ? 1 : 2;
  }

  openCopyPaste() {
    this.copyPasteOpen = true;
  }

  closeCopyPaste() {
    this.copyPasteOpen = false;
  }
}

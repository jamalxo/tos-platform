import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { StatusLabelComponent } from './components/status-label/status-label.component';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { FileProgressComponent } from './components/file-progress/file-progress.component';

@NgModule({
  declarations: [HeaderComponent, StatusLabelComponent, FileProgressComponent],
  exports: [HeaderComponent, StatusLabelComponent, FileProgressComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatButtonModule,
    MatChipsModule,
  ],
})
export class SharedModule {}

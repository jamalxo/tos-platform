import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutUsComponent } from './about-us.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AboutUsComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslateModule]
})
export class AboutUsModule {}

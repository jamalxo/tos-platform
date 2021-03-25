import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadComponent } from './upload.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import {SharedModule} from "../@shared/shared.module";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  declarations: [UploadComponent],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        FormsModule,
        MatCardModule,
        MatGridListModule,
        SharedModule,
        MatButtonModule,
        MatIconModule,
    ],
})
export class UploadModule {}

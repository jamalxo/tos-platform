import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor.component';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateSectionDialogComponent } from './create-section-dialog/create-section-dialog.component';
import { MatCardModule, MatCardActions } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { AnnotationCardComponent } from './annotation-card/annotation-card.component';
import { FlexModule } from '@angular/flex-layout';
import { CreateAnnotationDialogComponent } from './create-annotation-dialog/create-annotation-dialog.component';
import { CommentCardComponent } from './comment-card/comment-card.component';
import { DeleteSectionDialogComponent } from './delete-section-dialog/delete-section-dialog.component';
import { DeleteAnnotationDialogComponent } from './delete-annotation-dialog/delete-annotation-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
@NgModule({
  declarations: [
    EditorComponent,
    CreateSectionDialogComponent,
    AnnotationCardComponent,
    CreateAnnotationDialogComponent,
    CommentCardComponent,
    DeleteSectionDialogComponent,
    DeleteAnnotationDialogComponent,
  ],
  imports: [
    CommonModule,
    NgbPopoverModule,
    TranslateModule,
    ReactiveFormsModule,
    MatCardModule,
    MatListModule,
    MatChipsModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatDialogModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    FlexModule,
    MatSnackBarModule,
  ],
})
export class EditorModule {}

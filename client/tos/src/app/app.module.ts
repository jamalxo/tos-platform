import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './@shared/shared.module';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { LandingPageModule } from './@landing-page/landing-page.module';
import { JwtModule } from '@auth0/angular-jwt';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OverviewModule } from './@overview/overview.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { UploadModule } from './@upload/upload.module';
import { TokenInterceptor } from './@core/service/auth/token.interceptor';
import { EditorModule } from './@editor/editor.module';
import { AboutUsModule } from './@about-us/about-us.module';
import { ProfileModule } from './@profile/profile.module';
import { DocumentListModule } from './@document-list/document-list.module';
import { MatButtonModule } from '@angular/material/button';
import { TaskComponent } from './@task/task.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { StatusLabelComponent } from './@shared/components/status-label/status-label.component';
import { TaskIdPipe } from './@shared/pipes/task-id.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StatusLabelTextPipe } from './@shared/pipes/status-label-text.pipe';
import { DndDirective } from './dnd.directive';
import { DatePipe } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexModule } from '@angular/flex-layout';
import { TaskDialogComponent } from './@editor/task-dialog/task-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ResetComponent } from './@reset/reset.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    ResetComponent,
    TaskComponent,
    TaskIdPipe,
    StatusLabelTextPipe,
    TaskDialogComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LandingPageModule,
    SharedModule,
    OverviewModule,
    UploadModule,
    EditorModule,
    AboutUsModule,
    ProfileModule,
    DocumentListModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: function tokenGetter() {
          return localStorage.getItem('token');
        },
      },
    }),
    NgbModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    FlexModule,
    ReactiveFormsModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    DatePipe,
  ],
  bootstrap: [AppComponent],
  exports: [StatusLabelComponent],
})
export class AppModule {}

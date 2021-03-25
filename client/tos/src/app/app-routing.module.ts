import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './@landing-page/landing-page.component';
import { LoginComponent } from './@landing-page/login/login.component';
import { RegisterComponent } from './@landing-page/register/register.component';
import { AuthenticationGuard } from './@core/service/auth/authentication.guard';
import { OverviewComponent } from './@overview/overview.component';
import { UploadComponent } from './@upload/upload.component';
import { ProfileComponent } from './@profile/profile.component';
import { EditorComponent } from './@editor/editor.component';
import { AboutUsComponent } from './@about-us/about-us.component';
import { DocumentListComponent } from './@document-list/document-list.component';
import { TaskComponent } from './@task/task.component';
import { ResetComponent } from './@reset/reset.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'reset/:token',
    component: ResetComponent,
  },
  {
    path: 'overview',
    component: OverviewComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'upload',
    component: UploadComponent,
    canActivate: [AuthenticationGuard],
  },
  { path: 'profile', component: ProfileComponent },
  { path: 'about-us', component: AboutUsComponent },
  {
    path: 'editor/:documentid',
    component: EditorComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'documents',
    component: DocumentListComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'tasks',
    component: TaskComponent,
    canActivate: [AuthenticationGuard],
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

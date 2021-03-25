import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview.component';
import { TranslateModule } from '@ngx-translate/core';
import { TaskTableComponent } from './task-table/task-table.component';
import { RoutingCardComponent } from './routing-card/routing-card.component';
import { SharedModule } from '../@shared/shared.module';
import { DeleteTaskDialogComponent } from './delete-task-dialog/delete-task-dialog.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    OverviewComponent,
    RoutingCardComponent,
    TaskTableComponent,
    DeleteTaskDialogComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    MatDividerModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    MatSortModule,
    MatPaginatorModule,
    MatGridListModule,
    MatBadgeModule,
    MatButtonModule,
    MatDialogModule,
    SharedModule,],
})
export class OverviewModule {}

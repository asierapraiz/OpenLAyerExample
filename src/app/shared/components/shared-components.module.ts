import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { CustomConfirmDialogComponent } from './custom-confirm-dialog/custom-confirm-dialog.component';





@NgModule({
  declarations: [
    CustomConfirmDialogComponent
  ],
  imports: [
    MaterialModule,
    CommonModule,
         
  ],
  exports: [
    CustomConfirmDialogComponent
  ]
})
export class SharedComponentsModule { }

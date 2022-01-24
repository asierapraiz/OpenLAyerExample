import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material/material.module';



@NgModule({
  declarations: [
    LoginComponent    
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
    
  ]
})
export class PublicModule { }

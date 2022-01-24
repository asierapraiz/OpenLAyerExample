import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../../core/service/login.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GLOBAL_CONSTANTS } from 'src/app/shared/utils/global-constants';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formGroup = new FormGroup({});
  subscriptions: Subscription[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private loginService: LoginService
  ) {
  }


  ngOnInit(): void {
    this.formGroup = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  login(): void {   
    
    
    if (this.formGroup.valid) {
      const email = this.formGroup.controls.email.value;
      const password = this.formGroup.controls.password.value;
      const subscription = this.loginService.login(email, password).subscribe(
        () => {
          this.router.navigateByUrl("/dashboard/all/terreno").then();
        },
        () => {
          this.openSnackBar('Error al identificarse', '', 'alert');
        }
      );
      this.subscriptions.push(subscription);
    }
  }

  openSnackBar(message: string, action: string, className: string) {
    this.snackBar.open(message, action, {
      duration: GLOBAL_CONSTANTS.alertDuration,
      panelClass: [className]
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
    
  }
}


import { environment } from '../../../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { AbstractControl, FormBuilder, FormGroup, NgForm, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.scss']
})
export class ChangePassComponent implements OnInit {
  form: FormGroup;
  token:string;
  loading = false;
  submitted = false;

  environment = environment;

  constructor(private authService:AuthService,
    private formBuilder: FormBuilder,
    private router:Router) {
    this.myFormValues();
   }

  get f() { return this.form.controls; }

  ngOnInit(): void {
    console.log(this.authService.currentUser.token);
  }

  async onSubmit(){

    this.submitted = true;
  
    if (this.form.invalid) { return; }
  
    this.loading = true;

    const result = await this.authService.resetPass({password: this.form.value.password});

    if (result) {
      this.loading = false;
      this.router.navigate(['/auth/login']);
    } else {
      this.loading = false;
      this.form.reset();
    }
    
  }

  
  myFormValues() {
    this.form = this.formBuilder.group(
      {
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator() }
    );
  }

  passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordsMismatch: true };
    }
    return null;
  };
}


}

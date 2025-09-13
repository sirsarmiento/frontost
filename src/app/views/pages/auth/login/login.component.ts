import { UserService } from './../../../../core/services/user.service';

import { User } from './../../../../core/models/user';
import { AuthService } from './../../../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../../shared/components/base/base.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent  implements OnInit {

  email:string;
  password:string;
  returnUrl: any;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService) { 
      super();
    }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  async onLoggedin(form:NgForm) {        
    if (form.valid) {
      const resp = await this.authService.login(this.email, this.password);
      if(resp instanceof User){
        await this.userService.getInfoUser();
        this.router.navigate([this.returnUrl]);
      }else{
        this.setInputError(resp);
      }
      
    }
  }

}

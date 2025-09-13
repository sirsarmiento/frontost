import { User } from './../../../core/models/user';
import { AuthService } from './../../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '../../shared/components/base/base.component';
import { CommonsService } from 'src/app/core/services/commons.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  preserveWhitespaces: true
})
export class DashboardComponent extends BaseComponent implements OnInit {

  user:User;
  processes: number = 0;
  risks: number = 0;
  controls: number = 0;
  events: number = 0;
  plans: number = 0;
  evaluations: number = 0;

  constructor(
    private authService: AuthService,
    private common: CommonsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.user = this.authService.currentUser;
    //this.getResumen();
  }

  //Si cuando el proyecto anance es necesario colocar un resumen en el home como hice en el proyecto Risko
  // getResumen(){
  //   this.common.getResumen().subscribe(( data => {
  //     this.processes = data.processes;
  //     this.risks = data.risks;
  //     this.controls = data.controls;
  //     this.events = data.events;
  //     this.plans = data.plans;
  //     this.evaluations = data.evaluations;
  //   }))
  // }
}
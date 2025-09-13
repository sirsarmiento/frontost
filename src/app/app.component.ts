import { environment } from './../environments/environment';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ChildActivationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = environment.name_system;
  constructor(public router: Router, private titleService: Title) {
    this.router.events
        .pipe(filter(event => event instanceof ChildActivationEnd))
        .subscribe(event => {
            let snapshot = (event as ChildActivationEnd).snapshot;
            while (snapshot.firstChild !== null) {
                snapshot = snapshot.firstChild;
            }
            this.titleService.setTitle(snapshot.data.title || this.title);
        });
}

  ngOnInit(): void {}

}

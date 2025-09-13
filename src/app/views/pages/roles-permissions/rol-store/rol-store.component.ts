import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { SelectOption } from '../../../../core/models/select-option';
import { environment } from '../../../../../environments/environment';
import { RolesPermissionsService } from 'src/app/core/services/roles-permissions.service';
import { Rol } from 'src/app/core/models/rol';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rol-store',
  templateUrl: './rol-store.component.html'
})
export class RolStoreComponent implements OnInit {
  private data$: Observable<Rol>;
  loading = false;
  submitted = false;
  form: FormGroup;
  id: number;

  constructor(private rolesService: RolesPermissionsService,
        private formBuilder: FormBuilder,
           private router: Router,
  ) { 
    this.myFormValues();
    this.data$ = rolesService.sharing;
  }

  get f() { return this.form.controls; }

  ngOnInit() {
    this.setValues();
  }

  setValues(){
    this.data$.subscribe( data => {
      if(data.id > 0){
        this.f.description.setValue(data.descripcion);
        this.id = data.id;
      }
    });
  }

  myFormValues() {
    this.form = this.formBuilder.group({
      description: ['',Validators.required]
    })
  }
  
  onSubmit() {

    this.submitted = true;

    if (this.form.invalid) { return; }

    this.loading = true;

    const rol: Rol = {
      descripcion: this.f.description.value,
      statusId: 1
    }

    console.log(rol);

    if(this.id == 0 || this.id == undefined){
      this.rolesService.add(rol);
    }else{
      this.rolesService.update(this.id, rol);
    }

  }

  back() {
    this.router.navigate(['/roles']);
    this.rolesService.resetData();
  }

}

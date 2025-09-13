import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Config} from 'src/app/core/models/Cost/config';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-asset',
  templateUrl: './add-asset.component.html'
})
export class AddAssetComponent implements OnInit {
  private data$: Observable<Config>;
  form: FormGroup;
  id: number;
  loading = false;
  submitted = false;

  constructor(
    //private projectService: ProjectService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
      this.myFormValues();
      //this.data$ = projectService.sharingProject;
   }

  get f() { return this.form.controls; }

  ngOnInit() {
    this.setValues();
  }




  back() {
    this.router.navigate(['/assets']);
    //this.projectService.resetData();
  }




  setValues(){
    this.data$.subscribe( data => {
      if(data.id > 0){
        // this.f.name.setValue(data.name);
        // this.f.description.setValue(data.type);
        this.id = data.id;
      }
    });
  }

  myFormValues() {
    this.form = this.formBuilder.group({
      asset_type: ['',Validators.required],
      asset_name: ['',Validators.required],
      costo_inicial: ['',Validators.required],
      valor_residual: ['',Validators.required],
      vida_util: ['',Validators.required],
      adquisicion_fecha: ['',Validators.required]
    })
  }

  onSubmit() {

    this.submitted = true;

    if (this.form.invalid) { return; }

    this.loading = true;

    // const config: Config = {
    //   name: this.f.name.value,
    //   type: this.f.type.value,
    //   sector: this.f.sector.value,
    //   empleados: this.f.empleados.value,
    //   rif: this.f.rif.value,
    //   periodo_contable: this.f.periodo_contable.value,
    //   direccion_fiscal: this.f.direccion_fiscal.value,

    //   capacidad_instalada: this.f.capacidad_instalada.value,
    //   capacidad_produccion: this.f.capacidad_produccion.value,
    //   capacidad_ociosa: this.f.capacidad_ociosa.value,
    //   moneda_operacion: this.f.moneda_operacion.value,
    //   centro_costos: this.f.centro_costos.value
    // }

    // console.log(config);

    if(this.id == 0 || this.id == undefined){
      //this.projectService.add(project);
    }else{
      //this.projectService.update(this.id, project);
    }

  }

}

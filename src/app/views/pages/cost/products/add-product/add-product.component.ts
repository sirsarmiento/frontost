import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

import { Config } from 'src/app/core/models/Cost/config';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/core/services/Cost/config.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html'
})
export class AddProductComponent implements OnInit {
  private data$: Observable<Config>;

  form: FormGroup;
  id: number;
  loading = false;
  submitted = false;

  constructor(
    private configService: ConfigService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
      this.myFormValues();
      this.data$ = configService.sharingProject;
   }

  get f() { return this.form.controls; }

  ngOnInit() {
    this.setValues();
  }

  back() {
    this.router.navigate(['/structures']);
    this.configService.resetData();
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
      product_name: ['',Validators.required],
      product_description: ['',Validators.required],
      sku: [''],
      medida: ['',Validators.required],
      clasificacion_costo: ['',Validators.required],

      unidad_medida: ['',Validators.required],
      mp_description: ['',Validators.required],
      proveedor: ['',Validators.required],
      costo_estandar: ['',Validators.required],
      costo_real: ['',Validators.required], 

      mo_rol: ['',Validators.required],
      tipo_contrato: ['',Validators.required],
      mo_description: ['',Validators.required],
      costo_hora: ['',Validators.required],
      salario_mensual: ['',Validators.required],
      horas_mensual: ['',Validators.required],
      turno: ['',Validators.required],

      clasificacion: ['',Validators.required],

      mp_cantidad: ['',Validators.required],
      mo_horas: ['',Validators.required], 
      tasa_aplicacion: ['',Validators.required]
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

    // if(this.id == 0 || this.id == undefined){
    //   this.configService.add(config);
    // }else{
    //   this.configService.update(this.id, config);
    // }

  }

}

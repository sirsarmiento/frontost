import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AssetService } from 'src/app/core/services/Cost/asset.service';
import { Asset } from 'src/app/core/models/Cost/asset';

@Component({
  selector: 'app-add-asset',
  templateUrl: './add-asset.component.html'
})
export class AddAssetComponent implements OnInit {
  private data$: Observable<Asset>;
  form: FormGroup;
  id: number;
  loading = false;
  submitted = false;

  constructor(
    private assetService: AssetService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
      this.myFormValues();
      this.data$ = assetService.sharingProject;
   }

  get f() { return this.form.controls; }

  ngOnInit() {
    this.setValues();
  }

  back() {
    this.router.navigate(['/assets']);
    this.assetService.resetData();
  }

  setValues(){
    this.data$.subscribe( data => {
      if(data.id > 0){
        console.log(data.fechaCompra);
        this.f.nombre.setValue(data.nombre);
        this.f.costoInicial.setValue(data.costoInicial);
        this.f.valorResidual.setValue(data.valorResidual);
        this.f.vidaUtil.setValue(data.vidaUtil);
        this.f.fechaCompra.setValue(data.fechaCompra);
        this.f.tipo.setValue(data.tipo);
        this.id = data.id;
      }
    });
  }

  myFormValues() {
    this.form = this.formBuilder.group({
      nombre: ['',Validators.required],
      costoInicial: ['',Validators.required],
      valorResidual: [''],
      vidaUtil: [''],
      fechaCompra: [''],
      tipo: ['Fijo', Validators.required],
    });

    this.form.get('tipo').valueChanges.subscribe(tipo => {
      const vRes = this.form.get('valorResidual');
      const vUtil = this.form.get('vidaUtil');

      if (tipo === 'Fijo') {
        vRes.setValidators([Validators.required]);
        vUtil.setValidators([Validators.required]);
      } else {
        vRes.clearValidators();
        vUtil.clearValidators();
        // Opcional: resetear a 0 si es circulante
        vRes.setValue(0);
        vUtil.setValue(0);
      }
      vRes.updateValueAndValidity();
      vUtil.updateValueAndValidity();
    });
  }

  onSubmit() {
    this.submitted = true;

    // Validación manual extra solo si es Fijo
    if (this.f.tipo.value === 'Fijo') {
      if (!this.f.valorResidual.value || !this.f.vidaUtil.value) {
        // Opcional: puedes marcar errores manuales aquí
      }
    }
    if (this.form.invalid) { return; }
    this.loading = true;
    
    const activo: Asset = {
      nombre: this.f.nombre.value,
      costoInicial: this.f.costoInicial.value,
      tipo: this.f.tipo.value,
      // Si es Circulante, enviamos valores por defecto para evitar errores
      valorResidual: this.f.tipo.value === 'Fijo' ? this.f.valorResidual.value : 0,
      vidaUtil: this.f.tipo.value === 'Fijo' ? this.f.vidaUtil.value : 0,
      fechaCompra: this.f.tipo.value === 'Fijo' ? this.f.fechaCompra.value : new Date(),
    };

    if (this.id == 0 || this.id == undefined) {
      this.assetService.add(activo);
    } else {
      this.assetService.update(this.id, activo);
    }
  }

}

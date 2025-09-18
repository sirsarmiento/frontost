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
        this.id = data.id;
      }
    });
  }

  myFormValues() {
    this.form = this.formBuilder.group({
      nombre: ['',Validators.required],
      costoInicial: ['',Validators.required],
      valorResidual: ['',Validators.required],
      vidaUtil: ['',Validators.required],
      fechaCompra: ['',Validators.required],
    })
  }

  onSubmit() {

    this.submitted = true;

    if (this.form.invalid) { return; }

    this.loading = true;

    const activo: Asset = {
      nombre: this.f.nombre.value,
      costoInicial: this.f.costoInicial.value,
      valorResidual: this.f.valorResidual.value,
      vidaUtil: this.f.vidaUtil.value,
      fechaCompra: this.f.fechaCompra.value,
    }

    console.log(activo);

    if(this.id == 0 || this.id == undefined){
      this.assetService.add(activo);
    }else{
      this.assetService.update(this.id, activo);
    }

  }

}

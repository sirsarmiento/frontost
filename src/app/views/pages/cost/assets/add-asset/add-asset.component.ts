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
    this.setupLogicCalcularTotal();
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

        this.f.cantidad.setValue(data.cantidad);
        this.f.unidadMedida.setValue(data.unidadMedida);
        this.f.presentacion.setValue(data.presentacion);
        this.f.descripcion.setValue(data.descripcion);
        this.f.ubicacion.setValue(data.ubicacion);
        this.f.valorUnitario.setValue(data.valorUnitario);
        this.id = data.id;
      }
    });
  }

  myFormValues() {
    this.form = this.formBuilder.group({
      nombre: ['',Validators.required],
      costoInicial: [{ value: '', disabled: false }, Validators.required],
      tipo: ['Fijo', Validators.required],
      // Campos de Fijos
      valorResidual: [''],
      vidaUtil: [''],
      fechaCompra: [''],
      // Campos de Circulantes
      cantidad: [''],
      unidadMedida: [''],
      presentacion: [''],
      descripcion: [''],
      ubicacion: [''],
      valorUnitario: ['']
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

  private actualizarValidaciones(tipo: string) {
    const camposFijos = ['valorResidual', 'vidaUtil', 'fechaCompra'];
    const camposCirculantes = ['cantidad', 'valorUnitario', 'ubicacion'];

    if (tipo === 'Fijo') {
      this.setValidators(camposFijos, [Validators.required]);
      this.setValidators(camposCirculantes, []);
      this.form.get('costoInicial').enable(); // En fijos se escribe manual
    } else {
      this.setValidators(camposFijos, []);
      this.setValidators(camposCirculantes, [Validators.required]);
      this.form.get('costoInicial').disable(); // En circulantes es autocalculado
    }
  }

  private setValidators(campos: string[], validators: any[]) {
    campos.forEach(nombre => {
      const control = this.form.get(nombre);
      control.setValidators(validators);
      control.updateValueAndValidity();
    });
  }

  // Lógica para que Valor Total = Cantidad * Valor Unitario
  setupLogicCalcularTotal() {
    const calcular = () => {
      if (this.f.tipo.value === 'Circulante') {
        const total = (this.f.cantidad.value || 0) * (this.f.valorUnitario.value || 0);
        this.form.get('costoInicial').setValue(total, { emitEvent: false });
      }
    };

    this.form.get('cantidad').valueChanges.subscribe(calcular);
    this.form.get('valorUnitario').valueChanges.subscribe(calcular);
  }

  onSubmit() {
    this.submitted = true;

    // Si el formulario es inválido, no continuamos
    if (this.form.invalid) { return; }
    
    this.loading = true;

    // Usamos getRawValue() para obtener los valores incluso de campos disabled (como costoInicial en circulantes)
    const formValues = this.form.getRawValue();

    const activo: Asset = {
      nombre: formValues.nombre,
      tipo: formValues.tipo,
      costoInicial: formValues.costoInicial,
      
      // Campos específicos para FIJOS
      valorResidual: formValues.tipo === 'Fijo' ? formValues.valorResidual : 0,
      vidaUtil: formValues.tipo === 'Fijo' ? formValues.vidaUtil : 0,
      fechaCompra: formValues.tipo === 'Fijo' ? formValues.fechaCompra : new Date(),

      // Campos específicos para CIRCULANTES
      cantidad: formValues.tipo === 'Circulante' ? formValues.cantidad : 0,
      valorUnitario: formValues.tipo === 'Circulante' ? formValues.valorUnitario : 0,
      unidadMedida: formValues.tipo === 'Circulante' ? formValues.unidadMedida : '',
      presentacion: formValues.tipo === 'Circulante' ? formValues.presentacion : '',
      descripcion: formValues.tipo === 'Circulante' ? formValues.descripcion : '',
      ubicacion: formValues.tipo === 'Circulante' ? formValues.ubicacion : '',
    };

    console.log('Objeto a enviar:', activo);

    if (this.id === 0 || this.id === undefined) {
      this.assetService.add(activo);
    } else {
      this.assetService.update(this.id, activo);
    }
  }

}

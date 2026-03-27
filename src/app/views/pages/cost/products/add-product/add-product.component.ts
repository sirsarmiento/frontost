import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from 'src/app/core/models/Cost/product';
import { ProductService } from 'src/app/core/services/Cost/product.service';
import { ConfigService } from 'src/app/core/services/Cost/config.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html'
})
export class AddProductComponent implements OnInit {
  private data$: Observable<Product>;
  form: FormGroup;
  id: number;
  loading = false;
  submitted = false;
  configs: any[] = [];

  constructor(
    private configService: ConfigService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
      this.myFormValues();
      this.data$ = productService.sharingProject;
   }

  get f() { return this.form.controls; }

  ngOnInit() {
    this.loadConfigs();
    this.setValues();

    this.form.get('medida')?.valueChanges.subscribe(value => {
      this.onMedidaChange(value);
    });
  }

  // Función para mostrar/ocultar campo periodo
  shouldShowPeriodoField(): boolean {
    return this.form.get('medida')?.value === 'Horas hombres' || this.form.get('medida')?.value === 'Horas máquina';
  }

 // Manejar cambio de clasificación
  onMedidaChange(medida: string) {
    if (medida !== 'Horas hombres' && 'Horas máquina') {
      this.form.get('periodo')?.setValue(''); // Limpiar producto si no es directo
    }
  }

  loadConfigs() {
    this.configService.getAll().subscribe((resp: any) => {
      this.configs = resp.data || []; 

      // Si hay al menos una empresa y el control existe, selecciona la primera
      if (this.configs.length > 0 && this.form?.get('perfil')) {
        // Establece el valor con el id de la primera empresa
        this.form.get('perfil').setValue(this.configs[0].id);
      }
    });
  }

  back() {
    this.router.navigate(['/products']);
    this.productService.resetData();
  }

  setValues(){
    this.data$.subscribe( data => {
      if(data.id > 0){
        this.f.nombre.setValue(data.nombre);
        this.f.medida.setValue(data.medida);
        this.f.sku.setValue(data.sku);
        this.f.clasificacion.setValue(data.clasificacion);
        this.f.descripcion.setValue(data.descripcion);
        this.f.perfil.setValue(data.perfil);
        this.f.periodo.setValue(data.periodo);
        this.id = data.id;
      }
    });
  }

  myFormValues() {
    this.form = this.formBuilder.group({
      nombre: ['',Validators.required],
      medida: ['',Validators.required],
      sku: [''],
      descripcion: ['',Validators.required],
      clasificacion: ['',Validators.required],
      perfil: [''],
      periodo:  [''],
    })
  }

  onSubmit() {

    this.submitted = true;

    if (this.form.invalid) { return; }

    this.loading = true;

    const product: Product = {
      nombre: this.f.nombre.value,
      sku: this.f.sku.value,
      descripcion: this.f.descripcion.value,
      clasificacion: this.f.clasificacion.value,
      medida: this.f.medida.value,
      perfil: this.f.perfil.value,
      periodo: this.f.periodo.value,
    }

    console.log(product);

    if(this.id == 0 || this.id == undefined){
      this.productService.add(product);
    }else{
      this.productService.update(this.id, product);
    }

  }

}

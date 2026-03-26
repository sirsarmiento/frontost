import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Fixe } from 'src/app/core/models/Cost/fixe';
import { FixeService } from 'src/app/core/services/Cost/fixe.service';
import { ProductService } from 'src/app/core/services/Cost/product.service';

@Component({
  selector: 'app-add-fixe',
  templateUrl: './add-fixe.component.html'
})
export class AddFixeComponent implements OnInit {
  private data$: Observable<Fixe>;
  form: FormGroup;
  id: number;
  loading = false;
  submitted = false;
  products: any[] = [];

  constructor(
    private productService: ProductService,
    private fixeService: FixeService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
      this.myFormValues();
      this.data$ = fixeService.sharingProject;
   }

  get f() { return this.form.controls; }

  opcionesConceptos: any = {
    'Fijo': [
      'Alquiler', 'Salarios base', 'Seguros', 
      'Suscripciones y licencias', 'Impuestos', 
      'Servicios básicos (parte fija)',
      'Otro'
    ],
    'Variable': [
      'Materia prima e insumos', 'Costos de envío y distribución', 
      'Comisiones de ventas', 'Empaquetado y embalaje', 
      'Servicios básicos (por uso)',
      'Otro'
    ]
  };

  conceptosMostrados: string[] = [];

  ngOnInit(): void {
    // Lógica de Productos y Valores iniciales
    this.loadProducts();
    this.setValues();

    // Lógica de Conceptos Dinámicos 
    this.form.get('tipo')?.valueChanges.subscribe(valor => {
      this.conceptosMostrados = this.opcionesConceptos[valor] || [];
      // Limpiamos el concepto solo si el usuario interactúa 
      this.form.get('concepto')?.setValue(''); 
    });

    // Escuchamos el cambio de 'clasificacion'
    this.form.get('clasificacion')?.valueChanges.subscribe(value => {
      this.onClasificacionChange(value);
    });

    // Si ya viene un valor cargamos la lista inicial
    const tipoInicial = this.form.get('tipo')?.value;
    if (tipoInicial) {
      this.conceptosMostrados = this.opcionesConceptos[tipoInicial] || [];
    }
  }

  // Función para mostrar/ocultar campo producto
  shouldShowProductoField(): boolean {
    return this.form.get('clasificacion')?.value === 'Directo';
  }

 // Manejar cambio de clasificación
  onClasificacionChange(clasificacion: string) {
    if (clasificacion !== 'Directo') {
      this.form.get('producto')?.setValue(''); // Limpiar producto si no es directo
    }
  }

  loadProducts() {
    this.productService.getAll().subscribe((resp: any) => {
      this.products = resp.data || []; 
      console.log('Productos cargados:', this.products);
    });
  }
  

  back() {
    this.router.navigate(['/fixes']);
    this.fixeService.resetData();
  }

  setValues(){
    this.data$.subscribe( data => {
      console.log(data);
      if(data.id > 0){
        this.f.tipo.setValue(data.tipo);
        this.f.concepto.setValue(data.concepto);
        this.f.precio.setValue(data.precio);
        this.f.clasificacion.setValue(data.clasificacion);
        this.f.producto.setValue(data.producto);
        this.id = data.id;
      }
    });
  }

  myFormValues() {
    this.form = this.formBuilder.group({
      tipo: ['',Validators.required],
      concepto: ['',Validators.required],
      otroConcepto: [''],
      precio: ['',Validators.required],
      clasificacion: ['',Validators.required],
      producto: [''],
    })
  }

  onSubmit() {
    this.submitted = true;

    // Validación manual: Si eligió 'Otro', el campo de texto es obligatorio
    if (this.f.concepto.value === 'Otro' && !this.f.otroConcepto.value) {
      this.f.otroConcepto.setErrors({ required: true });
      return;
    }

    if (this.form.invalid) { return; }
    this.loading = true;

    const conceptoFinal = this.f.concepto.value === 'Otro' 
      ? this.f.otroConcepto.value 
      : this.f.concepto.value;

    const costo: Fixe = {
      tipo: this.f.tipo.value,
      concepto: conceptoFinal,
      precio: this.f.precio.value,
      clasificacion: this.f.clasificacion.value,
      producto: this.f.producto.value,
    }

    console.log(costo);

    if(this.id == 0 || this.id == undefined){
      this.fixeService.add(costo);
    } else {
      this.fixeService.update(this.id, costo);
    }
  }

}

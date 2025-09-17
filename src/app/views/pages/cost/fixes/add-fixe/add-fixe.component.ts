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

  ngOnInit() {
    this.loadProducts();
    this.setValues();
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
      precio: ['',Validators.required],
      clasificacion: ['',Validators.required],
      producto: [''],
    })
  }

  onSubmit() {

    this.submitted = true;

    if (this.form.invalid) { return; }

    this.loading = true;

    const costo: Fixe = {
      tipo: this.f.tipo.value,
      concepto: this.f.concepto.value,
      precio: this.f.precio.value,
      clasificacion: this.f.clasificacion.value,
      producto: this.f.producto.value,
    }

    console.log(costo);

    if(this.id == 0 || this.id == undefined){
      this.fixeService.add(costo);
    }else{
      this.fixeService.update(this.id, costo);
    }

  }

}

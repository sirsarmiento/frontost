import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from 'src/app/core/models/Cost/product';
import { ProductService } from 'src/app/core/services/Cost/product.service';

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

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
      this.myFormValues();
      this.data$ = productService.sharingProject;
   }

  get f() { return this.form.controls; }

  ngOnInit() {
    this.setValues();
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
    }

    console.log(product);

    if(this.id == 0 || this.id == undefined){
      this.productService.add(product);
    }else{
      this.productService.update(this.id, product);
    }

  }

}

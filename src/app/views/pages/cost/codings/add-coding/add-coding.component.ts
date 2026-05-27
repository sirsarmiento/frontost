import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { FamilyService } from 'src/app/core/services/Cost/family.service';
import { ProductService } from 'src/app/core/services/Cost/product.service';
import { CodingService } from 'src/app/core/services/Cost/coding.service';
import { Family, Subcategory } from 'src/app/core/models/Cost/family';
import { Product } from 'src/app/core/models/Cost/product';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-coding',
  templateUrl: './add-coding.component.html',
  styleUrls: ['./add-coding.component.scss']
})
export class AddCodingComponent implements OnInit {
  form: FormGroup;
  id: number;
  private data$: Observable<any>;
  loading = false;
  submitted = false;
  familias: Family[] = [];
  subcategorias: Subcategory[] = [];
  productos: any[] = [];
  productosFiltrados: any[] = [];

  // Options
  opcionesCategorias = [
    { value: 'PF', label: 'Producto Fabricado (PF)' },
    { value: 'SR', label: 'Servicio (SR)' },
    { value: 'PP', label: 'Proyecto Personalizado (PP)' }
  ];

  opcionesTecnologias = [
    { value: 'FDM', label: 'FDM (Filamento)' },
    { value: 'SLA', label: 'SLA (Resina)' }
  ];

  opcionesMateriales = [
    { value: 'PLA', label: 'PLA (Ácido Poliláctico)' },
    { value: 'ABS', label: 'ABS (Acrilonitrilo Butadieno Estireno)' },
    { value: 'PET', label: 'PET (Polietileno Tereftalato)' },
    { value: 'RES', label: 'RES (Resina)' }
  ];

  opcionesUnidades = [
    { value: 'g', label: 'Gramos (g)' },
    { value: 'kg', label: 'Kilogramos (kg)' },
    { value: 'ml', label: 'Mililitros (ml)' },
    { value: 'L', label: 'Litros (L)' },
    { value: 'm', label: 'Metros (m)' },
    { value: 'u', label: 'Unidades (u)' }
  ];

  // Live preview properties
  previewCat = '??';
  previewTec = '???';
  previewMat = '???';
  previewFam = '???';
  previewSub = '';
  previewCorr = '???';
  previewFull = '?? - ??? - ??? - ??? - ???';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private familyService: FamilyService,
    private productService: ProductService,
    private codingService: CodingService
  ) {
    this.myFormValues();
    this.data$ = codingService.sharingProject;
  }

  ngOnInit(): void {
    this.cargarFamilias();
    this.cargarProductos();
    this.setupPreviewListeners();
    this.setValues();
  }

  myFormValues() {
    this.form = this.formBuilder.group({
      categoria: ['PF', Validators.required],
      productoId: ['', Validators.required],
      nombreServicio: [''],
      tecnologia: ['', Validators.required],
      material: ['', Validators.required],
      familia: ['', Validators.required],
      subcategoria: [''],
      materialesMolde: this.formBuilder.array([])
    });
  }

  get f() { return this.form.controls; }

  get materialesMolde(): FormArray {
    return this.form.get('materialesMolde') as FormArray;
  }

  addMaterialMolde() {
    this.materialesMolde.push(this.formBuilder.group({
      material: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(0)]],
      unidad: ['', Validators.required]
    }));
  }

  removeMaterialMolde(index: number) {
    this.materialesMolde.removeAt(index);
  }

  cargarFamilias() {
    this.familyService.getAll().subscribe(resp => {
      this.familias = resp.data || [];
    });
  }

  cargarProductos() {
    this.productService.getAll().subscribe((resp: any) => {
      const allProducts = resp.data || [];
      
      this.productos = allProducts.filter((p: Product) => {
        if (!p.sku) return true;
        const s = p.sku.trim().toLowerCase();
        return s === '' || s === 'null' || s === 'sin asignar' || s === 'n/a';
      });
      
      this.productosFiltrados = [...this.productos];
    });
  }

  onCategoryChange() {
    const cat = this.form.get('categoria')?.value;
    if (cat === 'PF') {
      this.form.get('productoId')?.setValidators(Validators.required);
      this.form.get('nombreServicio')?.clearValidators();
      this.form.get('nombreServicio')?.setValue('');
    } else {
      this.form.get('nombreServicio')?.setValidators(Validators.required);
      this.form.get('productoId')?.clearValidators();
      this.form.get('productoId')?.setValue('');
    }
    this.form.get('productoId')?.updateValueAndValidity();
    this.form.get('nombreServicio')?.updateValueAndValidity();

    // Actualizar preview correlativo
    this.previewCat = cat || '??';
    this.previewCorr = cat === 'SR' ? 'SXX (Autogenerado)' : (cat === 'PP' ? 'PXX (Autogenerado)' : 'XXX (Autogenerado)');
    this.updatePreviewFull();
  }

  setupPreviewListeners() {
    this.form.get('familia')?.valueChanges.subscribe(famCode => {
      const chosenFamily = this.familias.find(f => f.codigo === famCode);
      this.subcategorias = chosenFamily?.subcategories || [];

      const subControl = this.form.get('subcategoria');
      if (this.subcategorias.length > 0) {
        subControl?.setValidators(Validators.required);
      } else {
        subControl?.clearValidators();
      }
      subControl?.setValue('', { emitEvent: false });
      subControl?.updateValueAndValidity({ emitEvent: false });

      // Manejar el caso especial de Molde (MLD)
      const materialControl = this.form.get('material');
      if (famCode === 'MLD') {
        materialControl?.clearValidators();
        materialControl?.setValue('');
        if (this.materialesMolde.length === 0) {
          this.addMaterialMolde();
        }
      } else {
        materialControl?.setValidators(Validators.required);
        this.materialesMolde.clear();
      }
      materialControl?.updateValueAndValidity();

      this.previewSub = '';
      this.updatePreviewFull();
    });

    this.form.valueChanges.subscribe(val => {
      this.previewCat = val.categoria || '??';
      this.previewTec = val.tecnologia || '???';

      if (val.familia === 'MLD' && val.materialesMolde && val.materialesMolde.length > 0) {
        const mats = val.materialesMolde.map((m: any) => m.material).filter((m: string) => !!m);
        this.previewMat = mats.length > 0 ? mats.join('-') : '???';
      } else {
        this.previewMat = val.material || '???';
      }

      const chosenFamily = this.familias.find(f => f.codigo === val.familia);
      this.previewFam = chosenFamily ? chosenFamily.codigo : '???';
      this.previewSub = val.subcategoria || '';
      this.previewCorr = val.categoria === 'SR' ? 'SXX' : (val.categoria === 'PP' ? 'PXX' : 'XXX');

      this.updatePreviewFull();
    });

    this.onCategoryChange();
  }

  updatePreviewFull() {
    const base = `${this.previewCat} - ${this.previewTec} - ${this.previewMat} - ${this.previewFam}`;
    if (this.previewSub) {
      this.previewFull = `${base} - ${this.previewSub}${this.previewCorr}`;
    } else {
      this.previewFull = `${base} - ${this.previewCorr}`;
    }
  }

  back() {
    this.codingService.resetData();
    this.router.navigate(['/codings/coding']);
  }

  setValues() {
    this.data$.subscribe(data => {
      if (data && data.id > 0) {
        this.id = data.id;
        this.f.categoria.setValue(data.categoria);
        this.f.tecnologia.setValue(data.tecnologia);
        this.f.material.setValue(data.material);
        this.f.familia.setValue(data.familia);
        this.f.subcategoria.setValue(data.subcategoria);
        
        if (data.categoria !== 'PF') {
           this.f.nombreServicio.setValue(data.productName);
        } else if (data.productId) {
           this.f.productoId.setValue(data.productId);
        }
      }
    });
  }

  async onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    // Obtener nombre del producto / servicio
    let pName = '';
    const cat = this.form.value.categoria;
    if (cat === 'PF') {
      const selectedProd = this.productos.find(p => p.id === this.form.value.productoId);
      pName = selectedProd ? selectedProd.nombre : 'Producto';
    } else {
      pName = this.form.value.nombreServicio;
    }

    let matValue = this.form.value.material;
    let payloadMats = [];
    if (this.form.value.familia === 'MLD') {
      matValue = this.form.value.materialesMolde.map((m: any) => m.material).join('-');
      payloadMats = this.form.value.materialesMolde;
    }

    const payload = {
      productId: this.form.value.productoId,
      productName: pName,
      categoria: cat,
      tecnologia: this.form.value.tecnologia,
      material: matValue,
      materialesMolde: payloadMats,
      familia: this.form.value.familia,
      subcategoria: this.form.value.subcategoria
    };

    try {
      let result;
      if (this.id) {
        result = await this.codingService.update(this.id, payload);
        Swal.fire('Actualizado', 'Código actualizado exitosamente', 'success').then(() => {
          this.router.navigate(['/codings/coding']);
        });
      } else {
        result = await this.codingService.add(payload);

        if (cat === 'PF' && payload.productId) {
          const prodIndex = this.productos.findIndex(p => p.id === payload.productId);
          if (prodIndex !== -1) {
            this.productos[prodIndex].sku = result.data.sku;
          }
        }

        Swal.fire({
          title: 'Código Generado con Éxito',
          html: `Se ha registrado el SKU: <strong class="text-primary font-monospace">${result.data.sku}</strong> para <strong>${pName}</strong>.`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/codings/coding']);
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo generar el código. Intente de nuevo.', 'error');
    } finally {
      this.loading = false;
    }
  }

  filterProducts(event: Event) {
    const input = event.target as HTMLInputElement;
    const query = input.value.toLowerCase().trim();// .trim() quita espacios extras

    if (!query) {
      // Si el buscador está vacío, mostramos todos de nuevo
      this.productosFiltrados = [...this.productos];
      return;
    }

    // Filtra por cualquier coincidencia en el nombre
    this.productosFiltrados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(query)
    );
  }
}

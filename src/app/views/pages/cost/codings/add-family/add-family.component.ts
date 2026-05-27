import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FamilyService } from 'src/app/core/services/Cost/family.service';
import { Family } from 'src/app/core/models/Cost/family';
import Swal from 'sweetalert2';
import { Subcategory } from 'src/app/core/models/Cost/family';

@Component({
  selector: 'app-add-family',
  templateUrl: './add-family.component.html'
})
export class AddFamilyComponent implements OnInit {
  private data$: Observable<Family>;
  form: FormGroup;
  id: number = 0;
  loading = false;
  submitted = false;

  // Subcategory management fields
  displayedColumns: string[] = ['codigo', 'nombre', 'acciones'];
  subcategoriesList: any[] = [];
  subCode = '';
  subDesc = '';
  subSubmitted = false;
  subError = '';

  constructor(
    private familyService: FamilyService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.myFormValues();
    this.data$ = this.familyService.sharingProject;
  }

  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.setValues();
  }

  myFormValues() {
    this.form = this.formBuilder.group({
      codigo: ['', [Validators.required, Validators.maxLength(3), Validators.pattern('^[a-zA-Z]{1,3}$')]],
      nombre: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  setValues() {
    this.data$.subscribe(data => {
      if (data && data.id! > 0) {
        this.form.patchValue({
          codigo: data.codigo,
          nombre: data.nombre
        });
        this.id = data.id!;
        this.subcategoriesList = data.subcategories ? [...data.subcategories] : [];
      }
    });
  }

  addSubcategory() {
    this.subSubmitted = true;
    this.subError = '';

    const code = this.subCode.trim().toUpperCase();
    const desc = this.subDesc.trim();

    if (!code || code.length > 3 || !/^[A-Z]{1,3}$/.test(code)) {
      this.subError = 'El código debe tener máximo 3 letras de la A a la Z.';
      return;
    }

    if (!desc || desc.length < 3) {
      this.subError = 'La descripción debe tener al menos 3 caracteres.';
      return;
    }

    if (this.subcategoriesList.some(s => s.codigo === code)) {
      this.subError = 'Ya existe una subcategoría con este código.';
      return;
    }

    this.subcategoriesList.push({
      codigo: code,
      nombre: desc
    });
    this.subcategoriesList = [...this.subcategoriesList];

    this.subCode = '';
    this.subDesc = '';
    this.subSubmitted = false;
  }

  removeSubcategory(index: number) {
    this.subcategoriesList.splice(index, 1);
    this.subcategoriesList = [...this.subcategoriesList];
  }

  back() {
    this.router.navigate(['/codings/coding']);
    this.familyService.resetData();
  }

  async onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const familyData: Family = {
      codigo: this.form.value.codigo.toUpperCase(),
      nombre: this.form.value.nombre,
      subcategories: this.subcategoriesList
    };

    try {
      if (this.id && this.id > 0) {
        await this.familyService.update(this.id, familyData);
        Swal.fire('Éxito', 'Familia actualizada correctamente', 'success');
      } else {
        await this.familyService.add(familyData);
        Swal.fire('Éxito', 'Familia registrada correctamente', 'success');
      }
      this.router.navigate(['/codings/coding']);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo guardar la familia', 'error');
    } finally {
      this.loading = false;
    }
  }
}

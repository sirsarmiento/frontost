import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Budget, Parts } from 'src/app/core/models/Cost/budge';
import { BudgetService } from 'src/app/core/services/Cost/budget.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-add-budget',
  templateUrl: './add-budget.component.html',
  styleUrls: ['./add-budget.component.scss']
})
export class AddBudgetComponent implements OnInit {
  private data$: Observable<Budget>;
  selectedRow: any;
  form: FormGroup;
  id: number;
  loading = false;
  submitted = false;
  showList = true;
  piezas: Parts[] = [];

  piezaCounter: number = 1;

  displayedColumns: string[] = ['nombre', 'gramos', 'metros', 'horas', 'minutos', 'actions'];
  dataSource: MatTableDataSource<Parts>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  
  constructor(
    private budgetService: BudgetService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
      this.myFormValues();
      this.data$ = budgetService.sharing;
   }

  get f() { return this.form.controls; }

  ngOnInit() {
    this.setValues();
  }

  back() {
    this.router.navigate(['/budgets']);
    this.budgetService.resetData();
  }

  addPart(){
    const requiredFields = [
      { field: this.f.nombre, message: 'el nombre' },
      { field: this.f.gramos, message: 'los gramos' },
      { field: this.f.metros, message: 'los metros' },
      { field: this.f.horas, message: 'las horas' },
      { field: this.f.minutos, message: 'los minutos' }
    ];

    for (const { field, message } of requiredFields) {
      const value = field.value;
      
      // Validar específicamente para string vacío, null o undefined
      if (value === null || value === undefined || value === '' || value.toString().trim() === '') {
        Swal.fire('Por Favor', `Debe agregar ${message}`, 'info');
        return;
      }
    }
      // Validar si ya existe la máquina
    const nombre = this.f.nombre.value.toString().trim();

    const exists = this.piezas.some(part =>
      part.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (exists) {
      Swal.fire('', 'Esta pieza ya fue agregada', 'info');
      return;
    }

   // Agregar la pieza
    this.onAddPart();

  }

  onAddPart() {
    const newParts = {
      id: this.generateUniqueId(),
      nombre: this.f.nombre.value.toString().trim().toUpperCase(),
      gramos: this.f.gramos.value,
      metros: this.f.metros.value, 
      horas: this.f.horas.value,
      minutos: this.f.minutos.value,
    };

    this.piezaCounter++; // Incrementar el contador

    this.piezas.push(newParts);
    this.refreshList();
    this.clearForm();

  }

  // Agrega esta función en tu componente
  getTotales() {
    return {
      totalGramos: this.piezas.reduce((sum, pieza) => sum + (+pieza.gramos || 0), 0),
      totalMetros: this.piezas.reduce((sum, pieza) => sum + (+pieza.metros || 0), 0),
      totalHoras: this.piezas.reduce((sum, pieza) => sum + (+pieza.horas || 0), 0),
      totalMinutos: this.piezas.reduce((sum, pieza) => sum + (+pieza.minutos || 0), 0)
    };
  }



  // Método adicional para generar ID único
  generateUniqueId(): number {
    return this.piezas.length > 0 
      ? Math.max(...this.piezas.map(m => m.id)) + 1 
      : 1;
  }

  // Método para limpiar el formulario después de agregar
  clearForm() {
    this.f.nombre.setValue(`PIEZA ${this.piezaCounter}`);
    this.f.gramos.setValue('');
    this.f.metros.setValue('');
    this.f.horas.setValue('');
    this.f.minutos.setValue('');
  }

  refreshList(){

    this.dataSource = new MatTableDataSource(this.piezas);

    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (this.piezas.length == 0){
      this.showList = true;
    }else{
      this.showList = false;
    }
  }



  onDelete(row: Parts){
    Swal.fire({
      title:  `¿ Estás seguro que deseas eliminar de la lista ${ row.nombre }?`,
      showDenyButton: true,
      confirmButtonText: `Eliminar`,
      }).then((result) => {
        if (result.isConfirmed){
            this.piezas.forEach((element,index)=>{
              if(element.id==row.id) {
                this.piezas.splice(index,1);
                this.piezaCounter = this.piezaCounter - 1;
                this.f.nombre.setValue(`PIEZA ${this.piezaCounter}`);
                //this.budgetService.delete(row.id);
                this.refreshList();
              }
            });
        }
      })
  }

  setValues(){
    this.data$.subscribe( data => {
      if(data.id > 0){
        console.log(data);
        this.f.clasificacion.setValue(data.clasificacion);
        this.f.descripcion.setValue(data.descripcion);
        this.f.numero.setValue(data.numero);
        this.f.fecha.setValue(data.fecha);
        this.piezas = data.piezas;
        this.id = data.id;

        this.clearForm();
        this.f.nombre.setValue(`PIEZA ${data.piezas.length + 1}`);
        this.refreshList();
     
      }
    });
  }

  myFormValues() {
    this.form = this.formBuilder.group({
      clasificacion: ['',Validators.required],
      descripcion: ['',Validators.required],
      numero: ['',Validators.required],
      fecha: ['',Validators.required],

      nombre: [`PIEZA ${this.piezaCounter}`],
      gramos: [],
      metros: [],
      horas: [],
      minutos: [],
    })
  }

  onSubmit() {

    this.submitted = true;



    if (this.form.invalid) { return; }

    this.loading = true;

    const budget: Budget = {
      clasificacion: this.f.clasificacion.value,
      descripcion: this.f.descripcion.value,
      numero: this.f.numero.value,
      fecha: this.f.fecha.value,
      piezas: this.piezas
    }

    console.log(budget);

    if(this.id == 0 || this.id == undefined){
      this.budgetService.add(budget);
    }else{
      this.budgetService.update(this.id, budget);
    }

  }
}

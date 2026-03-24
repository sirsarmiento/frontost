import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Budget, Parts } from 'src/app/core/models/Cost/budge';

export interface DialogData { item: Budget }

@Component({
  selector: 'app-modal-generic',
  templateUrl: './modal-generic.component.html',
  styleUrls: ['./modal-generic.component.scss']
})
export class ModalGenericComponent implements OnInit {
  form: FormGroup;
  title: string = '';
  submitted = false;
  loading = false;
  selectedRow: any;

  totalMetros: number = 0;
  totalGramos: number = 0;
  totalHorasUso: number = 0;
  metrosEstudios: number = 0;
  gramosEstudios: number = 0;
  materialHorasMetros: number = 0;
  materialHorasGramos: number = 0;

  piezas: Parts[] = [];

  displayedColumns: string[] = ['nombre', 'gramos', 'metros', 'horas', 'minutos', 'material', 'horaEquipo', 'valor'];
  dataSource: MatTableDataSource<Parts>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
     public dialogRef: MatDialogRef<ModalGenericComponent>,
     private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.myFormValues();
  }

   get f() { return this.form.controls; }

  ngOnInit(): void {

    this.title = 'Estudio de Presupuesto';

    this.piezas = this.data.item.piezas;
    this.refreshList();
  }

  onSubmit() {

    this.submitted = true;

    if (this.form.invalid) { return; }

    this.loading = true;

    // const budget: Budget = {
    //   clasificacion: this.f.clasificacion.value,
    //   descripcion: this.f.descripcion.value,
    //   numero: this.f.numero.value,
    //   fecha: this.f.fecha.value,
    //   piezas: this.piezas
    // }

    // console.log(budget);

    // if(this.id == 0 || this.id == undefined){
    //   this.budgetService.add(budget);
    // }else{
    //   this.budgetService.update(this.id, budget);
    // }

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

  getMaterial(pieza: Parts){
    return (((pieza.gramos * this.f.costo.value) / this.f.gramos.value ) + ((pieza.metros * this.f.costo.value) / this.f.metros.value)) / 2;
  }
  
  getHoraEquipo(pieza: Parts){
    return (((((pieza.horas * 60) / 1)) + (pieza.minutos * 1)) / 60);
  }

  getValorAgregado(pieza: Parts){
    let material = (((pieza.gramos * this.f.costo.value) / this.f.gramos.value ) + ((pieza.metros * this.f.costo.value) / this.f.metros.value)) / 2;
    let hora = (((((pieza.horas * 60) / 1)) + (pieza.minutos * 1)) / 60);

    let total = material + hora;
    let porc = this.f.valor.value / 100;

    return (total * porc) + total;
  }

  getMetros(){
    this.totalMetros = this.piezas.reduce((sum, pieza) => sum + (+pieza.metros || 0), 0);
    this.metrosEstudios = (this.totalMetros * this.f.costo.value) / this.f.metros.value;
    return this.metrosEstudios;
  }

  getGramos(){
    this.totalGramos = this.piezas.reduce((sum, pieza) => sum + (+pieza.gramos || 0), 0);
    this.gramosEstudios = (this.totalGramos * this.f.costo.value) / this.f.gramos.value;
    return this.gramosEstudios;
  }

  getHoras(){
    let totalHoras = this.piezas.reduce((sum, pieza) => sum + (+pieza.horas || 0), 0);
    let totalMinutos = this.piezas.reduce((sum, pieza) => sum + (+pieza.minutos || 0), 0);

    const totalEnHoras = totalHoras + (totalMinutos / 60);

    this.totalHorasUso = this.f.horas.value * totalEnHoras;

    return this.totalHorasUso;
  }

  getMaterialHorasMetros(){
    this.materialHorasMetros = this.totalHorasUso + this.metrosEstudios;
    return this.materialHorasMetros;
  }
  

  getMaterialHorasGramos(){
    this.materialHorasGramos = this.totalHorasUso + this.gramosEstudios;
    return this.materialHorasGramos;
  }

  getValorAgregadoMetros(){
    return (this.materialHorasMetros * (this.f.valor.value / 100)) + this.materialHorasMetros;
  }
  
  getValorAgregadoGramos(){
    return (this.materialHorasGramos * (this.f.valor.value / 100)) + this.materialHorasGramos;
  }
  
  refreshList(){

    this.dataSource = new MatTableDataSource(this.piezas);

    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  myFormValues() {
    this.form = this.formBuilder.group({
      costo: [0,Validators.required],
      gramos: [1000,Validators.required],
      metros: [400,Validators.required],
      horas: [1,Validators.required],
      valor: [30,Validators.required]
    })
  }


}

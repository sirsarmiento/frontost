import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Budget, Parts } from 'src/app/core/models/Cost/budge';
import { AssetService } from 'src/app/core/services/Cost/asset.service';
import { FixeService } from 'src/app/core/services/Cost/fixe.service';
import { BudgetService } from 'src/app/core/services/Cost/budget.service';
import { forkJoin } from 'rxjs';

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
  nombreMaquinaSelected: string = 'N/A';
  costoIndirectoAsignado: number = 0;

  displayedColumns: string[] = ['nombre', 'gramos', 'metros', 'horas', 'minutos', 'material', 'horaEquipo', 'valor'];
  dataSource: MatTableDataSource<Parts>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
     public dialogRef: MatDialogRef<ModalGenericComponent>,
     private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private assetService: AssetService,
    private fixeService: FixeService,
    private budgetService: BudgetService
  ) {
    this.myFormValues();
  }

   get f() { return this.form.controls; }

  ngOnInit(): void {

    this.title = 'Estudio de Presupuesto';

    this.piezas = this.data.item.piezas || [];
    this.refreshList();
    this.cargarDatosAdicionales();
  }

  cargarDatosAdicionales() {
    // Cargar nombre de máquina
    if (this.data.item.activoId) {
      this.assetService.getAll().subscribe((resp: any) => {
        const assets = resp.data || [];
        const maquina = assets.find((a: any) => a.id == this.data.item.activoId);
        if (maquina) {
          this.nombreMaquinaSelected = maquina.nombre;
        }
      });
    }

    // Calcular costo indirecto
    forkJoin({
      activos: this.assetService.getAll(),
      costos: this.fixeService.getAll(),
      productos: this.budgetService.getProductos()
    }).subscribe((res: any) => {
      const activos = res.activos?.data || [];
      const costos = res.costos?.data || [];
      const productos = res.productos?.data || [];

      const totalDepreciacionMensual = activos.reduce((sum: number, asset: any) => {
        const costo = parseFloat(asset.costoInicial) || 0;
        const residual = parseFloat(asset.valorResidual) || 0;
        const vida = parseInt(asset.vidaUtil) || 0;
        return vida > 0 ? sum + ((costo - residual) / vida / 12) : sum;
      }, 0);

      const indirectos = costos.filter((item: any) => item.clasificacion === 'Indirecto');
      const totalFijoIndirecto = indirectos.reduce((total: number, item: any) => total + (Number(item.precio) || 0), 0);

      const numProductos = productos.length || 1;
      this.costoIndirectoAsignado = (totalFijoIndirecto + totalDepreciacionMensual) / numProductos;
    });
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

  getTotalesCalculados() {
    const data = this.data.item;
    
    const totalGramos = this.piezas.reduce((sum, pieza) => sum + (+pieza.gramos || 0), 0);
    const totalMetros = this.piezas.reduce((sum, pieza) => sum + (+pieza.metros || 0), 0);
    const totalHoras = this.piezas.reduce((sum, pieza) => sum + (+pieza.horas || 0), 0);
    const totalMinutos = this.piezas.reduce((sum, pieza) => sum + (+pieza.minutos || 0), 0);

    const tasaFallo = data.tasaFalloGlobal || 0;
    const rawMaterialCost = this.piezas.reduce((sum, pieza) => sum + ((+pieza.gramos || 0) * (+pieza.precioMaterial || 0)), 0);
    const totalCostoMaterial = rawMaterialCost * (1 + (tasaFallo / 100));

    const costoMaquinaRate = data.costoMaquina || 0;
    const totalTiempoHoras = totalHoras + (totalMinutos / 60);
    const totalCostoMaquina = costoMaquinaRate * totalTiempoHoras;

    const costoIndirectoAsignado = this.costoIndirectoAsignado || 0; 
    const costoTotalBase = totalCostoMaterial + totalCostoMaquina + costoIndirectoAsignado;

    const margen = data.margenGanancia || 0;
    const factorGanancia = margen < 1 ? margen : margen / 100;
    let precioSugerido = 0;
    if (factorGanancia >= 1) {
      precioSugerido = costoTotalBase / 0.0001;
    } else {
      precioSugerido = costoTotalBase / (1 - factorGanancia);
    }

    return {
      totalCostoMaterial,
      totalCostoMaquina,
      costoIndirectoAsignado,
      costoTotalBase,
      precioSugerido
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

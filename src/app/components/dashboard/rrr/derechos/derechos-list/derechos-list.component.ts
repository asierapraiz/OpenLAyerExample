import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Derecho, DerechoDTO } from 'src/app/core/model/rrr/derecho';
import { merge, Subscription } from 'rxjs';
import { DerechoService } from 'src/app/core/service/rrr/derecho.service';
import { OptionsPage } from 'src/app/core/model/server/options-page';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DerechosAddUpdateComponent } from '../derechos-add-update/derechos-add-update.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomConfirmDialogComponent } from 'src/app/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-derechos-list',
  templateUrl: './derechos-list.component.html',
  styleUrls: ['./derechos-list.component.scss']
})
export class DerechosListComponent implements OnInit {

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  elementsPage = [10, 25, 50, 100];
  totalElements = 0;
  dataSource = new MatTableDataSource<Derecho>();
  terrenosFiltrosDto: any;
  actual: string = "predios";
  comeFrom: any;
  navigationTree!: any;
  numFiltros: number = 0;
  interesadoId!: number;
  DerechoFiltrosDto!: DerechoDTO;

  subscriptions: Subscription[] = [];

  displayedColumns = ['id', 'derechoTipoId', 'fraccionDerecho', 'fechaInicioTenencia', 'fechaUltimaModificacion', 'descripcion', 'interesadoId', 'predioId', 'agrupacionInteresadoId', "acciones"];

  constructor(
    private derechoService: DerechoService,
    private dialog: MatDialog,
    private route: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
     
    this.manageRouteData();
  }

  private findAll(options?: OptionsPage) {
    const subscription = this.derechoService.findAll(this.getOptions()).pipe(
      map((page) => {
        this.totalElements = page.totalElements;
        return page.content.map(derechoDto => {
          const predio: Derecho = {
            ...derechoDto
          };
          return predio;
        });
      }),
    ).subscribe(
      (derechos: Derecho[]) => {
        this.dataSource.data = derechos;
        console.log(this.dataSource.data);
      },
      () => alert('Error al cargar los derechos')
    );
    this.subscriptions.push(subscription);
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      merge(
        this.paginator.page,
        this.sort.sortChange
      ).subscribe(() => {
        this.findAll(this.getOptions());
      })
    );
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  checkIfInteresado() {
    if (this.interesadoId != null) {
      const data = { 'interId': this.interesadoId};
      this.editarDerecho(data);
    } else {
      this.openNoInteresadoAlert();
    }
  }

  openNoInteresadoAlert() {
    let message = "Para crear un derecho, antes tienes que seleccionar un interesado.";
    let confirmBtnText = "Ir a interesados";
    let closeBtnText = "Continuar";
    const data = { 'message': message, 'confirmBtnText': confirmBtnText, 'closeBtnText': closeBtnText };
    const config = {
      width: '400px',
      disableClose: false,
      data: data
    };
    const dialogRef = this.dialog.open(CustomConfirmDialogComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if (result.data ) {
        this.route.navigate(['dashboard/interesado'], { state: { from: 'derecho' } });       
      } /* else if (!result.data && this.comeFrom != null) {
        this.findDerechosByInteresadoId(this.comeFrom.id); 
        this.findAll(this.getOptions());
      } */
    });

  }

  public filtrarDerechos(derecho: Derecho) {
    const subscription = this.derechoService.filter(this.getOptions(), derecho).pipe(
      map((page) => {
        this.totalElements = page.totalElements;
        return page.content.map(derechoDto => {
          const derecho: Derecho = {
            ...derechoDto
          };
          return derecho;
        });
      }),
    ).subscribe(
      (derechos: Derecho[]) => {
        this.dataSource.data = derechos;
      },
      () => alert('No hay datos con estos filtros')
    );
    this.subscriptions.push(subscription);
  }

  private getOptions(): OptionsPage {
    const options = new OptionsPage();
    options.createOptionsSearch(this.paginator, this.sort);
    return options;
  }
  
  editarDerecho(datos?: any): void {
    if(datos.fechaInicioTenencia)
      datos.fechaInicioTenencia=formatDate(datos.fechaInicioTenencia, 'MM/dd/yyyy', 'es');
    let data: any = {"datos":datos};
    const config = {
      width: '700px',
      disableClose: true,
      data: data
    };
    const dialogRef = this.dialog.open(DerechosAddUpdateComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if (result && this.comeFrom != null) {
        this.findDerechosByInteresadoId(this.comeFrom.id);
      } else if (result) {
        this.findAll(this.getOptions());
      }
    });  
  }

  eliminarDerecho(derechoId: number) {
    const message = '¿Seguro qué quiere eliminarlo?';
    if (confirm(message)) {
      this.derechoService.delete(derechoId).subscribe(
        () => {
          this.paginator.pageIndex = 0;
          this.manageRouteData();
        },
        () => {
          alert("Ha ocurrido un problema al intentar eliminar el Derecho");
        }
      );
    }
  }

  manageRouteData() {
    if('interesadoId' in this.activatedRoute.snapshot.params){
      this.interesadoId=this.activatedRoute.snapshot.params['interesadoId'];
      this.findDerechosByInteresadoId(this.interesadoId);
    }else{
      this.findAll();
    }
  }

  findDerechosByInteresadoId(interesadoId: number){
    const subscription = this.derechoService.findAllByInteresadoId(this.getOptions(),interesadoId).pipe(
      map((page) => {
        this.totalElements = page.totalElements;
        return page.content.map(derechoDto => {
          const derecho: Derecho = {
            ...derechoDto
          };
          return derecho;
        });
      }),
    ).subscribe(
      (derechos: Derecho[]) => {
        this.dataSource.data = derechos;
      },
      (error) =>{
        if(this.totalElements<1){
          alert('No hay derechos por el interesado: '+this.activatedRoute.snapshot.params.interesadoId);
        }else{
          console.error(error);
        }
      } 
    );
    this.subscriptions.push(subscription);
  }
}




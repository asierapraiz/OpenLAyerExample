import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Predio } from 'src/app/core/model/ua/predio';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { OptionsPage } from '../../../../../core/model/server/options-page';
import { MatDialog } from '@angular/material/dialog';
import { AddUpdateInteresadoComponent } from '../add-update-interesado/add-update-interesado.component';
import { ActivatedRoute, Router } from '@angular/router';
import { InteresadoService } from 'src/app/core/service/inte/interesado.service';
import { Interesado, InteresadoFiltrado } from 'src/app/core/model/inte/interesado';
import { UepredioService } from 'src/app/core/service/rel/uepredio.service';
import { AgrupacionInteresados, AgrupacionInteresadosFiltrado } from 'src/app/core/model/inte/agrupacionInteresados';
import { PredioService } from 'src/app/core/service/ua/predio.service'; 
import { CustomConfirmDialogComponent } from 'src/app/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GLOBAL_CONSTANTS } from 'src/app/shared/utils/global-constants';



@Component({
  selector: 'app-interesado-list',
  templateUrl: './interesado-list.component.html',
  styleUrls: ['./interesado-list.component.scss']
})
export class InteresadoListComponent implements OnInit {

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    if (this.comeFrom.id) {
      //this.toTerrenos();
    }
    console.log('Back button pressed');
  }

  @ViewChild(MatSort, { static: true })sort!: MatSort;
  @ViewChild(MatPaginator, { static: true })paginator!: MatPaginator;

  elementsPage = [10, 25, 50, 100];
  totalElements = 0;
  dataSource = new MatTableDataSource<Predio>();
  terrenosFiltrosDto: any;
  comeFrom: any;
  actual: string = "interesados";
  navigationTree!: any;
  predioId!: number;
  agrupacionInteresados?: AgrupacionInteresados;
  showSpinner: Boolean = false;
  nombreAgrupacion: any;


  subscriptions: Subscription[] = [];

  displayedColumns = ['id', 'tipoDocumento', 'documentoIdentidad', 'primerNombre', 'primerApellido', 'segundoApellido', 'sexoTipo', 'grupoEtnicoTipo', 'razonSocial', 'nombre',  'fechaUltimaModificacion', 'autorUltimaModificacion', 'acciones'];
//'fechaCaptura',

  constructor(
    private snackBar: MatSnackBar,
    private predioService: PredioService,
    private interesadoService: InteresadoService,   
    private dialog: MatDialog,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private uePredioService: UepredioService
  ) { }

  ngOnInit(): void {
    this.manageRouteData();
  }

  manageRouteData() {

    'terrenoId' in this.activatedRoute.snapshot.params?this.predioId=this.activatedRoute.snapshot.params['predioId']:'';
    
    'predioId' in this.activatedRoute.snapshot.params? this.findInteresadosByPredioId( this.activatedRoute.snapshot.params['predioId']):this.findAll();
    
    localStorage.getItem('agrupacion-seleccionada')?this.agrupacionInteresados =JSON.parse(localStorage.getItem('agrupacion-seleccionada') || '{}'):null;
    this.nombreAgrupacion = this.agrupacionInteresados?.nombre;
    /*
    this.navigationTree = history.state.navigationTree;
    this.findInteresadosByPredioId(this.navigationTree.predio.id);
    */
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

  }//Fin ngAfterViewInit 

  backTo() {
    alert("TODO");
  }

  eliminarAgrupacion(){
    localStorage.removeItem('agrupacion-seleccionada');
    this.nombreAgrupacion= null;
    this.agrupacionInteresados=undefined;
  }

  eliminarPredio(){
    this.predioId=null;
    this.findAll();
    this.route.navigate(['/dashboard/interesado']);
  }

  

  goToAgrupacion(interesado?: any) {
    if (interesado) {
      this.navigationTree.interesado = interesado;
    }
    this.route.navigate([`dashboard/agrupacionInteresados`], { state: { navigationTree: this.navigationTree } });
  }

  goToSelectAgrupacion() {    
    
    this.route.navigateByUrl(`${this.route.url}/selecciona-agrupacion`);
  }

  goToPredios() {
    this.route.navigate([`dashboard/predio`], { state: { navigationTree: this.navigationTree } });
  }



  private findInteresadosByPredioId(id: number) {

    this.predioId = id;
    this.showSpinner = true;
    const subscription = this.predioService.findInteresadosByPredioId(this.getOptions(), id).pipe(
      map((page) => {
        this.totalElements = page.totalElements;
        return page.content.map(interesadoDto => {
          const _interesado: Interesado = {
            ...interesadoDto
          };
          return _interesado;
        });
      }),
    ).subscribe(
      (interesados: Interesado[]) => {
        this.dataSource.data = interesados;
      },
      () => {        
        this.openSnackBar(`No hay interesados relacionados con este predio id: ${id} `, '', 'alert');
       
      }
    );
    this.subscriptions.push(subscription);
    this.showSpinner = false;

  }

  /*
    toTerreno(predio: any){       
      this.route.navigate(['dashboard/terrenos'], {state: {from: 'predios', predioId:predio.id}});
    }
  
    toTerrenos(){    
      //this.route.navigate(['dashboard/terrenos'],{state: { from: 'prediosDeTerreno',terrenoId:this.terrenoId, filtrosTerreno: this.terrenosFiltrosDto}});
    }
    */



  deleteInteresado(interesadoId: number) {  
    const message = '¿Seguro qué quiere eliminar el interesado?';
    if (confirm(message)) {
      this.interesadoService.deleteByPredioId(interesadoId, this.comeFrom.id).subscribe(
        () => {
          this.paginator.pageIndex = 0;
          if (this.comeFrom != null) {
            this.findInteresadosByPredioId(this.comeFrom.id);
          } else {
            this.findAll();
          }
        },
        () => {
          if (this.comeFrom != null) {
            this.findInteresadosByPredioId(this.comeFrom.id);
          } else {
            this.findAll();
          }
        }
      );
    }

  }

  /*
  
  openAddInteresadoModal() :void{     
   
    const config = {   
      width: '700px', 
      disableClose: true,     
      //data: this.navigationTree.predio.id,      
    };
    const dialogRef = this.dialog.open(AddUpdateInteresadoComponent, config);
    dialogRef.afterClosed().subscribe(result => {
             
      if (result && this.navigationTree.predio!=null) {
        this.findInteresadosByPredioId(this.from.id);  
      }else if(result instanceof String){
        this.goToAgrupacion();
      }else{
        this.findAll(this.getOptions());
      }
    });
  }*/

  openAddOrUpdateInteresadoConGrupoModal() {

    const config = {
      width: '700px',
      disableClose: true,
      data: { "predioId": this.predioId, "agrupacion": this.agrupacionInteresados }
    };
    const dialogRef = this.dialog.open(AddUpdateInteresadoComponent, config);

    dialogRef.componentInstance.borrarAgrupacion.subscribe(result => {
      console.log('Got the data!', result);
  });
    dialogRef.afterClosed().subscribe(result => {      
      if (result == 'goToSelectAgrupacion') {
        this.goToSelectAgrupacion();
      } else if (result && this.navigationTree.predio != null) {
        this.findInteresadosByPredioId(this.comeFrom.id);
      } else {
        this.findAll(this.getOptions());
      }
    });    
  }

  openAddOrUpdateInteresadoModal(interesado?: Interesado): void {    
    console.log("openAddOrUpdateInteresadoModal");
    //let data: any ={ "interesado": interesado, "predioId": this.predioId  };
    //this.agrupacionInteresados?data.agrupacion=this.agrupacionInteresados:'';
    
    let data: any ={ "interesado": interesado,  "predioId": this.predioId,};
    this.agrupacionInteresados?data.agrupacion=this.agrupacionInteresados:'';    
    const config = {
      width: '700px',
      disableClose: true,
      data: data
    };

    const dialogRef = this.dialog.open(AddUpdateInteresadoComponent, config);

    dialogRef.componentInstance.borrarAgrupacion.subscribe(result => {
      this.agrupacionInteresados=undefined;
  });

    dialogRef.afterClosed().subscribe(result => {
      
      if (!result) {
        return;
      } else if (result == 'goToSelectAgrupacion') {
        this.goToSelectAgrupacion();
      } else if (result && this.predioId != null) {
        this.findInteresadosByPredioId(this.predioId);
      } else {
        this.findAll(this.getOptions());
      }
    });
  }

  checkIfPredio(){
    if(!this.predioId){
      this.openNoPredioAlert();
      }else {
        this.openAddOrUpdateInteresadoModal();
      }
  }

  openNoPredioAlert() {
    let message = "No has seleccionado nigún predio, pero puedes continuar.";
    let confirmBtnText = "Ir a predios";
    let closeBtnText = "Continuar";

    const data = { 'message': message, 'confirmBtnText': confirmBtnText, 'closeBtnText': closeBtnText };

    const config = {
      width: '400px',
      disableClose: false,
      data: data
    };

    const dialogRef = this.dialog.open(CustomConfirmDialogComponent, config);
    dialogRef.afterClosed().subscribe(result => {      
      if (result.data) {
        this.route.navigate(['dashboard/all/predio']);
      }else{
        this.openAddOrUpdateInteresadoModal();
      }
    });

  }


  private getOptions(): OptionsPage {
    const options = new OptionsPage();
    options.createOptionsSearch(this.paginator, this.sort);
    return options;
  }


  private findAll(options?: OptionsPage) {
    this.showSpinner = true;
    const subscription = this.interesadoService.findAll(options).pipe(
      map((page) => {
        this.totalElements = page.totalElements;
        return page.content.map(interesadoDto => {
          const interesado: Interesado = {
            ...interesadoDto
          };
          this.showSpinner = false;
          return interesado;
        });
      }),

    ).subscribe(
      (interesados: Interesado[]) => {
        this.dataSource.data = interesados;
      },
      () =>this.openSnackBar(`No hay interesados en base de datos `, '', 'alert')    
    );
    this.subscriptions.push(subscription);
    

  }

  public filtrarInteresados(agrupacion: InteresadoFiltrado) {
    this.showSpinner = true;
    const subscription = this.interesadoService.filter(this.getOptions(), agrupacion).pipe(
      map((page) => {
        this.totalElements = page.totalElements;
        return page.content.map(interesadoDto => {
          const interesado: Interesado = {
            ...interesadoDto
          };
          this.showSpinner = false;
          return interesado;
        });
      }),
    ).subscribe(
      (interesados: Interesado[]) => {
        this.dataSource.data = interesados;
      },
      () =>this.openSnackBar(`No hay datos con estos filtros `, '', 'alert') 
    );
    this.subscriptions.push(subscription);
    

  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
    localStorage.removeItem('agrupacion-seleccionada');
  }

  openSnackBar(message: string, action: string, className: string) {
    this.snackBar.open(message, action, {
      duration: GLOBAL_CONSTANTS.alertDuration,
      panelClass: [className]
    });
  }

}

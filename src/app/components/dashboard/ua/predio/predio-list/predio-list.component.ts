import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Predio, PredioDto } from 'src/app/core/model/ua/predio';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { OptionsPage } from '../../../../../core/model/server/options-page';
import { PredioService } from '../../../../../core/service/ua/predio.service';
import { TipoBaseService } from 'src/app/core/service/tc/tipoBase.service';
import { MatDialog } from '@angular/material/dialog';
import { AddUpdatePredioComponent } from '../add-update-predio/add-update-predio.component';
import { NavegacionDialogComponent } from '../../../navegacion-dialog/navegacion-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { TerrenoService } from '../../../../../core/service/ue/terreno.service';
import { CustomConfirmDialogComponent } from '../../../../../shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { Terreno } from 'src/app/core/model/ue/terreno';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UepredioService } from 'src/app/core/service/rel/uepredio.service';
import { GLOBAL_CONSTANTS } from 'src/app/shared/utils/global-constants';
import { PredioInteresadoService } from 'src/app/core/service/rel/predio-interesado.service'; 




@Component({
  selector: 'app-predio-list',
  templateUrl: './predio-list.component.html',
  styleUrls: ['./predio-list.component.scss']
})
export class PredioListComponent implements OnInit {

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {   
    console.log('Back button pressed');
  }

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild(MatPaginator, { static: true })

  paginator!: MatPaginator;
  elementsPage = [10, 25, 50, 100];
  totalElements = 0;
  dataSource = new MatTableDataSource<Predio>();
  terrenosFiltrosDto: any;
  actual: string = "predios";  
  navigationTree!: any;
  numFiltros: number = 0;
  terreno!: Terreno;
  terrenoId!: number;
  predioFiltrosDto!: PredioDto;
  comeFrom!: string;
  showSpinner: Boolean = false;
  interesadoId: number;
 




  subscriptions: Subscription[] = [];

  displayedColumns = ['id', 'departamento', 'municipio', 'operacion', 'numeroPredial', 'predioTipo', 'estadoPredio', 'fechaCaptura', 'fechaUltimaModificacion', 'autorUltimaModificacion', 'claseSueloTipo', 'condicionPredioTipo', 'categoriaSueloTipo', 'destinacionEconomicaTipo', 'acciones'];


  constructor(
    private predioInteresadoService: PredioInteresadoService,
    private uePredioService: UepredioService,
    private snackBar: MatSnackBar,
    private predioService: PredioService,
    private tipoBaseService: TipoBaseService,
    private terrenoService: TerrenoService,
    private dialog: MatDialog,
    private route: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.manageRouteData();
  }

  openSnackBar(message: string, action: string, className: string) {
    this.snackBar.open(message, action, {
      duration: GLOBAL_CONSTANTS.alertDuration,
      panelClass: [className]
    });
  }


  manageRouteData() {    


    'predioId' in this.activatedRoute.snapshot.params ? this.findPredioById(this.activatedRoute.snapshot.params['predioId']) :''; 

    'terrenoId' in this.activatedRoute.snapshot.params ? this.findPrediosByTerrenoId(this.activatedRoute.snapshot.params['terrenoId']) :'';   
  
    'unidadId' in this.activatedRoute.snapshot.params ? this.findPrediosByUnidadId(this.activatedRoute.snapshot.params['unidadId']) : '';

    'construccionId' in this.activatedRoute.snapshot.params ? this.findPrediosByConstruccionId(this.activatedRoute.snapshot.params['construccionId']) : '';
    
    'interesadoId' in this.activatedRoute.snapshot.params ? this.findPrediosByInteresadoId(this.activatedRoute.snapshot.params['interesadoId']) : '';



    this.route.url.includes('all')? this.findAll() :'';  

   

    /*
        if(localStorage.getItem("predioFiltrosDto") != null){
          this.predioFiltrosDto = JSON.parse(localStorage.getItem('predioFiltrosDto')||'');
          this.numFiltros = Object.keys(this.predioFiltrosDto).length;
          this.filtrarPredios( this.predioFiltrosDto);
        }else{
          this.findAll(this.getOptions());
        }   
    */


    /*
        this.navigationTree = history.state.navigationTree;
        this.terreno = this.navigationTree.terreno;
        this.findPrediosByTerrenoId(this.navigationTree.terreno.id);
    
        if (this.navigationTree.predioFilter != null) {
          //Contar el num de filtros;
          this.numFiltros = Object.keys(this.navigationTree.predioFilter).length;
          this.filtrarPredios(this.navigationTree.predioFilter);
        }
    */
  }


  

  ngAfterViewInit(): void {

    this.subscriptions.push(
      merge(
        this.paginator.page,
        this.sort.sortChange
      ).subscribe(() => {
        //this.findAll(this.getOptions());
      })
    );

  }//Fin ngAfterViewInit 

  goToInteresado(predio: any) {
    this.navigationTree.predio = predio;
    this.route.navigate([`dashboard/interesado`], { state: { navigationTree: this.navigationTree } });
  }

  openDialogDeNavegacion(predio?: Predio) {

    delete predio?.autorUltimaModificacion;
    delete predio?.extdireccionId;
    const config = {
      width: '400px',
      disableClose: false,
      data: predio
    };
    const dialogRef = this.dialog.open(NavegacionDialogComponent, config);
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.route.navigate(['dashboard/terreno'], { state: { from: 'predio' } });
      }
    });

  }

  deletePredio(predioId: number) {
    const message = '¿Seguro qué quiere eliminar el predio?';
    if (confirm(message)) {
      this.predioService.delete(predioId).subscribe(
        () => {
          this.paginator.pageIndex = 0;
          this.manageRouteData();
        },
        () => {
          this.manageRouteData();
        }
      );
    }
  }

  checkIfTerreno() {
    if (this.terrenoId != null) {
      this.openAddEditModal();
    } else {
      this.openNoTerrenoAlert();
    }
  }

  openNoTerrenoAlert() {

    let message = "Para crear un predio, antes tienes que seleccionar un terreno.";
    let confirmBtnText = "Ir a terrenos";
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
        this.route.navigate(['dashboard/terreno']);
      } 
    });

  }

  openAddEditModal(predio?: Predio): void {

    delete predio?.autorUltimaModificacion;
    delete predio?.extdireccionId;
    const config = {
      width: '700px',
      disableClose: true,
      data: {
        "predio": predio,
        "terrenoId": this.terrenoId
      }
    };
    const dialogRef = this.dialog.open(AddUpdatePredioComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if(this.terrenoId){
        this.findPrediosByTerrenoId(this.terrenoId);
      }else{
        this.findAll();
      }
      
    });
  }

  private getOptions(): OptionsPage {
    const options = new OptionsPage();
    options.createOptionsSearch(this.paginator, this.sort);
    return options;
  }


  private findAll(options?: OptionsPage) {  
    console.log("findAll");
    this.showSpinner = true;
    const subscription = this.predioService.findAll(this.getOptions()).pipe(
      map((page) => {
        this.totalElements = page.totalElements;
        return page.content.map(predioDto => {
          const predio: Predio = {
            ...predioDto
          };
          this.showSpinner = false;
          return predio;
        });
      }),

    ).subscribe(
      (predios: Predio[]) => {
        this.dataSource.data = predios;       
      },
      () => this.openSnackBar('Error al cargar los predios', '', 'alert')
    );
    this.subscriptions.push(subscription);
    
  }

  public filtrarPredios(predio: Predio) {
    this.showSpinner = true;
    const subscription = this.predioService.filter(this.getOptions(), predio).pipe(
      map((page) => {
        this.totalElements = page.totalElements;
        return page.content.map(predioDto => {
          const predio: Predio = {
            ...predioDto
          };
          this.showSpinner = false;
          return predio;
        });
      }),
    ).subscribe(
      (predios: Predio[]) => {
        this.dataSource.data = predios;
      },
      () => this.openSnackBar('No hay datos con estos filtros', '', 'alert')
    );
    this.subscriptions.push(subscription);    
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  private findPrediosByTerrenoId(id: number) {

    this.terrenoId= id;
    this.showSpinner = true;
    const subscription = this.terrenoService.findPrediosByTerrenoId(this.getOptions(), id).pipe(
      map((page) => {
        this.totalElements = page.totalElements;
        return page.content.map(predioDto => {
          const predio: any = {
            ...predioDto           
          };
          
          return predio;
        });
      }),
    ).subscribe(
      (predios: Predio[]) => {
         //(Unique)=> Filtro por id único, ya que pueden llegar varios registros con el mismo id.
        //La tabla rel_uePredio, registra varias tuplas por terreno, ya que puede haber varios predios, para el mismo terreno.
        this.dataSource.data =Array.from(new Set(predios.map(a=>a.id))).map(id=>{ return predios.find(a => a.id === id)}) as Predio[];  
        this.showSpinner = false;
      },
      () => {
        this.showSpinner = false;
        this.openSnackBar('No hay predios relacionados con este terreno.', '', 'alert');
      }
    );
    this.subscriptions.push(subscription);
    
  }

  findPrediosByUnidadId(unidadId: number){  
    this.showSpinner = true;
    let filtro = {'unidadConstruccionId': unidadId};
    const subscription = this.uePredioService.findPrediosByUnidadId(filtro).pipe(
      map((page) => {
        this.totalElements = page.totalElements;
        return page.content.map(predioDto => {
          const predio: any = {
            ...predioDto
            ,
            dimensionTipo: undefined,
            relacionSuperficieTipo: undefined,
            extDireccion: undefined
          };
          this.showSpinner = false;
          return predio;
        });
      }),
    ).subscribe(
      (predios: Predio[]) => {
         //(Unique)=> Filtro por id único, ya que pueden llegar varios registros con el mismo id.
        //La tabla rel_uePredio, registra varias tuplas por terreno, ya que puede haber varios predios, para el mismo terreno.
        //this.dataSource.data =Array.from(new Set(predios.map(a=>a.id))).map(id=>{ return predios.find(a => a.id === id)}) as Predio[];
        this.dataSource.data=predios;  
        
      },
      () => {
        //alert('No hay predios relacionados con este terreno.');
        this.openSnackBar(`No hay predios relacionados con la unidad con id:${unidadId}`, '', 'alert');
      }
    );
    this.subscriptions.push(subscription);   
  }

  findPrediosByConstruccionId(construccionId: number){  
    this.showSpinner = true;      
    let filtro = {'construccionId': construccionId};
    const subscription = this.uePredioService.findPrediosByConstruccionId(filtro).pipe(
      map((page) => {
        this.totalElements = page.totalElements;
        return page.content.map(predioDto => {
          const predio: any = {
            ...predioDto
            ,
            dimensionTipo: undefined,
            relacionSuperficieTipo: undefined,
            extDireccion: undefined

          };
          this.showSpinner = false;
          return predio;
        });
      }),
    ).subscribe(
      (predios: Predio[]) => {
         //(Unique)=> Filtro por id único, ya que pueden llegar varios registros con el mismo id.
        //La tabla rel_uePredio, registra varias tuplas por terreno, ya que puede haber varios predios, para el mismo terreno.
        //this.dataSource.data =Array.from(new Set(predios.map(a=>a.id))).map(id=>{ return predios.find(a => a.id === id)}) as Predio[];
        this.dataSource.data=predios;  
        
      },
      () => {
        //alert('No hay predios relacionados con este terreno.');
        this.openSnackBar(`No hay predios relacionados con la construcción id:${construccionId}`, '', 'alert');
      }
    );
    this.subscriptions.push(subscription);
  }

  findPredioById(predioId: number){  
    this.showSpinner = true;     
    let filtro = {'id': predioId};
    const subscription = this.predioService.filter(this.getOptions(), filtro).pipe(
      map((page) => {
        this.totalElements = page.totalElements;
        return page.content.map(predioDto => {
          const predio: any = {
            ...predioDto
          };
          this.showSpinner = false;
          return predio;
        });
      }),
    ).subscribe(
      (predios: Predio[]) => {
         //(Unique)=> Filtro por id único, ya que pueden llegar varios registros con el mismo id.
        //La tabla rel_uePredio, registra varias tuplas por terreno, ya que puede haber varios predios, para el mismo terreno.
        //this.dataSource.data =Array.from(new Set(predios.map(a=>a.id))).map(id=>{ return predios.find(a => a.id === id)}) as Predio[];
        this.dataSource.data=predios;  
        
      },
      () => {
        //alert('No hay predios relacionados con este terreno.');
        this.openSnackBar(`No hay predios relacionados con este id:${predioId}`, '', 'alert');
      }
    );
    this.subscriptions.push(subscription);
  }

  findPrediosByInteresadoId(interesadoId: number){  
    this.showSpinner = true;

    this.interesadoId = interesadoId;    
    let filtro = {'interesadoId': interesadoId}  
    const subscription = this.predioInteresadoService.findInteresadosByPredioId( filtro).pipe(
      map((page) => {
        this.totalElements = page.totalElements;
        return page.content.map(interesadoDto => {
          const _interesado: Predio = {
            ...interesadoDto
          };
          return _interesado;
        });
      }),
    ).subscribe(
      (interesados: Predio[]) => {
        this.dataSource.data = interesados;
      },
      () => {        
        this.openSnackBar(`No hay predios relacionados con el  interesado id: ${interesadoId} `, '', 'alert');       
      }
    );
    this.subscriptions.push(subscription);
    this.showSpinner = false;

  }



}

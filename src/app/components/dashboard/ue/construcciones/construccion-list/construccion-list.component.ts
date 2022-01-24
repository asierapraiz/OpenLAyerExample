import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ElementRef, EventEmitter, ComponentFactoryResolver } from '@angular/core';
import { merge, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { OptionsPage } from '../../../../../core/model/server/options-page';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { PredioService } from 'src/app/core/service/ua/predio.service';
import { ConstruccionFilter, Construccion } from 'src/app/core/model/ue/construccion';
import { ConstruccionService } from 'src/app/core/service/ue/construccion.service';
import { TerrenoService } from 'src/app/core/service/ue/terreno.service';
import { ConstruccionFilterComponent } from '../construccion-filter/construccion-filter.component';
import { ConstruccionAddUpdateComponent } from '../construccion-add-update/construccion-add-update.component';
import { CustomConfirmDialogComponent } from './../../../../../shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { MapComponent } from '../../../map/map.component';
import Map from 'ol/Map';
import { MapService } from 'src/app/core/service/map/map.service';
import { Terreno } from 'src/app/core/model/ue/terreno';
import { Predio } from 'src/app/core/model/ua/predio';
import {MatSnackBar} from '@angular/material/snack-bar';
import { UepredioService } from 'src/app/core/service/rel/uepredio.service';
import { GLOBAL_CONSTANTS } from 'src/app/shared/utils/global-constants';
import {Location} from '@angular/common';




@Component({
  selector: 'app-construccion-list',
  templateUrl: './construccion-list.component.html',
  styleUrls: ['./construccion-list.component.scss']
})
export class ConstruccionListComponent implements OnInit, AfterViewInit {



  @ViewChild(ConstruccionFilterComponent) construccionFilterComponent!: ConstruccionFilterComponent;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MapComponent) superMap!: MapComponent;
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;


  capasList: string[] = ['Terrenos', 'Construcciones'];
  map!: Map;
  elementsPage = [200, 250];
  totalElements = 0;
  dataSource = new MatTableDataSource<Construccion>();
  dialogValue: string = "";
  sendValue: string = "";
  mapEl!: HTMLElement;
  numFiltros!: number;
  filtersForm: boolean = false;
  filtrosConstruccion!: ConstruccionFilter;
  predioId!: number;
  terrenoId!: number;
  multiPolygonList: any[] = [];
  isShowingR: boolean = false;
  isShowingL: boolean = false;
  infoShowing: boolean = false;
  isShowMultiPolygonsList: boolean = false;
  geometria!: any;
  selectedRowIndex = 0;  
  showSpinner: Boolean = true;
  layersShowing: Boolean = false;
  unidadId!: number;
  refocus: boolean = true;
  numConstrucciones: number=0;
  numTerrenos: number=0;
  numUnidadesConstruccion: number=0;
  comeFrom: Boolean = false;
  


  subscriptions: Subscription[] = [];
  displayedColumns = [
    'id',
    'identificador',
    'construccionTipo',
    'dominioConstruccionTipo',
    'numeroPisos',
    'numeroSotanos',
    'anioConstruccion',
    'areaConstruccion',
    'dimensionTipo',
    'relacionSuperficieTipo',
    'fechaCarga', 
    'fechaUltimaModificacion', 
    'autorUltimaModificacion',
    'acciones'];




  constructor(
    private uePredioService: UepredioService,
    private snackBar: MatSnackBar,
    private terrenoService: TerrenoService,
    private mapService: MapService,
    private route: Router,
    private predioService: PredioService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private service: ConstruccionService,
    public location: Location

  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {
    this.manageRouteData();
  }

  ngAfterViewInit(): void {

    this.map = this.superMap.map;

   this.addSubscriptions();

  }//Fin ngAfterViewInit 

  goBack(){
    
    this.location.back();
  }

  addSubscriptions(){
    this.subscriptions.push(
      merge(
        this.paginator.page,
        this.sort.sortChange
      ).subscribe(() => {
        //this.findAllConstrucciones();
      })
    );

    let setRowHighlight$ = this.mapService.setRowHighlight$.subscribe(
      (id) => {       
        this.selectedRowIndex = id;
      }
    );

    let addMultiPolygon$ = this.mapService.addMultiPolygon$.subscribe(
      (multiPolygon) => {
        this.multiPolygonList = multiPolygon;
      }
    );

    let addGeometria$ = this.mapService.addGeometria$.subscribe(
      (geometria) => {
        this.geometria = geometria;
        this.openAddEditModal();
      }
    );

    this.subscriptions.push(setRowHighlight$);
    this.subscriptions.push(addMultiPolygon$);
    this.subscriptions.push(addGeometria$);
  }

  updatePolygonValue(event: any) {
    this.multiPolygonList.push(event);
  }

  setHighLight(id: number){
    this.selectedRowIndex=id;
  }

  openSnackBar(message: string, action: string, className: string) {
    this.snackBar.open(message, action, {
      duration: GLOBAL_CONSTANTS.alertDuration,
      panelClass: [className]
    });
  }

  manageRouteData() {

    'terrenoId' in this.activatedRoute.snapshot.params ? this.terrenoId = this.activatedRoute.snapshot.params['terrenoId'] : '';
    'predioId' in this.activatedRoute.snapshot.params ? this.predioId = this.activatedRoute.snapshot.params['predioId'] : '';      
    'unidadId' in this.activatedRoute.snapshot.params ? this.unidadId = this.activatedRoute.snapshot.params['unidadId'] : '';

   
    if( this.route.url.includes('all')){      
      this.findAllTerrenos();
      this.findAllConstrucciones();
    }else{
      this.comeFrom=true;
    }
    
    if (this.terrenoId) {
      this.findTerrenoById(this.terrenoId);
      this.findConstruccionesByTerrenoId(this.terrenoId);      
    }  
    
    if(this.unidadId){     
      this.findTerrenoByUnidad(this.unidadId);
      this.findConstruccionByUnidadId(this.unidadId);      
    } 
    
    if (this.predioId) {
      this.findConstruccionesByPredioId(this.predioId);
      localStorage.removeItem('filtrosConstrucciones');
    } 
    /*else if (localStorage.getItem("filtrosConstrucciones") != null) {
      this.filtrosConstruccion = JSON.parse(localStorage.getItem('filtrosConstrucciones') || '');
      this.numFiltros = Object.keys(this.filtrosConstruccion).length;
      this.filtrar();
    }*/
  }  


  

  showFilters() {
    this.isShowingR = !this.isShowingR;
    this.filtersForm = !this.filtersForm;
  }

  infoShow() {
    this.isShowingL = !this.isShowingL;
    this.infoShowing = !this.infoShowing;
  }

  showMultiPolygonsList() {
    /*
    this.isShowingL = !this.isShowingL;
    this.isShowMultiPolygonsList = !this.isShowMultiPolygonsList;
    */
  }

  showLayers() {
    this.isShowingL = !this.isShowingL;
    this.layersShowing = !this.layersShowing;
  }

  filtrarEvent(dto: any) {
    localStorage.setItem('filtrosConstrucciones', JSON.stringify(dto));
    this.filtrosConstruccion = dto;
    this.numFiltros = Object.keys(dto).length;
    this.filtrar();
  }

  limpiarFiltrosEvent() {
    this.numFiltros = 0;
    this.filtrosConstruccion = {};
    //this.navigationTree.terrenoFilter = {};
    localStorage.removeItem('filtrosConstrucciones');
    this.findAllConstruccionesWithExtent();
  }



  createConstruccion() {
    if (this.terrenoId != null) {
      this.superMap.addDraw()
    } else {
      this.openNoTerrenoAlert();
    }
  }

  openNoTerrenoAlert() {
    let message = "Para crear una construcción, antes tienes que seleccionar un terreno.";
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
      console.log(result);
      if (result.data) {
        this.route.navigate(['dashboard/terreno'], { state: { from: 'construccion' } });
      }
    });

  }

  openConfirmDelete(mensage: string){
    let message = mensage;
    let confirmBtnText = "Sí";
    let closeBtnText = "No";

    const data = { 'message': message, 'confirmBtnText': confirmBtnText, 'closeBtnText': closeBtnText };

    const config = {
      width: '400px',
      disableClose: false,
      data: data
    };

    const dialogRef = this.dialog.open(CustomConfirmDialogComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.data) {
        this.route.navigate(['dashboard/terreno']);
      }
    });
  }



  openAddEditModal(construccion?: Construccion): void {
    const config = {
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: 'custom-dialog-panel-class',
      data: { 
        "construccion": construccion, 
        "multiPolygonList": this.multiPolygonList, 
        "geometria": this.geometria,
        "terrenoId": this.terrenoId
         }
    };
    const dialogRef = this.dialog.open(ConstruccionAddUpdateComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {        
        this.findConstruccionesByTerrenoId(this.terrenoId)
      } 
        this.superMap.clearPolygons();
        this.multiPolygonList = [];
        this.isShowMultiPolygonsList = false;
        this.isShowingL = false;      
    });
  }

  deleteConstruccion(construccionId: number): void {
    const message = '¿Seguro qué quiere eliminar la construcción?';
    //Llamar al mat dialog    
    let confirmBtnText = "Sí";
    let closeBtnText = "No";

    const data = { 'message': message, 'confirmBtnText': confirmBtnText, 'closeBtnText': closeBtnText };

    const config = {
      width: '400px',
      disableClose: false,
      data: data
    };

    const dialogRef = this.dialog.open(CustomConfirmDialogComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.data) {
        
        this.service.delete(construccionId).subscribe(
          () => {
            this.paginator.pageIndex = 0;
            this.findAllConstrucciones();
          },
          () => {            
            this.openSnackBar(`Error al eliminar el construcción`, '', 'alert');
            this.findAllConstrucciones();
          }
        );
      }
    });    
    
  }

  mapChanged() { 
    if(this.predioId || this.terrenoId || this.unidadId || !this.refocus){
      return;
    }      

      if(this.numFiltros!=null || this.numFiltros>0){      
        this.filtrarConstruccionesWithExtent();
      }else{            
        this.findAllConstruccionesWithExtent();
        this.findAllTerrenosWithExtent(); 
      }     
  }

  
  getOptions(): OptionsPage {
    const options = new OptionsPage();
    options.createOptionsSearch(this.paginator, this.sort);
    return options;
  }

///////////////////////////////////////////Búsquedas Construcciones

  findAllConstrucciones() { 
    this.refocus=false;  
    console.log("findAllConstrucciones");        
    this.filtrosConstruccion = {};
    const subscription = this.service.findAll(this.getOptions()).pipe(
      map((page) => {
        this.numConstrucciones = page.totalElements;   
        this.totalElements = page.totalElements;
        return page.content.map(construccion => {
          const construccionDto: Construccion = {
            ...construccion            
          };
          this.showSpinner=false;
          return construccion;
        });
      }),
    ).subscribe(
      (construcciones: Construccion[]) => {
        this.dataSource.data = construcciones;
        this.superMap.loadGeometrias(construcciones, GLOBAL_CONSTANTS.construcion, true);
      },
      () => this.openSnackBar(`No hay datos en la base`, '', 'alert')
    );
    this.subscriptions.push(subscription);
    setTimeout(()=>{this.refocus=true}, 1000);
  }

  findAllConstruccionesWithExtent() {  
    console.log("findAllConstruccionesWithExtent") 
    if(this.terrenoId){
      return;
    }         
    this.showSpinner = true;
    this.filtrosConstruccion = {};
    const subscription = this.service.getAllWithExtent(this.getOptions(), this.superMap.getExtent()).pipe(
      map((page) => {
        this.numConstrucciones = page.totalElements;
        this.totalElements = page.totalElements;

        return page.content.map(construccion => {
          const construccionDto: Construccion = {
            ...construccion            
          };
          return construccion;
        });
      }),
    ).subscribe(
      (construcciones: Construccion[]) => {
        this.showSpinner = false;
        this.dataSource.data = construcciones;
        this.superMap.loadGeometrias(construcciones, GLOBAL_CONSTANTS.construcion);
      },
      () => this.openSnackBar(`No hay datos en la base`, '', 'alert')
    );
    this.subscriptions.push(subscription);
  }

  findConstruccionesByPredioId(id: number) {

    const subscription = this.service.findConstruccionesByPredioId(this.getOptions(), id).pipe(
      map((page) => {
        this.numConstrucciones = page.totalElements;
        this.totalElements = page.totalElements;
        return page.content.map(construccionDto => {
          const construccion: any = {
            ...construccionDto
          };
          return construccion;
        });
      }),
    ).subscribe(
      (construcciones: Construccion[]) => {
        //(Unique)=> Filtro por id único, ya que pueden llegar varios registros con el mismo id.
        //La tabla rel_uePredio, registra varias tuplas por terreno, ya que puede haber varios predios, para el mismo terreno.
        this.dataSource.data =Array.from(new Set(construcciones.map(a=>a.id))).map(id=>{ return construcciones.find(a => a.id === id)}) as Construccion[];       

        this.superMap.loadGeometrias(construcciones, GLOBAL_CONSTANTS.construcion, true);
        //this.superMap.searchInMap(this.dataSource.data[1], 'construccion');
        this.showSpinner = false;
      },
      () => {        
        this.showSpinner = false;
        this.openSnackBar('No hay construcciones relacionadas con el predio.', '', 'alert');
      }
    );
    this.subscriptions.push(subscription);
  }  

  findConstruccionesByTerrenoId(id: number) {
    console.log("En findConstruccionesByTerrenoId");
    this.showSpinner=true;
    const subscription = this.service.findConstruccionesByTerrenoId(this.getOptions(), id).pipe(
      map((page) => {
        this.totalElements = page.totalElements;   
        this.numConstrucciones = page.totalElements;        
        return page.content.map(construccionDto => {
          const construccion: Construccion = {
            ...construccionDto
          };
          
          return construccion;
        });
      }),
    ).subscribe(
      (construcciones: Construccion[]) => {  
        
        //(Unique)=> Filtro por id único, ya que pueden llegar varios registros con el mismo id.
        //La tabla rel_uePredio, registra varias tuplas por terreno y contrucción, ya que puede haber varias unidades de construccion, para el mismo prdio y mismo terreno.
        this.dataSource.data =Array.from(new Set(construcciones.map(a=>a.id))).map(id=>{ return construcciones.find(a => a.id === id)}) as Construccion[];   

        this.superMap.loadGeometrias(construcciones, GLOBAL_CONSTANTS.construcion, true);        
        this.showSpinner=false;
        
      },
      () => {       
        this.showSpinner=false;
        this.superMap.loadGeometrias([], GLOBAL_CONSTANTS.construcion);        
        this.openSnackBar(`No hay construcciones relacionadas con el terreno con id:${this.terrenoId}`, '', 'alert');

      }
      
    );
    
    this.subscriptions.push(subscription);
  }

  filtrar() {
    console.log("filtrar");
    this.showSpinner = true;
    const subscription = this.service.filter(this.getOptions(), this.filtrosConstruccion).pipe(
      map((page) => {
        this.numConstrucciones = page.totalElements;
        this.totalElements = page.totalElements;
        return page.content.map(construccion => {
          const construccionDto: Construccion = {
            ...construccion
          };
          return construccion;
        });
      }),

    ).subscribe(
      (construcciones: Construccion[]) => {
        this.showSpinner=false;
        this.dataSource.data = construcciones;
        this.superMap.loadGeometrias(this.dataSource,  GLOBAL_CONSTANTS.construcion);
      },
      (construcciones: Construccion[]) => {
        this.dataSource.data = construcciones;
        this.numFiltros = 0;        
        this.openSnackBar(`NO hay construcciones con estos filtros.`, '', 'alert')
      }
    );
    this.subscriptions.push(subscription);
  }

  filtrarConstruccionesWithExtent() {
    console.log("filtrarConstruccionesWithExtent");

    this.showSpinner = true;
    const subscription = this.service.filter(this.getOptions(), this.filtrosConstruccion).pipe(
      map((page) => {
        this.numConstrucciones = page.totalElements;
        this.totalElements = page.totalElements;
        return page.content.map(construccion => {
          const construccionDto: Construccion = {
            ...construccion
          };
          return construccion;
        });
      }),

    ).subscribe(
      (construcciones: Construccion[]) => {
        this.showSpinner=false;
        this.dataSource.data = construcciones;
        this.superMap.loadGeometrias(this.dataSource, GLOBAL_CONSTANTS.construcion);
      },
      (construcciones: Construccion[]) => {
        this.dataSource.data = construcciones;
        this.numFiltros = 0;        
        this.openSnackBar(`No hay construcciones con estos filtros.`, '', 'alert')
      }
    );
    this.subscriptions.push(subscription);
  }

  findConstruccionByUnidadId(unidadId: number){  

    console.log("En findConstruccionByUnidadId");

    this.unidadId= unidadId;
      
    this.showSpinner = true;
    let filtro = {'unidadConstruccionId': unidadId};
    const subscription = this.uePredioService.findConstruccionesByUnidadId(filtro).pipe(
      map((page) => {
        this.numUnidadesConstruccion = page.totalElements;
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
      (construcciones: Construccion[]) => {
         //(Unique)=> Filtro por id único, ya que pueden llegar varios registros con el mismo id.
        //La tabla rel_uePredio, registra varias tuplas por terreno, ya que puede haber varios predios, para el mismo terreno.
        //this.dataSource.data =Array.from(new Set(predios.map(a=>a.id))).map(id=>{ return predios.find(a => a.id === id)}) as Predio[];
        this.dataSource.data=construcciones;               
        this.superMap.loadGeometrias(construcciones,  GLOBAL_CONSTANTS.construcion, true);       
        
      },
      () => {                
        this.openSnackBar(`No hay construciones relacionados con la unidad con id:${unidadId}`, '', 'alert');
      }
    );
    this.subscriptions.push(subscription);
  }

  /////////////////////////////////////////////////////////////////////////////Terrenos

  findAllTerrenos() { 
    console.log("findAllTerrenos");  
    this.filtrosConstruccion = {};
    const subscription = this.terrenoService.findAll(this.getOptions()).pipe(
      map((page) => {
        this.numTerrenos = page.totalElements;            
        return page.content.map(terreno => {
          const terrenoDto: Terreno = {
            ...terreno            
          };
          return terrenoDto;
        });
      }),
    ).subscribe(
      (terrenos: Terreno[]) => {        
        this.superMap.loadTerrenos(terrenos, GLOBAL_CONSTANTS.terreno);
      },
      () => {
        this.numTerrenos = 0;  
        this.openSnackBar(`No hay datos en la base`, '', 'alert');      
      }
    );
    this.subscriptions.push(subscription);
  }

  findAllTerrenosWithExtent() {   
    console.log("findAllTerrenosWithExtent") 
    const subscription = this.terrenoService.getAllWithExtent(this.getOptions(), this.superMap.getExtent()).pipe(
      map((page) => {
        this.numTerrenos = page.totalElements;        
        return page.content.map(terrenoDto => {
          const terreno: Terreno = {
            ...terrenoDto            
          };
          return terreno;
        });
      })
    ).subscribe(
      (terrenos: Terreno[]) => {        
        this.superMap.loadTerrenos(terrenos, GLOBAL_CONSTANTS.terreno);
      },
      () => {
        this.numTerrenos = 0;  
        this.openSnackBar(`No hay Terrenos en la base`, '', 'alert')}
    );
    this.subscriptions.push(subscription);
    
  }  

  findTerrenoById(id: number) {    
    console.log("En findTerrenoById")
    let filtroTerreno = { 'id': id };
    const subscription = this.terrenoService.filter(this.getOptions(), filtroTerreno).pipe(
      map((page) => {
        this.numTerrenos = page.totalElements;        
        return page.content.map(terrenoDto => {
          const terreno: Terreno = {
            ...terrenoDto
          };
          return terreno;
        });
      }),

    ).subscribe(
      (terrenos: Terreno[]) => {
        this.superMap.loadTerrenos(terrenos,GLOBAL_CONSTANTS.terreno);
      },
      () => {
        this.numFiltros = 0;        
        this.openSnackBar(`Error al cargar el terreno con el id:${this.terrenoId}`, '', 'alert');       
      }
    );
    this.subscriptions.push(subscription);
  }    

  findTerrenoByUnidad(unidadId: number){  
      
    this.showSpinner = true;
    let filtro = {'unidadConstruccionId': unidadId};
    const subscription = this.uePredioService.findTerrenoByUnidadId(filtro).pipe(
      map((page) => {
        this.numTerrenos = page.totalElements;
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
      (construcciones: Construccion[]) => {        
        this.superMap.loadTerrenos(construcciones, GLOBAL_CONSTANTS.construcion);     
        
      },
      () => {                
        this.openSnackBar(`No hay construciones relacionados con la unidad con id:${unidadId}`, '', 'alert');
      }
    );
    this.subscriptions.push(subscription);
  }
}



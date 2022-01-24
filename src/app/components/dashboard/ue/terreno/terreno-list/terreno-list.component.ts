import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TerrenoService } from '../../../../../core/service/ue/terreno.service';
import { merge, Subscription } from 'rxjs';
import { Terreno, TerrenoFilter } from '../../../../../core/model/ue/terreno';
import { map } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { OptionsPage } from '../../../../../core/model/server/options-page';
import { AddUpdateTerrenoComponent } from '../add-update-terreno/add-update-terreno.component';
import { MatDialog } from '@angular/material/dialog';
import MousePosition from 'ol/control/MousePosition';
import { TerrenoFilterComponent } from '../terreno-filter/terreno-filter.component';
import { Router, ActivatedRoute } from '@angular/router';
import { PredioService } from 'src/app/core/service/ua/predio.service';
import { ConstruccionService } from 'src/app/core/service/ue/construccion.service';
import { MapComponent } from '../../../map/map.component';
import { MapService } from 'src/app/core/service/map/map.service';
import { GLOBAL_CONSTANTS as GC } from '../../../../../shared/utils/global-constants';
import { CustomConfirmDialogComponent } from './../../../../../shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { Construccion } from 'src/app/core/model/ue/construccion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UepredioService } from 'src/app/core/service/rel/uepredio.service';
import { GLOBAL_CONSTANTS } from '../../../../../shared/utils/global-constants';




export const DEFAULT_HEIGHT = '450px';
export const DEFAULT_WIDTH = '100%';

@Component({
  selector: 'app-terreno-list',
  templateUrl: './terreno-list.component.html',
  styleUrls: ['./terreno-list.component.scss']
})
export class TerrenoListComponent implements OnInit, AfterViewInit, OnDestroy {

  target: string = 'map-' + Math.random().toString(36).substring(2);

  @ViewChild(TerrenoFilterComponent) terrenoFilters!: TerrenoFilterComponent;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MapComponent) superMap!: MapComponent;


  capasList: string[] = ['Terrenos', 'Construcciones'];
  map!: any;
  elementsPage = [200, 250];
  totalElements = 0;
  dataSource = new MatTableDataSource<Terreno>();
  dialogValue: string = "";
  sendValue: string = "";
  mapEl!: HTMLElement;
  mousePositionControl!: MousePosition;
  numFiltros!: number;
  filtersForm: boolean = false;
  filtrosTerreno!: TerrenoFilter;
  multiPolygonList: any[] = [];
  isShowingR: boolean = false;
  isShowingL: boolean = false;
  infoShowing: boolean = false;
  dataShowing: boolean = false;
  isShowMultiPolygonsList: boolean = false;
  geometria!: any;
  selectedRowIndex = 0;  
  showSpinner: Boolean = true;
  layersShowing: Boolean = false;
  construccionId!: number;
  predioId!: number;
  unidadId!: number;
  refocus: boolean = true;  
  comeFrom: Boolean = false;
  terrenoId!: number;

  




  subscriptions: Subscription[] = [];
  displayedColumns = [
    'id',
    'areaTerreno',
    'dimensionTipo',
    'relacionSuperficieTipo',
    'fechaCarga',
    'fechaUltimaModificacion',
    'autorUltimaModificacion',
    'acciones'];

  /*
    @ViewChild('drawer', { static: true })
    drawer!: MatDrawer;
    */

  constructor(
    private uepredioService: UepredioService,
    private snackBar: MatSnackBar,
    private construccionService: ConstruccionService,
    private mapService: MapService,
    private route: Router,
    private service: TerrenoService,
    private predioService: PredioService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    /*
    this.dataSource.sortingDataAccessor =
      (terreno: any, property: string) => {
        switch (property) {
          case 'dimensionTipo':
            return terreno.dimensionTipo?.descripcion;
          default:
            return terreno[property];
        }
      };*/
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {    
    this.manageRouteData();

    this.map = this.superMap.map;

    this.subscriptions.push(
      merge(
        this.paginator.page,
        this.sort.sortChange
      ).subscribe(() => {
        //this.findAllTerrenos();
      })
    );

    let setRowHighlight$ = this.mapService.setRowHighlight$.subscribe(
      (id) => {
        this.selectedRowIndex = id;
      }
    );

    let addGeometria$ = this.mapService.addGeometria$.subscribe(
      (geometria) => {
        this.geometria = geometria;
        this.openAddEditTerreno();
      }
    )

    let addMultiPolygon$ = this.mapService.addMultiPolygon$.subscribe(
      (multiPolygon) => {
        this.multiPolygonList = multiPolygon;
      }
    )

    this.subscriptions.push(setRowHighlight$)
    this.subscriptions.push(addMultiPolygon$)
    this.subscriptions.push(addGeometria$)
  }//Fin ngAfterViewInit

  openSnackBar(message: string, action: string, className: string) {
    this.snackBar.open(message, action, {
      duration: GLOBAL_CONSTANTS.alertDuration,
      panelClass: [className]
    });
  }

  updatePolygonValue(event: any) {
    this.multiPolygonList.push(event);
  }

  mapChanged() {      
    
    if ( this.terrenoId || this.predioId || this.construccionId || this.unidadId || !this.refocus) {
      return;
    } 
    

    if (this.numFiltros != null || this.numFiltros > 0) {
      this.filtrarTerrenosWithExtent();
    } else {
      this.findAllTerrenosWithExtent();
    }
  }

  


  setHighLight(id: number) {
    this.selectedRowIndex = id;
  }


  manageRouteData() {
/*
    'construccionId' in this.activatedRoute.snapshot.params ? this.construccionId = this.activatedRoute.snapshot.params['construccionId'] : '';
    'construccionId' in this.activatedRoute.snapshot.params ? this.findTerrenoByConstruccionId() : '';
    'unidadId' in this.activatedRoute.snapshot.params ? this.findTerrenoByUnidadId(this.activatedRoute.snapshot.params['unidadId']) : '';*/

    'terrenoId' in this.activatedRoute.snapshot.params ? this.terrenoId = this.activatedRoute.snapshot.params['terrenoId']: '';
    'construccionId' in this.activatedRoute.snapshot.params ? this.construccionId = this.activatedRoute.snapshot.params['construccionId']: '';
    'predioId' in this.activatedRoute.snapshot.params ? this.predioId = this.activatedRoute.snapshot.params['predioId'] : '';      
    'unidadId' in this.activatedRoute.snapshot.params ? this.unidadId = this.activatedRoute.snapshot.params['unidadId'] : '';

    

    if( this.route.url.includes('all')){      
      this.findAllTerrenos();
      this.findAllConstrucciones();
    }else{
      this.comeFrom=true;
    }

    if(this.terrenoId){
      this.findTerrenoById(this.terrenoId); 
    }

    if (this.predioId) {      
      this.findTerrenosByPredioId();      
    }
    
    if(this.unidadId){     
      this.findTerrenoByUnidadId();
      this.findConstruccionByUnidadId();      
    }

     if (this.construccionId) {      
      this.findTerrenoByConstruccionId();
      this.findConstruccionById();
    }
    
   


    /*
    if (localStorage.getItem("filtrosTerreno") != null) {
      this.filtrosTerreno = JSON.parse(localStorage.getItem('filtrosTerreno') || '');
      this.numFiltros = Object.keys(this.filtrosTerreno).length;
      this.filtrarTerrenos();
    } else {
      this.findAllTerrenos();
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


  dataShow(){
    this.isShowingL = !this.isShowingL;
    this.dataShowing = !this.dataShowing;
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

  filtrarEvent(filtros: TerrenoFilter) {
    localStorage.setItem('filtrosTerreno', JSON.stringify(filtros));
    this.filtrosTerreno = filtros;
    this.numFiltros = Object.keys(filtros).length;
    this.filtrarTerrenos();
  }

  limpiarFiltrosEvent() {
    this.numFiltros = 0;
    this.filtrosTerreno = {};
    //this.navigationTree.terrenoFilter = {};
    localStorage.removeItem('filtrosTerreno');
    this.findAllTerrenosWithExtent();
  }

  goToPredio(terreno: Terreno) {
    //Navegamos a Predios con el terreno, y sus filtros, para usar su id y busacr los predios relacionados.
    this.route.navigate([`dashboard/Predios`]);
  }


  openAddEditTerreno(terreno?: Terreno): void {

    const config = {
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: 'custom-dialog-panel-class',
      data: { "terreno": terreno, "multiPolygonList": this.multiPolygonList, "geometria": this.geometria }
    };
    const dialogRef = this.dialog.open(AddUpdateTerrenoComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.findAllTerrenosWithExtent();
        //this.findAllTerrenos();
      }
      this.superMap.clearPolygons();
      this.multiPolygonList = [];
      this.isShowMultiPolygonsList = false;
      this.isShowingL = false;

    });
  }


  deleteTerreno(terrenoId: number): void {
    const message = '¿Seguro qué quiere eliminar la tereno?';
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

        this.service.delete(terrenoId).subscribe(
          () => {
            this.paginator.pageIndex = 0;
            this.findAllTerrenosWithExtent();
          },
          () => {

            this.openSnackBar('Error al eliminar el terreno.', '', 'alert');
            this.findAllTerrenosWithExtent();
          }
        );
      }
    });

  }


  getOptions(): OptionsPage {
    const options = new OptionsPage();
    options.createOptionsSearch(this.paginator, this.sort);
    return options;
  }
  

  ////////////////////////////////////////////////////////////////////////////////// Búsquedas 

  ///////////////////////////////////////////////////////////////////////////////////Terrenos

  findAllTerrenos() {    
    this.refocus=false;
    console.log("findAllTerrenos");    
    this.filtrosTerreno = {};
    this.showSpinner = true;
    const subscription = this.service.findAll(this.getOptions()).pipe(
      map((page) => {
        this.totalElements = page.totalElements;               
        return page.content.map(terrenoDto => {
          const terreno: Terreno = {
            ...terrenoDto
          };
          return terreno;
        });
      }),
    ).subscribe(
      (terrenos: Terreno[]) => {
        this.showSpinner = false;
        this.dataSource.data = terrenos;
        this.superMap.loadGeometrias(terrenos, GC.terreno, true);
      },
      () => this.openSnackBar('No hay terrenos en la base de datos.', '', 'alert')
    );
    this.subscriptions.push(subscription);      
    setTimeout(()=>{this.refocus=true}, 1000);
  }

  findAllTerrenosWithExtent() {
    console.log("findAllTerrenosWithExtent");
    this.findAllConstruccionesWithExtent();
    this.filtrosTerreno = {};
    this.showSpinner = true;
    const subscription = this.service.getAllWithExtent(this.getOptions(), this.superMap.getExtent()).pipe(
      map((page) => {        
        this.totalElements = page.totalElements;   
        return page.content.map(terrenoDto => {
          const terreno: Terreno = {
            ...terrenoDto
          };
          return terreno;
        });
      }),
    ).subscribe(
      (terrenos: Terreno[]) => {
        this.showSpinner = false;
        this.dataSource.data = terrenos;
        this.superMap.loadGeometrias(terrenos,  GC.terreno);
      },
      () => this.openSnackBar('No hay terrenos para este territorio', '', 'alert')
    );
    this.subscriptions.push(subscription);
  }  

  ////////////////////////////////////////////////////////////////////////////////Construcciones

  findAllConstrucciones() {
    console.log("findAllConstrucciones");
    this.filtrosTerreno = {};
    this.showSpinner = true;
    const subscription = this.construccionService.findAll(this.getOptions()).pipe(
      map((page) => {        
        return page.content.map(Construccion => {
          const construccion: Construccion = {
            ...Construccion
          };
          return construccion;
        });
      }),
    ).subscribe(
      (construcciones: Construccion[]) => {
        this.showSpinner = false;
        this.superMap.loadConstrucciones(construcciones, GC.construcion);
      },
      () => this.openSnackBar('No hay construcciones en la base de datos.', '', 'alert')

    );
    this.subscriptions.push(subscription);
  }

  findAllConstruccionesWithExtent() {
    console.log("findConstruccionesWithExtent") 
    const subscription = this.construccionService.getAllWithExtent(this.getOptions(), this.superMap.getExtent()).pipe(
      map((page) => {        
        return page.content.map(construccion => {
          const construccionDto: Construccion = {
            ...construccion
          }; 
          this.showSpinner = false;        
          return construccion;
        });
      }),
    ).subscribe(
      (construcciones: Construccion[]) => {        
        this.superMap.loadConstrucciones(construcciones, GC.construcion);
      },
      () => {        
        //this.openSnackBar('No hay construcciones en este territorio.', '', 'alert');
      }
    );
    this.subscriptions.push(subscription);
  }

  filtrarTerrenos() {

    this.showSpinner = true;

    const subscription = this.service.filter(this.getOptions(), this.filtrosTerreno).pipe(
      map((page) => {        
        this.totalElements = page.totalElements;   
        return page.content.map(terrenoDto => {
          const terreno: Terreno = {
            ...terrenoDto
          };
         
          return terreno;
        });
      }),

    ).subscribe(
      (terrenos: Terreno[]) => {
        this.dataSource.data = terrenos;        
        this.superMap.loadGeometrias(terrenos,GC.terreno, true);
        this.showSpinner = false;
      },
      () => {   
        this.showSpinner = false;          
        this.openSnackBar('No hay terrenos con estos filtros.', '', 'alert')
      }
    );
    this.subscriptions.push(subscription);   
  }

  filtrarTerrenosWithExtent() {
    console.log("terreno-list.filtrarTerrenosWithExtent");
    this.showSpinner = true;

    const subscription = this.service.filter(this.getOptions(), this.filtrosTerreno).pipe(
      map((page) => {        
        this.totalElements = page.totalElements;   
        return page.content.map(terrenoDto => {
          const terreno: Terreno = {
            ...terrenoDto
          };
          this.showSpinner = false;
          return terreno;
        });
      }),

    ).subscribe(
      (terrenos: Terreno[]) => {
        this.dataSource.data = terrenos;
        this.showSpinner = false;
        this.superMap.loadGeometrias(terrenos, GC.terreno);
      },
      () => {         
        this.openSnackBar('No hay terrenos con estos filtros.', '', 'alert')
      }
    );
    this.subscriptions.push(subscription);
    
  }

  findTerrenoByConstruccionId(){     
      
    this.showSpinner = true;
    let filtro = {'construccionId': this.construccionId}; 
     
    const subscription = this.uepredioService.findTerrenoByConstruccionId(filtro).pipe(
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
      (terrenos: Terreno[]) => {
         //(Unique)=> Filtro por id único, ya que pueden llegar varios registros con el mismo id.
        //La tabla rel_uePredio, registra varias tuplas por terreno, ya que puede haber varios predios, para el mismo terreno.
        //this.dataSource.data =Array.from(new Set(predios.map(a=>a.id))).map(id=>{ return predios.find(a => a.id === id)}) as Predio[];
        this.dataSource.data=terrenos;               
        this.superMap.loadGeometrias(terrenos, GC.construcion, true);       
        
      },
      () => { 
        
        this.openSnackBar(`No hay terrenos relacionados con la coinstruccion con id:${this.construccionId}`, '', 'alert');
      }
    );
    this.subscriptions.push(subscription);
   
  }

  findTerrenoByUnidadId(){     
      
    this.showSpinner = true;
    let filtro = {'unidadconstruccionId': this.unidadId}; 
     
    const subscription = this.uepredioService.findTerrenoByUnidadId(filtro).pipe(
      map((page) => {        
        this.totalElements = page.totalElements;   
        return page.content.map(terrenoDto => {
          const terreno: any = {
            ...terrenoDto
            ,
            dimensionTipo: undefined,
            relacionSuperficieTipo: undefined,
            extDireccion: undefined
          };
          this.showSpinner = false;
          return terreno;
        });
      }),
    ).subscribe(
      (terrenos: Terreno[]) => {
         //(Unique)=> Filtro por id único, ya que pueden llegar varios registros con el mismo id.
        //La tabla rel_uePredio, registra varias tuplas por terreno, ya que puede haber varios predios, para el mismo terreno.
        //this.dataSource.data =Array.from(new Set(predios.map(a=>a.id))).map(id=>{ return predios.find(a => a.id === id)}) as Predio[];
        this.dataSource.data=terrenos;         
             
        this.superMap.loadGeometrias(terrenos, GC.construcion, true);
        this.showSpinner = false;
        
      },
      () => {        
        this.openSnackBar(`No hay terrenos relacionados con la unidad con id:${this.construccionId}`, '', 'alert');
      }
    );
    this.subscriptions.push(subscription);
  }

  findTerrenosByPredioId(){     
    console.log("findTerrenosByPredioId");
    this.showSpinner = true;
    let filtro = {'predioId': this.predioId};     
     
    const subscription = this.uepredioService.findTerrenoByPredioId(filtro).pipe(
      map((page) => {        
        this.totalElements = page.totalElements;   
        return page.content.map(terrenoDto => {
          const terreno: any = {
            ...terrenoDto
            ,
            dimensionTipo: undefined,
            relacionSuperficieTipo: undefined,
            extDireccion: undefined
          };          
          return terreno;
        });
      }),
    ).subscribe(
      (terrenos: Terreno[]) => {
         //(Unique)=> Filtro por id único, ya que pueden llegar varios registros con el mismo id.
        //La tabla rel_uePredio, registra varias tuplas por terreno, ya que puede haber varios predios, para el mismo terreno.
        this.dataSource.data =Array.from(new Set(terrenos.map(a=>a.id))).map(id=>{ return terrenos.find(a => a.id === id)}) as Terreno[];                 
             
        this.superMap.loadGeometrias(this.dataSource.data, GC.construcion, true);       
        this.showSpinner = false;        
      },
      () => {      
        this.showSpinner = false;  
        this.openSnackBar(`No hay terrenos relacionados el predio con id:${this.predioId}`, '', 'alert');
      }
    );
    this.subscriptions.push(subscription);
  }

  findConstruccionByUnidadId(){  

    console.log("En findConstruccionByUnidadId");    
      
    this.showSpinner = true;
    let filtro = {'unidadConstruccionId': this.unidadId};
    const subscription = this.uepredioService.findConstruccionesByUnidadId(filtro).pipe(
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
          
          return predio;
        });
      }),
    ).subscribe(
      (construcciones: Construccion[]) => {
         //(Unique)=> Filtro por id único, ya que pueden llegar varios registros con el mismo id.
        //La tabla rel_uePredio, registra varias tuplas por terreno, ya que puede haber varios predios, para el mismo terreno.
        //this.dataSource.data =Array.from(new Set(predios.map(a=>a.id))).map(id=>{ return predios.find(a => a.id === id)}) as Predio[];                      
        this.superMap.loadConstrucciones(construcciones, GC.construcion, true);       
        this.showSpinner = false;
      },
      () => {     
        this.showSpinner = false;           
        this.openSnackBar(`No hay construciones relacionados con la unidad con id:${this.unidadId}`, '', 'alert');
      }
    );
    this.subscriptions.push(subscription);
  }

  findConstruccionById(){  

    console.log("En findConstruccionById");    
      
    this.showSpinner = true;
    let filtro = {'id': this.construccionId};
    const subscription = this.construccionService.filter(this.getOptions(), filtro).pipe(
      map((page) => {
        this.totalElements = page.totalElements;
        this.totalElements = page.totalElements;   
        return page.content.map(construccionDto => {
          const construccion: any = {
            ...construccionDto
            ,
            dimensionTipo: undefined,
            relacionSuperficieTipo: undefined,
            extDireccion: undefined
          };
          this.showSpinner = false;
          return construccion;
        });
      }),
    ).subscribe(
      (construcciones: Construccion[]) => {
         //(Unique)=> Filtro por id único, ya que pueden llegar varios registros con el mismo id.
        //La tabla rel_uePredio, registra varias tuplas por terreno, ya que puede haber varios predios, para el mismo terreno.
        //this.dataSource.data =Array.from(new Set(predios.map(a=>a.id))).map(id=>{ return predios.find(a => a.id === id)}) as Predio[];                      
        this.superMap.loadConstrucciones(construcciones, GC.construcion, true);       
        
      },
      () => {                
        this.openSnackBar(`No hay construciones relacionados con el id:${this.unidadId}`, '', 'alert');
      }
    );
    this.subscriptions.push(subscription);
  }

  findTerrenoById(terrenoId: number){  
    this.showSpinner = true;     
    let filtro = {'id': terrenoId};
    const subscription = this.service.filter(this.getOptions(), filtro).pipe(
      map((page) => {
        this.totalElements = page.totalElements;
        this.totalElements = page.totalElements;   
        return page.content.map(terrenoDto => {
          const terreno: any = {
            ...terrenoDto
          };
          this.showSpinner = false;
          return terreno;
        });
      }),
    ).subscribe(
      (terrenos: Terreno[]) => {
        this.showSpinner = false;
        this.superMap.loadGeometrias(terrenos, GC.construcion, true);
        this.dataSource.data=terrenos;  
        
      },
      () => {
        //alert('No hay predios relacionados con este terreno.');
        this.openSnackBar(`No hay terenos con este id:${terrenoId}`, '', 'alert');
      }
    );
    this.subscriptions.push(subscription);
  }

 
}








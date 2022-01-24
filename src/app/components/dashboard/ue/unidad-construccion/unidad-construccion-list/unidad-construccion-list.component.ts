import { AfterViewInit, Component, OnInit, ViewChild, ElementRef, Output } from '@angular/core';
import { merge, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { OptionsPage } from '../../../../../core/model/server/options-page';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { UnidadConstruccionFilter, UnidadConstruccion } from 'src/app/core/model/ue/unidadConstruccion';
import { UnidadConstruccionService } from 'src/app/core/service/ue/unidadDeConstruccion.service';
import { Construccion } from 'src/app/core/model/ue/construccion';
import { TerrenoService } from '../../../../../core/service/ue/terreno.service';
import { ConstruccionService } from 'src/app/core/service/ue/construccion.service';
import { Terreno } from '../../../../../core/model/ue/terreno';
import { UnidadConstruccionFilterComponent } from '../unidad-construccion-filter/unidad-construccion-filter.component';
import { UnidadConstruccionAddUpdateComponent } from '../unidad-construccion-add-update/unidad-construccion-add-update.component';
import { CustomConfirmDialogComponent } from './../../../../../shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { MapComponent } from '../../../map/map.component';
import Map from 'ol/Map';
import { MapService } from 'src/app/core/service/map/map.service';
import { GLOBAL_CONSTANTS as GC } from 'src/app/shared/utils/global-constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UepredioService } from 'src/app/core/service/rel/uepredio.service';
import { GLOBAL_CONSTANTS } from 'src/app/shared/utils/global-constants';







export const DEFAULT_HEIGHT = '450px';
export const DEFAULT_WIDTH = '100%';

@Component({
  selector: 'app-unidad-construccion-list',
  templateUrl: './unidad-construccion-list.component.html',
  styleUrls: ['./unidad-construccion-list.component.scss']
})
export class UnidadConstruccionListComponent implements OnInit, AfterViewInit {



  @ViewChild(UnidadConstruccionFilterComponent) unidadConstruccionFilterComponent!: UnidadConstruccionFilterComponent;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MapComponent) superMap!: MapComponent;


  capasList: string[] = ['Terrenos', 'Construcciones', 'Unidades'];
  map!: Map;
  elementsPage = [200, 250];
  totalElements = 0;
  dataSource = new MatTableDataSource<UnidadConstruccion>();
  dialogValue: string = "";
  sendValue: string = "";
  numFiltros!: number;
  filtersForm: boolean = false;
  filtrosUnidadConstruccion!: UnidadConstruccionFilter;
  construccionId!: number;
  isShowingR: boolean = false;
  isShowingL: boolean = false;
  infoShowing: boolean = false;
  isShowMultiPolygonsList: boolean = false;
  unidadConstruccion!: UnidadConstruccion;
  multiPolygonList: any[] = [];
  layersShowing: boolean = false;  
  showSpinner: Boolean = false;
  terrenoId!: number;
  selectedRowIndex = 0;
  geometria!: any;
  predioId!: number;
  comeFrom: boolean = false;




  subscriptions: Subscription[] = [];
  displayedColumns = [
    'id',
    'identificador',
    'construccionTipo',
    'dominioConstruccionTipo',
    'unidadConstruccionTipo',
    'construccionPlantaTipo',
    'plantaUbicacion',
    'usoUnidadConstruccionTipo',
    'areaConstruida',
    'dimensionTipo',
    'relacionSuperficieTipo',
    //'areaPrivadaConstruida',    
    'fechaCaptura',
    'fechaUltimaModificacion',
    'autorUltimaModificacion',

    'acciones'
  ];


  @ViewChild('drawer', { static: true })
  drawer!: MatDrawer;

  constructor(
     private uePredioService: UepredioService,
    private snackBar: MatSnackBar,
    private terrenoService: TerrenoService,
    private construccionService: ConstruccionService,
    private mapService: MapService,
    private route: Router,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private service: UnidadConstruccionService
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
      };
    */
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  ngOnInit() {
    this.manageRouteData();
  }

  ngAfterViewInit(): void {
    this.map = this.superMap.map;
    this.addSubscriptions();

  }//Fin ngAfterViewInit 

  addSubscriptions() {

    this.subscriptions.push(
      merge(
        this.paginator.page,
        this.sort.sortChange
      ).subscribe(() => {
        //this.findAllUnidades();
      })
    );

    let addMultiPolygon$ = this.mapService.addMultiPolygon$.subscribe(
      (multiPolygon) => {
        this.multiPolygonList = multiPolygon;
      }
    );

    let setRowHighlight$ = this.mapService.setRowHighlight$.subscribe(
      (id) => {
        this.selectedRowIndex = id;
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

  openSnackBar(message: string, action: string, className: string) {
    this.snackBar.open(message, action, {
      duration: GLOBAL_CONSTANTS.alertDuration,
      panelClass: [className]
    });
  }

  updatePolygonValue(event: any) {
    this.multiPolygonList.push(event);
  }

  setHighLight(id: number){
    this.selectedRowIndex=id;
  }



  mapChanged() {

    if(this.predioId || this.terrenoId || this.construccionId){
      return;
    } 

    if (this.predioId || this.numFiltros != null || this.numFiltros > 0) {
      this.findAllUnidadesWithExtent();
      //Cambiar a this.filtrarWithExtent
    } else {
      this.findAllUnidadesWithExtent();
    }
  }

  manageRouteData() {

    'construccionId' in this.activatedRoute.snapshot.params ? this.construccionId = this.activatedRoute.snapshot.params['construccionId'] : '';
    'terrenoId' in this.activatedRoute.snapshot.params ? this.terrenoId = this.activatedRoute.snapshot.params['terrenoId'] : '';
    'predioId' in this.activatedRoute.snapshot.params ? this.predioId = this.activatedRoute.snapshot.params['predioId'] : '';      


    if( this.route.url.includes('all')){      
      this.findAllUnidades();
      this.findAllConstrucciones();
    }else{
      this.comeFrom=true;
    }

    if (this.construccionId) {
      this.findUnidadesByConstruccionId(this.construccionId);
      this.findConstruccionById(this.construccionId);
    }

    if(this.predioId){
      this.findUnidadesByPredioId(this.predioId); 
    }

    
    if (this.terrenoId) {
      this.findTerrenoById(this.terrenoId);
    }else if(this.construccionId && !this.terrenoId){      
            this.findTerrenoByConstruccionId(this.construccionId);
    }

    

    /*
    if (localStorage.getItem("filtrosUnidadesConstruccion") != null) {
      this.filtrosUnidadConstruccion = JSON.parse(localStorage.getItem('filtrosUnidadesConstruccion') || '');
      this.numFiltros = Object.keys(this.filtrosUnidadConstruccion).length;
      this.filtrarConstrucciones(this.filtrosUnidadConstruccion);
    }  */
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
    //localStorage.setItem('filtrosConstrucciones', JSON.stringify(dto));
    this.filtrosUnidadConstruccion = dto;
    this.numFiltros = Object.keys(dto).length;
    this.filtrarConstrucciones(dto);
  }

  limpiarFiltrosEvent() {
    this.numFiltros = 0;
    this.filtrosUnidadConstruccion = {};
    //localStorage.removeItem('filtrosConstrucciones');
    this.findAllUnidadesWithExtent();
  }

  createUnidadConstruccion() {
    if (this.construccionId != null) {
      this.superMap.addDraw()
    } else {
      this.openNoTerrenoAlert();
    }
  }

  openNoTerrenoAlert() {
    let message = "Para crear una unidad de contrucción, antes tienes que seleccionar una contrucción.";
    let confirmBtnText = "Ir a construcciones";
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
        this.route.navigate(['dashboard/construccion']);
      }
    });

  }

 
  openAddEditModal(unidadConstruccion?: UnidadConstruccion): void {

    const config = {
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: 'custom-dialog-panel-class',
      data: {
        "unidadConstruccion": unidadConstruccion,
        "multiPolygonList": this.multiPolygonList,
        "geometria": this.geometria,
        "construccionId": this.construccionId
      }
    };
    const dialogRef = this.dialog.open(UnidadConstruccionAddUpdateComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.findUnidadesByConstruccionId(this.construccionId);
      }
      this.superMap.clearPolygons();
      this.multiPolygonList = [];
      this.isShowMultiPolygonsList = false;
      this.isShowingL = false;
    });
  }


  deleteTerreno(construccionId: number): void {
    const message = '¿Seguro qué quiere eliminar la construcción?';
    if (confirm(message)) {
      this.service.delete(construccionId).subscribe(
        () => {
          this.paginator.pageIndex = 0;
          this.findAllUnidades();
        },
        () => {
          alert('Error al eliminar el construcción');
          this.findAllUnidades();
        }
      );
    }
  }

  private getOptions(): OptionsPage {
    const options = new OptionsPage();
    options.createOptionsSearch(this.paginator, this.sort);
    return options;
  }

  private findAllUnidades() {
    console.log("findAllUnidades");

    this.showSpinner = true;

    this.findAllConstrucciones();
    this.findAllTerrenos();
    this.filtrosUnidadConstruccion = {};

    const subscription = this.service.findAll(this.getOptions()).pipe(
      map((page) => {
        this.totalElements = page.totalElements;
        return page.content.map(construccion => {
          const construccionDto: UnidadConstruccion = {
            ...construccion
          };
          this.showSpinner = false;
          return construccion;
        });
      }),
    ).subscribe(
      (construcciones: UnidadConstruccion[]) => {
        this.dataSource.data = construcciones;
        this.superMap.loadUnidades(construcciones, GC.unidadConstruccion);
      },
      () => alert('No hay datos en la base.')
    );
    this.subscriptions.push(subscription);
  }

  findAllConstrucciones() {
    const subscription = this.construccionService.findAll(this.getOptions()).pipe(
      map((page) => {
        this.totalElements = page.totalElements;
        return page.content.map(construccion => {
          const construccionDto: Construccion = {
            ...construccion
            /*,
            dimensionTipo: undefined,
            relacionSuperficieTipo: undefined,
            extDireccion: undefined*/
          };
          return construccion;
        });
      }),
    ).subscribe(
      (construcciones: Construccion[]) => {
        this.superMap.loadConstrucciones(construcciones, GC.construcion);
      },
      () => alert('No hay datos en la base.')
    );
    this.subscriptions.push(subscription);
  }

  findAllTerrenos() {

    const subscription = this.terrenoService.findAll(this.getOptions()).pipe(
      map((page) => {
        this.totalElements = page.totalElements;
        return page.content.map(terreno => {
          const terrenoDto: Terreno = {
            ...terreno
            /*,
            dimensionTipo: undefined,
            relacionSuperficieTipo: undefined,
            extDireccion: undefined*/
          };
          return terrenoDto;
        });
      }),
    ).subscribe(
      (terrenos: Terreno[]) => {
        this.superMap.loadTerrenos(terrenos, GC.terreno);
      },
      () => alert('No hay datos en la base.')
    );
    this.subscriptions.push(subscription);
  }

  private filtrarConstrucciones(filtrosConstruccion: UnidadConstruccionFilter) {

    const subscription = this.service.filter(this.getOptions(), filtrosConstruccion).pipe(
      map((page) => {
        this.totalElements = page.totalElements;
        return page.content.map(construccion => {
          const construccionDto: UnidadConstruccion = {
            ...construccion
          };
          return construccion;
        });
      }),

    ).subscribe(
      (construcciones: UnidadConstruccion[]) => {
        this.dataSource.data = construcciones;
        this.superMap.loadGeometrias(construcciones, GC.unidadConstruccion);
      },
      () => {
        alert('Error al cargar las construcciones');
      }
    );
    this.subscriptions.push(subscription);
  }

  private findUnidadesByConstruccionId(id: number) {

    const subscription = this.service.findUnidadesByConstruccionId(this.getOptions(), id).pipe(
      map((page) => {
        this.totalElements = page.totalElements;
        return page.content.map((unidadConstruccionDto: UnidadConstruccion) => {
          const construccion: UnidadConstruccion = {
            ...unidadConstruccionDto
          };
          return construccion;
        });
      }),
    ).subscribe(
      (construcciones: UnidadConstruccion[]) => {
        this.dataSource.data = construcciones;
        this.superMap.loadGeometrias(construcciones,  GC.unidadConstruccion);
        //this.superMap.searchInMap(construcciones[1]);
      },
      () => {
        this.dataSource.data = [];
        this.openSnackBar(`No hay unidades para la construcción con id:${this.construccionId}`, '', 'alert');

      }
    );
    this.subscriptions.push(subscription);
  }

  findAllUnidadesWithExtent() {
    if (this.construccionId) {
      return;
    }
    this.filtrosUnidadConstruccion = {};
    this.showSpinner = true;
    const subscription = this.service.getAllWithExtent(this.getOptions(), this.superMap.getExtent()).pipe(
      map((page) => {
        this.totalElements = page.totalElements;
        return page.content.map(unidadDto => {
          const unidad: UnidadConstruccion = {
            ...unidadDto
          };
          this.showSpinner = false;
          return unidad;
        });
      }),
    ).subscribe(
      (unidades: UnidadConstruccion[]) => {
        this.dataSource.data = unidades;
        this.superMap.loadGeometrias(unidades, GC.unidadConstruccion);
      },
      () => alert('No hay datos en la base.')
    );
    this.subscriptions.push(subscription);
  }

  findAllConstruccionesWithExtent() {
    const subscription = this.construccionService.getAllWithExtent(this.getOptions(), this.superMap.getExtent()).pipe(
      map((page) => {
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
        this.superMap.loadConstrucciones(construcciones, GC.construcion);
      },
      () => this.openSnackBar('No hay datos en la base de datos.', '', 'alert')
    );
    this.subscriptions.push(subscription);
  }

  findAllTerrenosWithExtent() {
    this.showSpinner = true;
    const subscription = this.terrenoService.getAllWithExtent(this.getOptions(), this.superMap.getExtent()).pipe(
      map((page) => {
        this.totalElements = page.totalElements;
        return page.content.map(terrenoDto => {
          const terreno: Terreno = {
            ...terrenoDto
          };
          this.showSpinner = false;
          return terreno;
        });
      })
    ).subscribe(
      (terrenos: Terreno[]) => {
        this.superMap.loadTerrenos(terrenos, GC.terreno);
      },
      () => this.openSnackBar('No hay terrenos en la base de datos.', '', 'alert')
    );
    this.subscriptions.push(subscription);
  }

  findConstruccionById(id: number) {
    let filtroConstruccion = { 'id': id };
    const subscription = this.construccionService.filter(this.getOptions(), filtroConstruccion).pipe(
      map((page) => {
        this.totalElements = page.totalElements;
        return page.content.map(terrenoDto => {
          const construccion: Construccion = {
            ...terrenoDto
          };
          return construccion;
        });
      }),

    ).subscribe(
      (consrtucciones: Construccion[]) => {
        this.superMap.loadConstrucciones(consrtucciones, GC.terreno, true);
      },
      () => {
        this.numFiltros = 0;
        this.openSnackBar(`No hay unidades de construcción relacionadas con el predio con id:${this.construccionId}`, '', 'alert');
      }
    );
    this.subscriptions.push(subscription);
  }

  findTerrenoById(id: number) {
    let filtroTerreno = { 'id': id };
    const subscription = this.terrenoService.filter(this.getOptions(), filtroTerreno).pipe(
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
        this.superMap.loadTerrenos(terrenos, GC.terreno, true);
      },
      () => {
        this.numFiltros = 0;
        this.openSnackBar(`Error al cargar el terreno con el id:${this.terrenoId}`, '', 'alert');
      }
    );
    this.subscriptions.push(subscription);
  }

  findUnidadesByPredioId(predioId: number) {    
    let filtro = { 'predioId': predioId };
    const subscription = this.uePredioService.findUnidadByPredioId(filtro).pipe(
      map((page) => {
        this.totalElements = page.totalElements;
        return page.content.map(unidadDto => {
          const unidad: UnidadConstruccion = {
            ...unidadDto
          };
          return unidad;
        });
      }),

    ).subscribe(
      (unidades: UnidadConstruccion[]) => {
        //(Unique)=> Filtro por id único, ya que pueden llegar varios registros con el mismo id.
        //La tabla rel_uePredio, registra varias tuplas por terreno, ya que puede haber varios predios, para el mismo terreno.
        this.dataSource.data =Array.from(new Set(unidades.map(a=>a.id))).map(id=>{ return unidades.find(a => a.id === id)}) as UnidadConstruccion[];       


        this.superMap.loadTerrenos(unidades, GC.unidadConstruccion, true);
        this.showSpinner=false;
      },
      () => {
        this.numFiltros = 0;
        this.showSpinner=false;
        this.openSnackBar(`No hay unidades relacionadas con el predio id:${this.predioId}`, '', 'alert');
      }
    );
    this.subscriptions.push(subscription);
  }

  findTerrenoByConstruccionId(construccionId: number){   

    let filtroUEPredio = { 'construccionId': construccionId };
    const subscription = this.uePredioService.getTerrnoByConstruccionId(filtroUEPredio).pipe(
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
        this.superMap.loadTerrenos(terrenos, GC.terreno, true);
      },
      () => {
        this.numFiltros = 0;
        this.openSnackBar(`Error al cargar el terreno de la construcción id:${this.construccionId}`, '', 'alert');
      }
    );
    this.subscriptions.push(subscription);
  }



}




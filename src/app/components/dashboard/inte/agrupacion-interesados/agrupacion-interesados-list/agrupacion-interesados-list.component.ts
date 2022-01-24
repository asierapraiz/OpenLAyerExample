import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Location } from '@angular/common'
import { MatPaginator } from '@angular/material/paginator';
import { AgrupacionInteresados, AgrupacionInteresadosFiltrado } from 'src/app/core/model/inte/agrupacionInteresados';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { OptionsPage } from '../../../../../core/model/server/options-page';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { InteresadoService } from 'src/app/core/service/inte/interesado.service';
import { AgrupacionInteresadosService } from 'src/app/core/service/inte/agrupacion-interesado.service';
import { Interesado, InteresadoFiltrado } from 'src/app/core/model/inte/interesado';
import { AddUpdateAgrupacionInteresadosComponent } from '../add-update-agrupacion-interesados/add-update-agrupacion-interesados.component';
import { UepredioService } from 'src/app/core/service/rel/uepredio.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { GLOBAL_CONSTANTS } from 'src/app/shared/utils/global-constants';
import { PredioInteresadoService } from 'src/app/core/service/rel/predio-interesado.service';




@Component({
  selector: 'app-agrupacion-interesados-list',
  templateUrl: './agrupacion-interesados-list.component.html',
  styleUrls: ['./agrupacion-interesados-list.component.scss']
})
export class AgrupacionInteresadosListComponent implements OnInit {


  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {   
    console.log('Back button pressed');
  }

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild(MatPaginator, { static: true })

  paginator!: MatPaginator;
  elementsPage = [20, 50, 100];
  totalElements = 0;
  dataSource = new MatTableDataSource<AgrupacionInteresados>();  
  navigationTree!: any;
  interesadoId!: number;
  interesadoPendiente: Boolean = false;
  interesadoPendienteId!: number;
  predioId!: number;
  showSpinner: Boolean = false;
  numUnidades: number=0;
  



  subscriptions: Subscription[] = [];

  displayedColumns = ['id', 'grupoInteresadoTipo', 'nombre', 'comienzoVidaUtilVersion', 'fechaUltimaModificacion', 'autorUltimaModificacion', 'acciones'];


  constructor(
    private predioInteresadoService: PredioInteresadoService,
    private snackBar: MatSnackBar,
    private uepredioService: UepredioService,
    private interesadoService: InteresadoService,
    private dialog: MatDialog,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private AIService: AgrupacionInteresadosService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.manageRouteData();
  }


  ngAfterViewInit(): void {
     
  }//Fin ngAfterViewInit 

  manageRouteData() {

    'interesadoId' in this.activatedRoute.snapshot.params ? this.interesadoId = this.activatedRoute.snapshot.params['interesadoId'] : '';
    'predioId' in this.activatedRoute.snapshot.params ? this.predioId = this.activatedRoute.snapshot.params['predioId'] : '';
    this.route.url.includes('selecciona-agrupacion') ? this.interesadoPendiente = true : this.interesadoPendiente = false;
    
    
    //'navigationTree' in history.state ? this.manageRouteData() : this.findAll(this.getOptions());  
    
    if(this.predioId){
    this.findAgrupacionByPredioId();
   }

    if (this.interesadoId) {
      this.findAgrupacionByInteresadoId(this.interesadoId);
    } else {
      this.findAll(this.getOptions())
    }
  }

  findAgrupacionByInteresadoId(interesadoId: any) {
    alert("Todo->implementár filtrado de agrupaciones por interesadoId");
   
  }

  public filtrarAgrupaciones(agrupacion: AgrupacionInteresadosFiltrado) {

    this.showSpinner = true;
    const subscription = this.AIService.filter(this.getOptions(), agrupacion).pipe(
      map((page) => {
        this.totalElements = page.totalElements;
        return page.content.map(agrupacionDto => {
          const agrupacion: AgrupacionInteresados = {
            ...agrupacionDto
          };
          this.showSpinner = false;
          return agrupacion;
        });
      }),
    ).subscribe(
      (agrupacionesInteresados: AgrupacionInteresados[]) => {
        this.dataSource.data = agrupacionesInteresados;
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

  backToInteresado(agrupacionInteresados: AgrupacionInteresados) {
    localStorage.setItem('agrupacion-seleccionada', JSON.stringify(agrupacionInteresados));
    this.location.back();
    /*this.navigationTree.grupoInteresados = agrupacionInteresados;
    this.route.navigate([`dashboard/interesados`], { state: { navigationTree: this.navigationTree } });*/
  }

  backToPredios() {
    alert('backToPredios');
  }

  openSnackBar(message: string, action: string, className: string) {
    this.snackBar.open(message, action, {
      duration: GLOBAL_CONSTANTS.alertDuration,
      panelClass: [className]
    });
  }


  private findAll(options?: OptionsPage) {

    this.showSpinner = true;
    const subscription = this.AIService.findAll(options).pipe(
      map((page) => {
        this.totalElements = page.totalElements;
        return page.content.map(agrupacionInte => {
          const agrupacion: AgrupacionInteresados = {
            ...agrupacionInte
          };
          this.showSpinner = false;
          return agrupacionInte;
        });
      }),

    ).subscribe(
      (agrupacionInte: AgrupacionInteresados[]) => {
        this.dataSource.data = agrupacionInte;
      },
      () => alert('Error al cargar los grupos de interesados')
    );
    this.subscriptions.push(subscription);
  }

  findAgrupacionByPredioId(){     
    console.log("findTerrenosByPredioId");
    this.showSpinner = true;
    let filtro = {'predioId': this.predioId}; 
     
    const subscription = this.predioInteresadoService.findAgrupacionByPredioId(filtro).pipe(
      map((page) => {
        
        return page.content.map(agrupacionDto => {
          const agrupacion: any = {
            ...agrupacionDto           
          };          
          return agrupacion;
        });
      }),
    ).subscribe(
      (agrupaciones: AgrupacionInteresados[]) => {
         
        this.dataSource.data = agrupaciones;            
                     
        this.showSpinner = false;        
      },
      () => {      
        this.showSpinner = false;  
        this.openSnackBar(`No hay agrupación relacionada con  el predio con id:${this.predioId}`, '', 'alert');
      }
    );
    this.subscriptions.push(subscription);
  }

  public filtrarInteresados(interesado: InteresadoFiltrado) {
    this.showSpinner = true;
    const subscription = this.interesadoService.filter(this.getOptions(), interesado).pipe(
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
      () => alert('No hay datos con estos filtros')
    );
    this.subscriptions.push(subscription);
  }

  openAddOrUpdateAgrupacionModal(agrupacion?: AgrupacionInteresados): void {

    const config = {
      width: '700px',
      disableClose: true,
      data: { "agrupacion": agrupacion }
    };
    const dialogRef = this.dialog.open(AddUpdateAgrupacionInteresadosComponent, config);
    dialogRef.afterClosed().subscribe(result => {

      this.findAll(this.getOptions());
      /*
      if (result && this.from != null) {
        this.findInteresadosByPredioId(this.from.id);  
      }else if(result){
        this.findAllInteresados(this.getOptions());
      }*/
    });
  }



  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

}


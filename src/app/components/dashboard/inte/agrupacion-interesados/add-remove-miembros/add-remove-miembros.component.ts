import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Predio, PredioDto } from 'src/app/core/model/ua/predio';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { OptionsPage } from '../../../../../core/model/server/options-page';
import { MatDialog } from '@angular/material/dialog';
import { AddUpdateInteresadoComponent } from '../../interesado/add-update-interesado/add-update-interesado.component';
import { ActivatedRoute, Router } from '@angular/router';
import { InteresadoService } from 'src/app/core/service/inte/interesado.service';
import { Interesado, InteresadoFiltrado } from 'src/app/core/model/inte/interesado';
import { UepredioService } from 'src/app/core/service/rel/uepredio.service';
import { NavigationTree } from 'src/app/core/model/navigation-tree';
import { AgrupacionInteresadosService } from 'src/app/core/service/inte/agrupacion-interesado.service';
import { AgrupacionInteresados } from 'src/app/core/model/inte/agrupacionInteresados';
import { MiembroAgrupacion } from 'src/app/core/model/rel/miembroAgrupacion';
import { CustomConfirmDialogComponent } from '../../../../../shared/components/custom-confirm-dialog/custom-confirm-dialog.component';

@Component({
  selector: 'app-add-remove-miembros',
  templateUrl: './add-remove-miembros.component.html',
  styleUrls: ['./add-remove-miembros.component.scss']
})
export class AddRemoveMiembrosComponent implements OnInit {


  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    if (this.comeFrom.id) {
      //this.toTerrenos();
    }
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
  comeFrom: any;
  actual: string = "interesados";
  navigationTree!: any;
  miembro!: Interesado;
  miembros: Interesado[] = [];
  agrupacion: AgrupacionInteresados = new AgrupacionInteresados();



  subscriptions: Subscription[] = [];

  displayedColumns = ['id', 'tipoDocumento', 'documentoIdentidad', 'primerNombre', 'primerApellido', 'segundoApellido', 'sexoTipo', 'grupoEtnicoTipo', 'razonSocial', 'nombre', 'fechaCaptura', 'fechaUltimaModificacion', 'autorUltimaModificacion', 'acciones'];



  constructor(
    private interesadoService: InteresadoService,
    private dialog: MatDialog,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private uePredioService: UepredioService,
    private service: AgrupacionInteresadosService
  ) { }

  ngOnInit(): void {
    this.manageRouteData();

    //'navigationTree' in history.state ? this.manageRouteData() : this.findAll(this.getOptions());
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

  quitarMiembro(miembro: any, agrupacion: any) {

    let message = `Vas a eliminar el miembro ${miembro.primerNombre} ${ miembro.primerApellido} ${miembro.segundoApellido} y documento de identidad ${miembro.documentoIdentidad}, de la  agrupación ${agrupacion.nombre} ?`;
    let confirmBtnText = "Sí";
    let closeBtnText = "Cancelar";

    const data = { 'message': message, 'confirmBtnText': confirmBtnText, 'closeBtnText': closeBtnText };

    const config = {
      width: '400px',
      disableClose: false,
      data: data
    };

    const dialogRef = this.dialog.open(CustomConfirmDialogComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.data == true) {        
        this.removeMiembroFromAgrupacion(miembro.id, agrupacion.id);
      }
    });
   
  }

  addMiembro(miembro: any, agrupacion: any) {
    this.addMiembroToAgrupacion(miembro.id, agrupacion.id);
  }

  backTo() {
    alert("TODO");
  }

  manageRouteData() {
    'agrupacionId' in this.activatedRoute.snapshot.params ? this.getAgrupacionByAgrupacionId(this.activatedRoute.snapshot.params['agrupacionId']) : '';

    'agrupacionId' in this.activatedRoute.snapshot.params ? this.findInteresadosByAgrupacionId(this.activatedRoute.snapshot.params['agrupacionId']) : '';
    this.findAll();

    /*
    this.navigationTree = history.state.navigationTree;
    this.findInteresadosByPredioId(this.navigationTree.predio.id);
    */
  }

  goToAgrupacion(interesado?: any) {
    if (interesado) {
      this.navigationTree.interesado = interesado;
    }
    this.route.navigate([`dashboard/agrupacionInteresados`], { state: { navigationTree: this.navigationTree } });
  }

  goToSelectAgrupacion() {
    this.navigationTree.comeFrom = "pendiente";
    this.route.navigate([`dashboard/agrupacionInteresados`], { state: { navigationTree: this.navigationTree } });
  }

  goToPredios() {
    this.route.navigate([`dashboard/predios`], { state: { navigationTree: this.navigationTree } });
  }

  getAgrupacionByAgrupacionId(agrupacionId: number) {
    let agrupacion = { id: agrupacionId };
    const subscription = this.service.filter(this.getOptions(), agrupacion).pipe(
      map((page) => {
        this.totalElements = page.totalElements;
        return page.content.map(agrupacionInteresadosDto => {
          const agrupacion: AgrupacionInteresados = {
            ...agrupacionInteresadosDto
          };
          return agrupacion;
        });
      }),
    ).subscribe(
      (agrupacionInteresados: AgrupacionInteresados[]) => {
        this.agrupacion = agrupacionInteresados[0];
      },
      () => alert('No hay datos con estos filtros')
    );
    this.subscriptions.push(subscription);
  }


  findInteresadosByAgrupacionId(agrupacionId: number) {

    const subscription = this.service.findInteresadosByAgrupacionId(this.getOptions(), agrupacionId).pipe(
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
        this.miembros = interesados;
      },
      () => {
        this.miembros = [];
        alert('La agrupación no tiene miembros.');
      }
    );
    this.subscriptions.push(subscription);
  }



  private getOptions(): OptionsPage {
    const options = new OptionsPage();
    options.createOptionsSearch(this.paginator, this.sort);
    return options;
  }


  private findAll(options?: OptionsPage) {

    const subscription = this.interesadoService.findAll(options).pipe(
      map((page) => {
        this.totalElements = page.totalElements;
        return page.content.map(interesadoDto => {
          const interesado: Interesado = {
            ...interesadoDto
          };
          return interesado;
        });
      }),

    ).subscribe(
      (interesados: Interesado[]) => {
        this.dataSource.data = interesados;
      },
      () => alert('Error al cargar los predios')
    );
    this.subscriptions.push(subscription);
  }


  removeMiembroFromAgrupacion(interesadoId: number, agrupacionId: number) {

    const observable$ = this.service.removeMiembroFromAgrupacion(interesadoId, agrupacionId);
    this.subscriptions.push(
      observable$.subscribe(
        () => {
          this.findInteresadosByAgrupacionId(agrupacionId);
        },
        () => { this.findInteresadosByAgrupacionId(agrupacionId); }
      )
    );
  }

  addMiembroToAgrupacion(interesadoId: number, agrupacionId: number) {

    let miembroAgrupacion: MiembroAgrupacion = { 'interesadoId': interesadoId, 'agrupacionInteresadoId': agrupacionId };
    const observable$ = this.service.createMiembroAgrupacion(miembroAgrupacion);
    this.subscriptions.push(
      observable$.subscribe(
        (interesado) => {
          this.findInteresadosByAgrupacionId(agrupacionId);
        },
        () => alert('Error al guardar')
      )
    );
  }



  public filtrarInteresados(agrupacion: InteresadoFiltrado) {

    const subscription = this.interesadoService.filter(this.getOptions(), agrupacion).pipe(
      map((page) => {
        this.totalElements = page.totalElements;
        return page.content.map(interesadoDto => {
          const interesado: Interesado = {
            ...interesadoDto
          };
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


  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

}


import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface Nodo {
  name: string;
  url: string
  active: string;
  children?: Nodo[];
}

const TREE_DATA: Nodo[] = [
  {
    name: 'Unidades Espaciales',
    url: '',
    active: 'active',
    children: [

      { name: 'Terrenos', url: 'all/terreno', active: 'active' },
      { name: 'Construcciones', url: 'all/construccion', active: 'active' },
      { name: 'Unidades construccion', url: 'all/unidadesConstruccion', active: 'active' },
      { name: 'Servidumbre', url: 'all/servidumbre', active: 'disabled' },
      { name: 'Carga de Unidades Espaciales', url: 'cargaunidadesespaciales', active: 'active' },
     
    ],
  },
  {
    name: 'Interesados',
    url: '',
    active: 'active',
    children: [
      { name: 'Interesados', url: 'interesado', active: 'active' },
      { name: 'Carga de Interesados', url: 'carga-interesado', active: 'active' },
      { name: 'Agrupación Interesado', url: 'agrupacion-interesado', active: 'active' }],
  },
  {
    name: 'Unidades Administrativas',
    url: '',
    active: 'active',
    children: [
      { name: 'Predios', url: 'all/predio', active: 'active' },
      { name: 'Carga de Unidades Administrativas', url: 'cargaunidadesadministrativas', active: 'active' },
    ],
  },
  {
    name: 'RRR',
    url: '',
    active: 'active',
    children: [
      { name: "Derechos", url: 'derecho', active: 'active' },
      { name: "Restricciones", url: 'restriccion', active: 'disabled' },
      { name: "Responsabilidades", url: 'responsabilidad', active: 'disabled' }]
  },
  {
    name: 'Fuentes',
    url: '',
    active: 'active',
    children: [
      { name: 'Fuentes Admninistrativas', url: 'fuentesAdmninistrativa', active: 'disabled' },
      { name: 'Fuentes Espaciales', url: 'fuentesEspacial', active: 'disabled' }]
  }
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent {

  treeControl = new NestedTreeControl<Nodo>(node => node.children);
  dataSource = new MatTreeNestedDataSource<Nodo>();

  ruta!: string;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private router: Router) {

    this.dataSource.data = TREE_DATA;

    router.events.subscribe((val) => {
      let chips = this.router.url.split("/");
      this.ruta = chips[chips.length - 1];      

      this.ruta == 'agrupacion-interesados' || this.ruta == 'agrupaciones' || this.ruta == 'agrupacion' ? this.ruta = 'Agrupación interesados' : "";
      this.ruta == 'selecciona-agrupacion' ? this.ruta = 'Selecciona agrupación' : '';
      this.ruta == 'unidad-construccion' ? this.ruta = 'Unidades de construcción' : '';
      this.ruta == 'cargaunidadesespaciales' ? this.ruta = 'Carga de unidades espaciales' : '';
      this.ruta = this.ruta.replace('cion', 'ción');
      this.ruta = this.ruta.replace('-', ' ');
      this.ruta = this.ruta.replace('ciónes', 'ciones');
    });
  }

  ngOnInit(): void {    
  }

  logout() {
    this.router.navigateByUrl("/login");
  }

  hasChild = (_: number, node: Nodo) => !!node.children && node.children.length > 0;

}


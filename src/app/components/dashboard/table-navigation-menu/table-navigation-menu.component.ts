import { Component, OnInit, Output , EventEmitter, Input} from '@angular/core';
import { Router } from '@angular/router';
import { NavigationTree } from 'src/app/core/model/navigation-tree';


@Component({
  selector: 'app-table-navigation-menu',
  templateUrl: './table-navigation-menu.component.html',
  styleUrls: ['./table-navigation-menu.component.scss']
})
export class TableNavigationMenuComponent implements OnInit {

  //Pequeño desplegable en la navegación de la tabla.
  //Este componente de momento no se usa, pero en el futuro se usará, junto con un servicio para detectar 
  //si el componente en el que se utiloza, tiene ramificaciones, como terrenos, predios,etc...
  

  @Output() _goto: EventEmitter<any> = new EventEmitter();
  @Input() element: any;
  @Input() actual: any;
  @Input() toolTip!: string;
  @Input() next!: string;
  @Input() tree!: object;
  @Input() navigationTree!: NavigationTree;

  rutas=[{nombre:'terrenos'}, {nombre:'interesados'}, {nombre:'predios'}];
  public _ruta!: string;

  constructor(public route: Router) { }

  ngOnInit(){
   
   
  } 

  goTo(ruta: string){   
    this.navigationTree;    
    /*  
    ruta = ruta.slice(0, -1);             
    this.route.navigate([`dashboard/${this.next}s`],{state: { from: this.actual, element:this.element}});*/
  }
 

}

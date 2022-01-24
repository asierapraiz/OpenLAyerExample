import { Component, OnInit, Input, ComponentFactoryResolver } from '@angular/core';
import { MapService } from 'src/app/core/service/map/map.service';
import { ActivatedRoute, Router } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-capas',
  templateUrl: './capas.component.html',
  styleUrls: ['./capas.component.scss']
})
export class CapasComponent implements OnInit {

  @Input() capas: string[] = [];
  selectedOptions: string[] = [];
  base!: string;
  path!: string;


  constructor(
    private activatedRoute: ActivatedRoute,
    private mapService: MapService) {

  }

  ngOnInit(): void {
    this.selectedOptions = [...this.capas];
    this.path = this.activatedRoute.snapshot.data.title;
    console.log("pat=>", this.path);
  }



  acapasSeleccionadas(lista: any) {

    var listaFiltrada: string[]=[];
    
    lista.selectedOptions.selected.forEach((element: any) => {
      if(element.value==this.path){
        listaFiltrada.push('capaBase');
      }else{
        listaFiltrada.push(element.value);
      }      
    });  

    console.log("Lista=>", listaFiltrada);
    
    this.mapService.showLAyers(listaFiltrada);
  }

}

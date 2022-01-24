import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navegacion-dialog',
  templateUrl: './navegacion-dialog.component.html',
  styleUrls: ['./navegacion-dialog.component.scss']
})
export class NavegacionDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NavegacionDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public route: Router) { }

    rutas=[{nombre:'terreno'},{nombre:'interesado'} ];

    title="ID del predio:"+this.data.id;

  ngOnInit(): void {
  }

  goTo(ruta: any){         
    this.route.navigate([`dashboard/${ruta.nombre}s`],{state: { from: 'predios', predioId:this.data.id}});
  }

}

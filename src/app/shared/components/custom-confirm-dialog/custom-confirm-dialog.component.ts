import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-custom-confirm-dialog',
  templateUrl: './custom-confirm-dialog.component.html',
  styleUrls: ['./custom-confirm-dialog.component.scss']
})
export class CustomConfirmDialogComponent implements OnInit {


  
  fromDialog!: string;
  message: string;
  confirmBtnText!: string;
  closeBtnText!: string;

  constructor(
    public dialogRef: MatDialogRef<CustomConfirmDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.message = data.message; 
    this.confirmBtnText= data.confirmBtnText;
    this.closeBtnText= data.closeBtnText;    
  }

  ngOnInit(): void {
  }


  closeDialog(data: boolean) {
    this.dialogRef.close({ event: 'close', data: data });
  }

}

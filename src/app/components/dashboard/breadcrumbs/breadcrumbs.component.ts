import { Component, OnInit, Input } from '@angular/core';
import { Breadcrumb } from './../../../core/model/breadcrub';
import { BreadcrumbService } from './../../../core/service/breadcrumb.service';
import { ActivatedRoute, Router, NavigationEnd, PRIMARY_OUTLET, RoutesRecognized } from '@angular/router';
import { filter } from 'rxjs/operators';
import { map, mergeMap } from 'rxjs/internal/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {



  breadcrumb: Breadcrumb[] = [];
  @Input() bgColor = '#eee';
  @Input() fontSize = '18px';
  @Input() fontColor = '#0275d8';
  @Input() lastLinkColor = '#000';
  @Input() symbol = ' / ';
  params!: { [key: string]: any; };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private breadcrumbService: BreadcrumbService
  ) {
    this.breadCrumbData();
  }

  ngOnInit() {
    this.breadcrumbService.breadcrumbLabels.subscribe((labelData) => {
      for (const label in labelData) {
        if (labelData.hasOwnProperty(label)) {
          this.breadcrumb.map((crumb) => {
            const labelParams = crumb.label.match(/[^{{]+(?=\}})/g);
            if (labelParams) {
              for (const labelParam of labelParams) {
                const dynamicData = labelData[label];
                if (labelParam === label) {
                  crumb.label = crumb.label.replace('{{' + labelParam + '}}', dynamicData);
                }
              }
            }
          });
        }
      }
    });

    this.breadcrumbService.newBreadcrumb.subscribe((breadcrumb: Breadcrumb[]) => {
      this.updateData(this.activatedRoute, breadcrumb);
    });
  }

  breadCrumbData(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .pipe(map(() => this.activatedRoute))
      .pipe(map((route) => {
        while (route.firstChild) { route = route.firstChild; }
        return route;
      }))
      .pipe(filter(route => route.outlet === PRIMARY_OUTLET))
      .subscribe(route => {
        this.params = route.snapshot.params;
        this.updateData(route, null);
      });
  }

  private updateData(route: any, newBreadcrumb: any): void {    
    if (route.snapshot.data.breadcrumb || newBreadcrumb) {        
      const data = route.snapshot.data.breadcrumb ? route.snapshot.data.breadcrumb : newBreadcrumb;
      const breadcrumb = (JSON.parse(JSON.stringify(data)));
      breadcrumb.map((crumb: any) => {

        const urlChunks = crumb.url.split('/');
        for (const chunk of urlChunks) {
          if (chunk.includes(':')) {
            const paramID = chunk.replace(':', '');
            const routerParamID = this.params[paramID];
            crumb.url = crumb.url.replace(`:${paramID}`, routerParamID);
          }
        }

        const labelParams = crumb.label.match(/[^{{]+(?=\}})/g);
        if (labelParams) {
          for (const labelParam of labelParams) {
            const routerParamID = this.params[labelParam.trim()];
            if (routerParamID) {
              crumb.label = crumb.label.replace('{{' + labelParam + '}}', routerParamID);
            } else {
            }
          }
        }

      });
      this.breadcrumb = breadcrumb;
    } else {
      this.breadcrumb = [];
    }
  }



}


import {
  Component,
  ViewChild,
  ViewContainerRef,
  TemplateRef,
  Input,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-super-tooltip',
  templateUrl: './super-tooltip.component.html',
  styleUrls: ['./super-tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuperTooltipComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  @Input('tooltipContent')
  tooltipContent: TemplateRef<any>;

  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
      this.container.createEmbeddedView(this.tooltipContent);
      this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
      this.container.clear();
  }
}

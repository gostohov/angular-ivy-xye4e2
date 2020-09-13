import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperTooltipDirective } from './directives/super-tooltip.directive';
import { SuperTooltipComponent } from './components/super-tooltip/super-tooltip.component';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [
    SuperTooltipDirective,
    SuperTooltipComponent
  ],
  imports: [
    CommonModule,

    // Angular
    OverlayModule
  ],
  exports: [
    SuperTooltipDirective
  ],
  entryComponents: [
    SuperTooltipComponent
  ]
})
export class SharedModule { }

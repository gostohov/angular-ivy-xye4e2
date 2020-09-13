import { Directive, OnInit, ElementRef, Input, TemplateRef, ComponentRef, Renderer2 } from '@angular/core';
import { OverlayRef, Overlay, OverlayPositionBuilder, ConnectedPosition } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { SuperTooltipComponent } from '../components/super-tooltip/super-tooltip.component';

@Directive({
    selector: '[superTooltip]'
})
export class SuperTooltipDirective implements OnInit {
    /**
     * Позиционирование tooltip портала
     */
    @Input('position')
    position: ConnectedPosition[] = [{
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top',
    }];

    /**
     * Содержимое tooltip портала
     */
    @Input('tooltipContent')
    tooltipContent: TemplateRef<any>;

    private overlayRef: OverlayRef;
    private tooltipRef: ComponentRef<SuperTooltipComponent>;
    private visible: boolean;

    constructor(
        private overlayPositionBuilder: OverlayPositionBuilder,
        private elementRef: ElementRef,
        private overlay: Overlay,
        private renderer: Renderer2
    ) {}

    ngOnInit() {
        const positionStrategy = this.overlayPositionBuilder
            // Создаем позицию, прикрепленную к elementRef
            .flexibleConnectedTo(this.elementRef)
            // Описываем как соединить overlay и elementRef
            .withPositions(this.position);

        // Присваиваем стратегию позиционирования
        this.overlayRef = this.overlay.create({ positionStrategy });

        // Регестрируем колбеки на DOM-события
        const el = this.elementRef.nativeElement;
        this.renderer.listen(el, 'mouseenter', () => this.show()),
        this.renderer.listen(el, 'mouseout', () => this.hide())
    }

    private show(): void {
        if (this.visible) {
            return;
        }
        // Создаем tooltip portal
        const tooltipPortal = new ComponentPortal(SuperTooltipComponent);
        // Прикрепляем tooltip portal к overlay
        this.tooltipRef = this.overlayRef.attach(tooltipPortal);
        // Передаем контент в инстанс tooltip компонента
        this.tooltipRef.instance.tooltipContent = this.tooltipContent;

        this.visible = true;
    }

    private hide(): void {
        if (!this.visible) {
            return;
        }

        this.tooltipRef.destroy();
        this.overlayRef.detach();
        this.visible = false;
    }
}

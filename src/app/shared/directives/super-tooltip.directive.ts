import { Directive, OnInit, ElementRef, Input, TemplateRef, HostListener, ComponentRef, ViewContainerRef, ComponentFactory, ComponentFactoryResolver, Renderer2 } from '@angular/core';
import { OverlayRef, Overlay, OverlayPositionBuilder, ConnectedPosition } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { SuperTooltipComponent } from '../components/super-tooltip/super-tooltip.component';

export type TooltipTrigger = 'click' | 'hover';
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
    /**
     * Триггер для рендера компонента
     */
    @Input('trigger')
    tooltipTrigger: TooltipTrigger;

    private overlayRef: OverlayRef;
    private tooltipRef: ComponentRef<SuperTooltipComponent>;
    private readonly triggerDisposables: Array<() => void> = [];
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
        this.registerTriggers();
    }

    private registerTriggers(): void {
        const el = this.elementRef.nativeElement;
        const trigger = this.tooltipTrigger;

        this.removeTriggerListeners();

        if (trigger === 'hover') {
            this.triggerDisposables.push(...[
                this.renderer.listen(el, 'mouseenter', () => this.show()),
                this.renderer.listen(el, 'mouseout', () => this.hide())
            ]);
        } else if (trigger === 'click') {
            this.triggerDisposables.push(
                this.renderer.listen(window, 'click', (e) => {
                    e.preventDefault();
                    const isClickInsideTooltipContent = this.clickInsideTooltipContent(e.target);
                    const isClickInsideHost = this.clickInsideHost(e.target);

                    if (this.visible && !isClickInsideTooltipContent && !isClickInsideHost) {
                        this.hide();
                        return;
                    } else if (!this.visible && isClickInsideHost) {
                        this.show();
                        return;
                    } else {
                        return;
                    }
                })
            );
        }
    }

    private removeTriggerListeners(): void {
        this.triggerDisposables.forEach(dispose => dispose());
        this.triggerDisposables.length = 0;
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

    private clickInsideHost(target: HTMLElement): boolean {
        return this.elementRef.nativeElement.contains(target);
    }

    private clickInsideTooltipContent(target: HTMLElement): boolean {
        return this.tooltipRef?.location.nativeElement.contains(target);
    }
}

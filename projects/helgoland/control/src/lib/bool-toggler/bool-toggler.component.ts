import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'n52-bool-toggler',
    templateUrl: './bool-toggler.component.html'
})
export class BoolTogglerComponent {

    @Input()
    public value: boolean;

    @Input()
    public icon: string;

    @Input()
    public tooltip: string;

    @Output()
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    public onToggled: EventEmitter<boolean> = new EventEmitter();

    public toggle() {
        this.onToggled.emit(!this.value);
    }
}

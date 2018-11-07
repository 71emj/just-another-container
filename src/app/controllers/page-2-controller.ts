import { CLICK } from '../constants/events';
import { NavigationService } from '../navigation/navigation-service';
import { ViewChild, Component, Bind, Autowired, NoViewChildException, DomController, DomBindable } from '../decorators';
import { BEAN, AUTOWIRED } from '../decorators/metadata-symbols';

@DomController({ 
    name: 'page2Controller', 
    url: '/page2.html' 
})
export class Page2Controller implements DomBindable {

    @ViewChild('previous') protected _previousButton: HTMLElement;
    @ViewChild('next') protected _nextButton: HTMLElement;
    @Autowired private _navigator: NavigationService;

    constructor(
        private nav: NavigationService
    ) {}

    public bindControllers(): void {
        this._previousButton.addEventListener(CLICK, this._navigate);
        this._nextButton.addEventListener(CLICK, this._navigate);
        console.log(Reflect.getMetadata(BEAN, this));
        console.log(Reflect.getMetadata(AUTOWIRED, this, '_navigator'));
    }

    @Bind
    private _navigate(evt: Event): void {
        evt.preventDefault();
        const element = <HTMLAnchorElement> evt.target;
        const href = element.href;
        this._navigator.navigate(href, { id: element.id });
    }

}
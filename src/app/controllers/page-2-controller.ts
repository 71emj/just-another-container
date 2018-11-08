import { CLICK } from '../constants/events';
import { NavigationService } from '../navigation/navigation-service';
import { ViewChild, Component, Bind, Autowired, NoViewChildException, DomController, DomBindable } from '../decorators';
import { BEAN, AUTOWIRED, DESIGNTYPE } from '../decorators/metadata-symbols';

@DomController({ 
    name: 'page2Controller', 
    url: '/page2.html' 
})
export class Page2Controller implements DomBindable {

    @ViewChild('previous', 'jquery') protected _previousButton: JQuery;
    @ViewChild('next') protected _nextButton: HTMLInputElement;
    @Autowired private navigation: NavigationService;

    constructor(
        private _navigator: NavigationService
    ) {}

    public bindControllers(): void {
        this._previousButton.on(CLICK, this._navigate);
        this._nextButton.addEventListener(CLICK, this._navigate);
        console.log(Reflect.getMetadata(DESIGNTYPE, this, '_previousButton'));
        console.log(Reflect.getMetadata(DESIGNTYPE, this, '_nextButton'));
        console.log(Reflect.getMetadata(BEAN, this));
        console.log(Reflect.getMetadataKeys(this));
    }

    @Bind
    private _navigate(evt: Event): void {
        evt.preventDefault();
        const element = <HTMLAnchorElement> evt.target;
        const href = element.href;
        this._navigator.navigate(href, { id: element.id });
    }

}
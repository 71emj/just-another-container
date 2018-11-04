import { CLICK } from '../constants/events';
import { NavigationService } from '../navigation/navigation-service';
import { ViewChild, Component, Bind, Autowired, NoViewChildException, DomController, DomBindable } from '../decorators';

@DomController({ 
    name: 'page2Controller', 
    url: '/page2.html' 
})
export class Page2Controller implements DomBindable {

    @ViewChild('previous') protected _previousButton: HTMLElement;
    @ViewChild('next') protected _nextButton: HTMLElement;
    @Autowired('navigation') private _navigator: NavigationService;

    public bindControllers(): void {
        this._previousButton.addEventListener(CLICK, this._navigate);
        this._nextButton.addEventListener(CLICK, this._navigate);
    }

    @Bind
    private _navigate(evt: Event): void {
        evt.preventDefault();
        const element = <HTMLAnchorElement> evt.target;
        const href = element.href;
        this._navigator.navigate(href, { id: element.id });
    }

}
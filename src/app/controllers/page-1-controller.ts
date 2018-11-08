import { DomController, DomBindable, ViewChild, Autowired, Bind } from "../decorators";
import { NavigationService } from "../navigation/navigation-service";
import { CLICK } from "../constants/events";

@DomController({ 
    name: 'indexController', 
    url: '/index.html' 
})
export class Page1Controller implements DomBindable {

    @ViewChild('submit') protected _submit: HTMLElement;
    @ViewChild('form') protected _form: HTMLFormElement;
    @Autowired private _navigator: NavigationService;

    public bindControllers(): void {
        this._submit.addEventListener(CLICK, this._submitAndNavigate);
    }

    @Bind
    private _submitAndNavigate(evt: Event): void {
        evt.preventDefault();
        const element = <HTMLAnchorElement> evt.target;
        const href = element.href;
        const serializedForm = $(this._form).serialize();
        console.log(serializedForm);
        this._navigator.navigate(href, { form: serializedForm });
    }

}
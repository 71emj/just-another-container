import { DESIGNTYPE } from "./metadata-symbols";

export interface ViewSelectorOptions {
    // alias for selector
    name?: string;
    selector?: string;
    type?: ViewElementRef;
}

export type ViewElementRef = 'jquery' | 'html';

export class NoViewChildException extends ReferenceError {
    constructor(message: string) {
        super(message);
    }
    get name() {
        return 'NoViewChildException';
    }
}

// View child binding error should always be resolved
export function ViewChild(selector: string, type: ViewElementRef = 'html'): PropertyDecorator {
    let viewComponent = viewSelector(selector);
    return <T extends HTMLElement, K extends JQuery<HTMLElement>>(target: object, propertyKey: string | symbol) => {
        /* const metadataType = Reflect.getMetadata(DESIGNTYPE, target, propertyKey);
        if (!is(metadataType, HTMLElement) || !is(metadataType, $())) {
            console.warn("WRONG TYPE");
        } */
        Reflect.defineMetadata(DESIGNTYPE, HTMLElement, target);
        Reflect.defineProperty(target, propertyKey, {
            get() {
                viewComponent = viewComponent || viewSelector(selector);
                if (!viewComponent) {
                    throw new NoViewChildException(`Element with id: [${selector}] is not visible in current view.`);
                }
                const value = 'html' !== type ? $(viewComponent) : viewComponent;
                Object.defineProperty(this, propertyKey, { value });
                return value;
            }
        });
    }
}

function viewSelector(selector: string): HTMLElement | null {
    const viewComponent = document.getElementById(selector);
    return viewComponent;
}


type Comparable = number | string | Function | Object | object;

function is(a: number, b: number): boolean;
function is(a: string, b: string): boolean;
function is(a: Function, b: Function): boolean;
function is(a: Object, b: Object): boolean;
function is(a: object, b: object): boolean;
function is(a: Comparable, b: Comparable): boolean {
    if (a === b) {
        return true;
    }
    if (Object.is(a, b)) {
        return true;
    }
    const nameofa = (a as Function).name || (a as Function).prototype.name;
    const nameofb = (b as Function).name || (b as Function).prototype.name;
    if (nameofa.includes(nameofb)
            || nameofb.includes(nameofa)) {
        return true;
    }
    return false;
}
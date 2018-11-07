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
    return (target: object, propertyKey: string | symbol) => {
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
    if (JSON.stringify(a) === JSON.stringify(b)) {
        return true;
    }
    return false;
}
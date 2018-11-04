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
                    throw new NoViewChildException(`Element with id: "${selector}" is not visible in current view.`);
                }
                Object.defineProperty(this, propertyKey, {
                    value: viewComponent,
                });
                return 'html' !== type ? $(viewComponent) : viewComponent;
            }
        });
    }
}

function viewSelector(selector: string): HTMLElement | null {
    const viewComponent = document.getElementById(selector);
    return viewComponent;
}
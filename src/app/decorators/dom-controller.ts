import { BeanContainer } from "./bean-container";

const Container = BeanContainer.getInstance();
const BIND_CONTROLLERS = 'bindControllers';
export interface ControllerOption {
    name: string;
    url: string;
}
export interface DomBindable {
    bindControllers(): void;
}

export class DOMControllerInitiationException extends ReferenceError {
    constructor(message: string) {
        super(message);
    }
    get name() {
        return 'DOMControllerInitiationException';
    }
}

export function DomController(options: ControllerOption): ClassDecorator {
    const urlLocation = window.location.pathname;
    return <T extends Function>(target: T) => {
        const descriptor = Reflect.getOwnPropertyDescriptor(target.prototype, BIND_CONTROLLERS);
        if (!descriptor || 'function' !== typeof(descriptor.value)) {
            throw new DOMControllerInitiationException(''
                + `Error initiating class: "${target.name}". `
                + `Class decorated with @DomController requires method: "${BIND_CONTROLLERS}" to be visible in class entry, `
                + `it is highly recommended to implement "DomBindable" interface for controller class.`
            );
        }
        const instance = Reflect.construct(target, []);
        if (urlLocation === options.url) {
            Container.registerActiveControllers(() => {
                instance.bindControllers()
                Reflect.defineProperty(target.prototype, BIND_CONTROLLERS, {
                    configurable: false,
                    value: () => console.warn(''
                        + `Controller binding has already been activated in current url location: "${urlLocation}". `
                        + `Modified @DomController mapping if this is a mistake.`
                    )
                });
            });
        } else {
            Reflect.defineProperty(target.prototype, BIND_CONTROLLERS, {
                configurable: false,
                value: () => console.warn(''
                    + `Controller is disabled in current url location: "${urlLocation}". `
                    + `Modified @DomController mapping if this is a mistake.`
                )
            });
        }
        Container.registerBean(options.name, instance);
        return target;
    }
}

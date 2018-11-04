import { BeanContainer } from "./bean-container";

export interface ApplicationOption {
    declarations: Array<Function>;
}
const MAIN = 'main';

export function Module(options: ApplicationOption): ClassDecorator {
    return <T extends Function>(target: T) => {
        const descriptor = Reflect.getOwnPropertyDescriptor(target, MAIN);
        if (!descriptor || 'function' !== typeof(descriptor.value)) {
            console.warn(''
                + `Static method "main" was not found on ${target.name}.class. `
                + `Classes decorated with @Module are recommended to main to class entry to avoid accidental override.`
            );
            Reflect.defineProperty(target, MAIN, {
                configurable: false,
                writable: false,
                value: () => console.debug(`Default static method main defined at ${target.name}.class`)
            });
        }
        const main = Reflect.get(target, MAIN);
        documentReady().then(() => {
            main();
            options.declarations.map(createBean);
            initiateActiveControllers();
        });
        return target;
    }
}

function createBean<T extends Function>(bean: T): T {
    console.debug(`Creating bean: ${bean.name}`);
    let beanInstance;
    try {
        beanInstance = Reflect.construct(bean, []);
    } catch (err) {
        console.error(err);
    }
    console.debug(`${bean.name} created.`);
    return beanInstance;
}

function initiateActiveControllers() {
    const activeControllers = BeanContainer.getInstance().getActiveControllers();
    if (activeControllers) {
        activeControllers.forEach(bindingFunction => bindingFunction());
    }
}

function documentReady() {
    let intervalId = -1;
    return new Promise((resolve) => {
        intervalId = window.setInterval(() => {
            if ('complete' === document.readyState) {
                console.debug('Document ready');
                window.clearInterval(intervalId);
                resolve(true);
            }
        }, 500);
    });
}
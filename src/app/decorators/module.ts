import { BeanContainer, Bean } from "./bean-container";
import { BEAN, AUTOWIRED } from "./metadata-symbols";

export interface ApplicationOption {
    declarations: Array<Function>;
}
const MAIN = 'main';
const Container = BeanContainer.getInstance();

export function Module(options: ApplicationOption): ClassDecorator {
    return <T extends Function>(target: T) => {
        const descriptor = Reflect.getOwnPropertyDescriptor(target, MAIN);
        if (!descriptor || 'function' !== typeof(descriptor.value)) {
            console.warn(''
                + `Static method "main" was not found in [${target.name}.class]. `
                + `Classes decorated with @Module are recommended to define a staic main method `
                + `in class entry to avoid accidental override.`
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
        });
        return target;
    }
}

function createBean<T extends Function>(bean: T): Bean | undefined {
    console.debug(`Creating bean: [${bean.name}]`);
    console.log(bean);
    let beanMetadata;
    try {
        beanMetadata = <Bean> Reflect.getMetadata(BEAN, bean);
        console.log(Reflect.getMetadataKeys(bean));
        if (!Container.has(bean)) {
            console.warn("REGISTER BEAN");
            Container.registerBean(bean, Container.createBean(bean));
        }
    } catch (err) {
        console.error(err);
        console.error(`Error creating bean [${bean.name}]`);
    }
    console.debug(`${bean.name} created.`);
    return beanMetadata || undefined;
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
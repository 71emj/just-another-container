import { BeanContainer, Bean } from "./bean-container";
import { BEAN, SCOPE } from "./metadata-symbols";
import { DomBindable } from "./dom-controller";
import { ClassMetadata } from "./service-injector";

export interface RouterConfig {
    url: string;
    controller: object;
}

export interface ApplicationOption {
    declarations: Array<Function>;
    services: Array<Function>;
    routers: Array<RouterConfig>;
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
            options.services.sort(sortPriority).map(createBean);
            options.declarations.sort(sortPriority).map(createBean);
            options.routers.map(config => {
                if (window.location.pathname.includes(config.url)) {
                    const controller = Container.getRegisteredBean(config.controller);
                    (controller as DomBindable).bindControllers();
                    console.log(Container);
                }
            });
        });
        return target;
    }
}

function sortPriority<T extends Function>(beanA: T, beanB: T): number {
    const beanAMetadata = <ClassMetadata> Reflect.getMetadata(BEAN, beanA);
    const beanBMetadata = <ClassMetadata> Reflect.getMetadata(BEAN, beanB);
    if ('priority' in beanAMetadata
            && 'priority' in beanBMetadata) {
        return beanAMetadata.priority - beanBMetadata.priority;
    }
    console.error('Priority doesn\'t exist');
    return 0;
}

function createBean<T extends Function>(bean: T): Bean | undefined {
    console.debug(`Creating bean: [${bean.name}]`);
    try {
        if (!Container.has(bean)) {
            Container.registerBean(bean, Container.createBean(bean));
        }
    } catch (err) {
        console.error(err);
        console.error(`Error creating bean [${bean.name}]`);
    }
    console.debug(`${bean.name} created.`);
    return bean;
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
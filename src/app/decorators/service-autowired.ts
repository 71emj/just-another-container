import { BeanContainer } from "./bean-container";

const Container = BeanContainer.getInstance();
export class NoBeanDefinitionException extends ReferenceError {
    constructor(message: string) {
        super(message);
    }
    get name() {
        return 'NoBeanDefinitionException';
    }
}

export function Autowired(name: string): PropertyDecorator;
export function Autowired(target: object, propertyKey: string | symbol): void;
export function Autowired(targetOrName: string | object, propertyKey?: string | symbol): PropertyDecorator | void {
    if ('string' === typeof(targetOrName)) {
        return wiredByExplicitName(targetOrName);
    } else if (targetOrName && propertyKey) {
        console.warn(''
            + `Using @Autowired without explicitly passing the target bean name might cause runtime error `
            + `in production mode, dued to project minify/uglify.`
        );
        return wiredByPropertyName(targetOrName, propertyKey);
    }
}

function wiredByPropertyName(target: object, propertyKey: string | symbol): void {
    Reflect.defineProperty(target, propertyKey, {
        get(this) {
            const name = propertyKey.toString();
            const service = Container.getRegisteredBean(name);
            if (!service) {
                throw new NoBeanDefinitionException(''
                    + `There's no Bean with name: [${name}] registered in BeanContainer.`
                );
            }
            Object.defineProperty(this, propertyKey, {
                value: service,
                writable: false,
                configurable: false
            });
            return service;
        }
    });
}

function wiredByExplicitName(name: string): PropertyDecorator {
    return (target: object, propertyKey: string | symbol) => {
        Reflect.defineProperty(target, propertyKey, {
            get(this) {
                const service = Container.getRegisteredBean(name);
                if (!service) {
                    throw new NoBeanDefinitionException(''
                        + `There's no Bean with name: [${name}] registered in BeanContainer.`
                    );
                }
                Object.defineProperty(this, propertyKey, {
                    value: service,
                    writable: false,
                    configurable: false
                });
                return service;
            }
        });
    }
}

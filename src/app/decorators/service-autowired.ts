import { BeanContainer } from "./bean-container";
import { AUTOWIRED, BEAN, PARAMTYPES, CLASSTYPE, DESIGNTYPE } from "./metadata-symbols";
import { NavigationService } from "../navigation/navigation-service";
import { prototype } from "webpack-dev-server";

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
    const type = Reflect.getOwnMetadata(DESIGNTYPE, target, propertyKey);
    Reflect.defineMetadata(AUTOWIRED, {
        name: propertyKey,
        class: target,
        type
    }, target, propertyKey);
    Reflect.defineProperty(target, propertyKey, {
        get(this) {
            const service = Container.getRegisteredBean(type);
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

function wiredByExplicitName(name?: string): PropertyDecorator {
    return (target: object, propertyKey: string | symbol) => {
        const type = Reflect.getOwnMetadata(DESIGNTYPE, target, propertyKey);
        Reflect.defineProperty(target, propertyKey, {
            get(this) {
                const service = Container.getRegisteredBean(type);
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

// function logMetaData(target: object, propertyKey: string) {
//     console.log("CREATING...", target);
//     console.log("CONSTRUCTOR...", target.constructor);
//     console.log("PROPERTY...", propertyKey);
//     console.log(Reflect.getOwnMetadata(DESIGNTYPE, target, propertyKey));
//     const dependencies = Reflect.getMetadata(DESIGNTYPE, target, propertyKey);
//     if (dependencies) {
//         /* dependencies.forEach((elem: Function) => {
//             console.log(elem.name);
//             console.log(Reflect.getMetadata(BEAN, elem));
//             const instance = Reflect.construct(elem, []);
//             console.log(instance);
//         }); */
//         console.log(Reflect.getMetadataKeys(dependencies));
//     }
//     console.log(Reflect.getMetadataKeys(target, propertyKey));
//     console.log(Reflect.getOwnMetadataKeys(target, propertyKey));
//     console.log(`${target}.${propertyKey}: ${dependencies}, Metadat.[${PARAMTYPES}]`);
// }

import 'reflect-metadata';
import { BeanContainer, Bean } from "./bean-container";
import { BEAN, PARAMTYPES, CLASSTYPE } from './metadata-symbols';
import { Autowired } from './service-autowired';

const Container = BeanContainer.getInstance();

export function Service(name: string): ClassDecorator {
    return Component(name);
}

interface ClassMetadata {
    name: string,
    dependencies: Array<Bean>;
}

export function Component(name: string): ClassDecorator {
    return <T extends Function>(target: T) => {
        // const instance = Reflect.construct(target, []);
        const dependencies: Array<Bean> = Reflect.getMetadata(PARAMTYPES, target) || [];
        if (dependencies.length) {
            console.log(dependencies);
        }
        const beanMetadata: ClassMetadata = { name, dependencies };
        Reflect.defineMetadata(BEAN, beanMetadata, target);
        Reflect.defineMetadata(BEAN, beanMetadata, target.prototype);
        Reflect.defineMetadata(CLASSTYPE, target, target);
        // logMetaData(target);
        // Container.registerBean(name, instance);
        return target;
    }
}

// function logMetaData<T extends Function>(target: T) {
//     console.log("CREATING...", target.name);
//     console.log("CREATING...", target);
//     const param = 'design:paramtypes';
//     const dependencies = Reflect.getMetadata(param, target);
//     if (dependencies) {
//         dependencies.forEach((elem: Function) => {
//             console.log(elem.name);
//             console.log(Reflect.getMetadata(BEAN, elem));
//             const instance = Reflect.construct(elem, []);
//             console.log(instance);
//         });
//     }
//     console.log(Reflect.getMetadata(CLASSTYPE, target));
//     console.log(Reflect.getMetadataKeys(target));
//     console.log(Reflect.getOwnMetadataKeys(target));
//     console.log(`${target.name} class: ${dependencies}, Metadat.[${param}]`);
// }
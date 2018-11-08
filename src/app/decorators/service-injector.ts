import 'reflect-metadata';
import { Bean } from "./bean-container";
import { BEAN, PARAMTYPES, CLASSTYPE } from './metadata-symbols';
import { Scope } from './singleton';

export interface ClassMetadata {
    name: string,
    dependencies: Array<Bean>;
    priority: number;
}

interface ComponentOptions {
    name?: string,
    isInjectable?: boolean, 
    isSingleton?: boolean
}

export function Service(options?: ComponentOptions): ClassDecorator {
    return <T extends Function>(target: T) => {
        const dependencies: Array<Bean> = Reflect.getMetadata(PARAMTYPES, target) || [];
        const beanMetadata: ClassMetadata = { 
            priority: dependencies.length, 
            name: (options && options.name) || target.name,
            dependencies 
        };
        Reflect.decorate([
            Scope('singleton')
        ], target);
        Reflect.defineMetadata(BEAN, beanMetadata, target);
        Reflect.defineMetadata(BEAN, beanMetadata, target.prototype);
        return target;
    }
}

export function Component(options?: ComponentOptions): ClassDecorator {
    return <T extends Function>(target: T) => {
        const dependencies: Array<Bean> = Reflect.getMetadata(PARAMTYPES, target) || [];
        const beanMetadata: ClassMetadata = { 
            priority: dependencies.length, // this will flag container to create instance based on load weight
            name: 'options.name', 
            dependencies 
        };
        Reflect.decorate([
            Scope('session')
        ], target);
        Reflect.defineMetadata(BEAN, beanMetadata, target);
        Reflect.defineMetadata(BEAN, beanMetadata, target.prototype); 
        return target;
    }
}


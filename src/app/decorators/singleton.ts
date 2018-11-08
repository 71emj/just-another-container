import { SCOPE } from "./metadata-symbols";

export type ScopeOptions = 'singleton' | 'session';

export function Scope(option: ScopeOptions): ClassDecorator {
    return <T extends Function>(target: T) => {
        Reflect.defineMetadata(SCOPE, {
            scope: option,
            isSingleton: option === 'singleton'
        }, target);
        return target;
    }
}
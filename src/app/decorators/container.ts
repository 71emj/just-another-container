/* import { Bind } from "./bind";

export interface DependencyMetadata {
    classDefinition: Function;
    dependencies: Array<string>;
    singleton: boolean;
}

export class Container {

    private _services: Map<string, DependencyMetadata> = new Map();
    private _singletons: Map<string, Function> = new Map();

    register<T extends Function>(entry: string, classDefinition: T, dependencies: Array<string>): void {
        this._services.set(entry, { classDefinition, dependencies, singleton: false });
    }

    singleton<T extends Function>(entry: string, classDefinition: T, dependencies: Array<string>): void {
        this._services.set(entry, { classDefinition, dependencies, singleton: true });
    }

    @Bind
    get(entry: string) {
        const bean = this._services.get(entry);
        if ('undefined' !== typeof(bean) && 
                'function' === typeof(bean.classDefinition)) {

            if (bean.singleton) {
                const singletonInstance = this._singletons.get(name);
                if (singletonInstance) {
                    return singletonInstance;
                } else {
                    const newSingletonInstance = this._createInstance(bean);
                    this._singletons.set(name, newSingletonInstance);
                    return newSingletonInstance;
                }
            }

            return this._createInstance(bean)

        } else if ('undefined' !== typeof(bean)) {
            return bean.classDefinition
        }
    }

    private _getResolvedDependencies<T extends Function>(service: DependencyMetadata): Array<T> {
        const classDependencies: Array<T> = [];
        if (service.dependencies) {
            classDependencies = service.dependencies.map(this.get);
        }
        return classDependencies;
    }

    private _createInstance<T extends Function>(service: DependencyMetadata): T {
        return service.classDefinition(...this._getResolvedDependencies(service));
    }


} */
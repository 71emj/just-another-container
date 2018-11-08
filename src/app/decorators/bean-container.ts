import { DESIGNTYPE, PARAMTYPES, SCOPE } from "./metadata-symbols";

export type Bean = Function | object;

export class BeanContainer { // should have container holding metadatas

    private static containerInstance: BeanContainer;
    private _singletons: WeakMap<Bean, Bean>;
    private _components: WeakSet<Bean>;

    private constructor() {}

    get singletons() {
        if (!this._singletons) {
            this._singletons = new WeakMap();
        }
        return this._singletons;
    }

    get components() {
        if (!this._components) {
            this._components = new WeakSet();
        }
        return this._components;
    }

    static getInstance(): BeanContainer {
        if (!this.containerInstance) {
            this.containerInstance = new BeanContainer();
        }
        return this.containerInstance;
    }

    // should throw error if intantiation failed
    public getRegisteredBean(entry: Bean): Bean {
        if (!this.has(entry)) {
            return this.createBean(entry);
        } else {
            return this.singletons.get(entry)!;
        }
    }

    public registerBean(entry: Bean, bean: Bean): void {
        this.singletons.set(entry, bean);
    }

    public registerComponent(bean: Bean): void {
        this.components.add(bean);
    }

    // need to test edge cases on non constructable dependencies
    public createBean(entry: Bean): Bean {
        this.registerBean(entry, this._instantiateBean(entry));
        return this.getRegisteredBean(entry);
    }

    public createComponent(entry: Bean): Bean {
        const component = this._instantiateBean(entry);
        this.registerComponent(component);
        return component;
    }

    private _instantiateBean(entry: Bean): Bean {
        let metadatas: Array<Bean> = Reflect.getMetadata(PARAMTYPES, entry) || [];
        if (metadatas.length) {
            metadatas = metadatas.map(
                dependent => {
                    const scope = Reflect.getMetadata(SCOPE, dependent);
                    if (!scope['isSingleton'] || 'singleton' !== scope['scope']) {
                        return this.createComponent(dependent);
                    }
                    return this.getRegisteredBean(dependent);
                });
        }
        return Reflect.construct(<Function> entry, metadatas);
    }

    public has(entry: Bean): boolean {
        return this.singletons.has(entry);
    }

}

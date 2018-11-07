import { DESIGNTYPE, PARAMTYPES } from "./metadata-symbols";

export type Bean = Function | object;

export class BeanContainer { // should have container holding metadatas

    private static containerInstance: BeanContainer;
    private _components: WeakMap<Bean, Bean>;

    private constructor() {}

    get components() {
        if (!this._components) {
            this._components = new WeakMap();
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
            return this.components.get(entry)!;
        }
    }

    public registerBean(entry: Bean, bean: Bean): void {
        this.components.set(entry, bean);
    }

    // need to test edge cases on non constructable dependencies
    public createBean(entry: Bean): Bean {
        let metadatas: Array<Bean> = Reflect.getMetadata(PARAMTYPES, entry) || [];
        if (metadatas.length) {
            metadatas = metadatas.map(
                dependent => this.getRegisteredBean(dependent));
        }
        this.registerBean(entry, Reflect.construct(<Function> entry, metadatas));
        return this.getRegisteredBean(entry);
    }

    public has(entry: Bean): boolean {
        return this.components.has(entry);
    }

}

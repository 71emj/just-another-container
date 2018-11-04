type Bean = Function | object;

export class BeanContainer {

    private static containerInstance: BeanContainer;
    private _components: Map<string, Bean>;
    private _controllers: Set<Function>;

    private constructor() {}

    static getInstance(): BeanContainer {
        if (!this.containerInstance) {
            this.containerInstance = new BeanContainer();
        }
        return this.containerInstance;
    }

    public registerBean(entry: string, bean: Bean): void {
        if (!this._components) {
            this._components = new Map();
        }
        this._components.set(entry, bean);
    }

    public getRegisteredBean(entry: string): Bean | null {
        return this._components.get(entry) || null;
    }

    public registerActiveControllers(callback: Function): void {
        if (!this._controllers) {
            this._controllers = new Set();
        }
        this._controllers.add(callback);
    }

    public getActiveControllers() {
        return this._controllers;
    }

}

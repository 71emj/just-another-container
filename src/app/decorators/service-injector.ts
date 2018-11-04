import { BeanContainer } from "./bean-container";

const Container = BeanContainer.getInstance();

export function Service(name: string): ClassDecorator {
    return Component(name);
}

export function Component(name: string): ClassDecorator {
    return <T extends Function>(target: T) => {
        const instance = Reflect.construct(target, []);
        Container.registerBean(name, instance);
        return target;
    }
}


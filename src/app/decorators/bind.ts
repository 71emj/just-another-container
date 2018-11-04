
export class InvalidBindException extends TypeError {
    constructor(message: string) {
        super(message);
    }
    get name() {
        return 'InvalidBindException';
    }
}

export function Bind<T extends Function>(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void {
    if(!descriptor || 'function' !== typeof(descriptor.value)) {
        throw new InvalidBindException(''
            + `Only methods can be decorated with @Bind. [${propertyKey}] is not a method!`
        );
    }
    return {
        configurable: true,
        get(this) {
            const bound = descriptor.value!.bind(this);
            const boundDescriptor = Object.assign(descriptor, {
                value: bound,
                writable: false
            });
            Object.defineProperty(target, propertyKey, boundDescriptor);
            return bound;    
        }
    }
}

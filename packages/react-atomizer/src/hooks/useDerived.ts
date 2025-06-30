import {DependencyList, useRef} from "react";

function equals(x: unknown, y: unknown): boolean {
    if (typeof x === "number" && typeof y === "number") {
        return x === y || (x !== x && y !== y);
    }
    return x === y;
}

export function useDerived<T>(
    factory: () => T,
    dependencies: DependencyList,
    compareFn: (a: unknown, b: unknown) => boolean = equals
): T {
    const deps = useRef(dependencies)
    const valueRef = useRef<{ value: T | null }>({ value: null })

    valueRef.current.value ??= factory()

    if (deps.current.length !== dependencies.length || !deps.current.every((v, i) => compareFn(v, dependencies[i]))) {
        valueRef.current.value = factory()
    }

    deps.current = dependencies
    return valueRef.current.value
}
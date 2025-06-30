import {PrimitiveAtom, WritableAtom} from "jotai";
import {focusAtom} from "jotai-optics";
import {splitAtom} from "jotai/utils";

export type SplitAtomAction<T> = {
    type: 'remove'
    atom: PrimitiveAtom<T>
} | {
    type: 'insert'
    value: T
    before?: PrimitiveAtom<T>
} | {
    type: 'move'
    atom: PrimitiveAtom<T>
    before?: PrimitiveAtom<T>
}

export type WritableListAtom<E> = WritableAtom<PrimitiveAtom<E>[], [SplitAtomAction<E>], void>

export type Atomized<T> = {
    atom: PrimitiveAtom<T>
} & (T extends (infer E)[] ? {
    split<K>(keyExtractor: ((v: E) => K)): WritableListAtom<E>
} : T extends object ? { [K in Exclude<keyof T, "atom" | "split">]: Atomized<T[K]> } : {})

export function atomize<T>(valueAtom: PrimitiveAtom<T>): Atomized<T> {
    return new Proxy<Atomized<T>>({} as Atomized<T>, {
        get(target, key) {
            const typedTarget = target as Partial<Atomized<T>>
            const typedKey = key as keyof Atomized<T>

            if (typedKey === "atom") return valueAtom

            if (typedKey === "split") {
                const cachedAtoms = new Map<(v: unknown) => unknown, WritableListAtom<T[keyof T]>>()

                return (typedTarget["split" as keyof Atomized<T>] as (extractor: (v: unknown) => unknown) => WritableListAtom<T[keyof T]>) ??=
                    (extractor: (v: unknown) => unknown) => {
                        if (!cachedAtoms.has(extractor))
                            cachedAtoms.set(extractor, splitAtom(valueAtom as unknown as PrimitiveAtom<unknown[]>, extractor) as WritableListAtom<T[keyof T]>)
                        return cachedAtoms.get(extractor)!
                    }
            }

            return (typedTarget[typedKey] as Atomized<T[keyof T]>) ??=
                atomize(focusAtom(valueAtom, o => o.prop(typedKey as keyof T)) as PrimitiveAtom<T[keyof T]>)
        }
    })
}
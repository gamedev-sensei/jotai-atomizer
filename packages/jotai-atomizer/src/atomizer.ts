import {PrimitiveAtom} from "jotai";
import {focusAtom} from "jotai-optics";
import {splitAtom} from "jotai/utils";

type ListAtom<E, K> = ReturnType<typeof splitAtom<E, K>>

export type Atomized<T> = {
    atom: PrimitiveAtom<T>
} & (T extends (infer E)[] ? {
    split<K>(keyExtractor: ((v: E) => K)): ListAtom<E, K>
} : T extends object ? { [K in Exclude<keyof T, "atom" | "split">]: Atomized<T[K]> } : {})

export function atomize<T>(valueAtom: PrimitiveAtom<T>): Atomized<T> {
    return new Proxy<Atomized<T>>({} as Atomized<T>, {
        get(target, key) {
            const typedTarget = target as Partial<Atomized<T>>
            const typedKey = key as keyof Atomized<T>

            if (typedKey === "atom") return valueAtom

            if (typedKey === "split") {
                const cachedAtoms = new Map<(v: unknown) => unknown, ListAtom<T[keyof T], unknown>>()

                return (typedTarget["split" as keyof Atomized<T>] as (extractor: (v: unknown) => unknown) => ListAtom<T[keyof T], unknown>) ??=
                    (extractor: (v: unknown) => unknown) => {
                        if (!cachedAtoms.has(extractor))
                            cachedAtoms.set(extractor, splitAtom(valueAtom as unknown as PrimitiveAtom<unknown[]>, extractor) as ListAtom<T[keyof T], unknown>)
                        return cachedAtoms.get(extractor)!
                    }
            }

            return (typedTarget[typedKey] as Atomized<T[keyof T]>) ??=
                atomize(focusAtom(valueAtom, o => o.prop(typedKey as keyof T)) as PrimitiveAtom<T[keyof T]>)
        }
    })
}
import {atom, PrimitiveAtom} from "jotai";

export function optionalAtom<T>(sourceAtom: PrimitiveAtom<T | undefined>) {
    let atomCache: PrimitiveAtom<T> | undefined = undefined

    return atom<PrimitiveAtom<T> | undefined>(get => {
        const v = get(sourceAtom)

        if (v === undefined) return undefined

        atomCache ??= atom(get => get(sourceAtom) ?? v, (_get, set, update) => {
            set(sourceAtom, update instanceof Function ? newValue => update(newValue ?? v): update)
        })

        return atomCache
    })
}
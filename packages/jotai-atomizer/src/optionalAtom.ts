import {Atom, atom, PrimitiveAtom} from "jotai";
import {mappedAtom} from "@/mappedAtom";

export function optionalAtom<T>(sourceAtom: PrimitiveAtom<T | undefined>): Atom<PrimitiveAtom<T> | undefined> {
    let atomCache: PrimitiveAtom<T> | undefined = undefined

    return atom<PrimitiveAtom<T> | undefined>(get => {
        const v = get(sourceAtom)

        if (v === undefined) return undefined

        atomCache ??= mappedAtom<T | undefined, T>(sourceAtom, value => value ?? v, value => value)

        return atomCache
    })
}
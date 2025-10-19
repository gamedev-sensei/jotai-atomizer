import {atom, PrimitiveAtom, SetStateAction} from "jotai";

export function mappedAtom<T, R>(sourceAtom: PrimitiveAtom<T>, mapRead: (v: T) => R, mapWrite: (v: R) => T): PrimitiveAtom<R> {
    return atom<R, [SetStateAction<R>], void>(
        get => mapRead(get(sourceAtom)),
        (_get, set, update) => {
            set(sourceAtom, update instanceof Function ? oldValue => mapWrite(update(mapRead(oldValue))) : mapWrite(update))
        }
    )
}
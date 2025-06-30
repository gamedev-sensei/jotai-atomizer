import {PrimitiveAtom, useAtom} from "jotai"
import {WritableListAtom} from "@gamedev-sensei/jotai-atomizer";
import {useMemo} from "react";

export type WritableListAtomItem<T> = {
    id: string
    atom: PrimitiveAtom<T>
    remove(): void
}
export type UseListAtomResult<T> = {
    atoms: WritableListAtomItem<T>[]
    append(item: T): void
    insert(item: T, beforeIndex: number): void
    move(oldIndex: number, newIndex: number): void
}

export function useWritableListAtom<T>(itemsAtom: WritableListAtom<T>): UseListAtomResult<T> {
    const [itemAtoms, itemsDispatch] = useAtom(itemsAtom)

    return useMemo(() => ({
        atoms: itemAtoms.map(itemAtom => ({
            id: itemAtom.toString(),
            atom: itemAtom,
            remove() { itemsDispatch({ type: "remove", atom: itemAtom }) }
        })),
        append(item: T) { itemsDispatch({ type: "insert", value: item }) },
        insert(item: T, beforeIndex: number) {
            if (beforeIndex < 0) return
            if (beforeIndex > itemAtoms.length) return
            itemsDispatch({ type: "insert", value: item, before: itemAtoms[beforeIndex] })
        },
        move(oldIndex: number, newIndex: number) {
            if (oldIndex === newIndex) return
            if (newIndex > oldIndex) newIndex++
            itemsDispatch({ type: "move", atom: itemAtoms[oldIndex], before: newIndex >= 0 ? itemAtoms[newIndex] : undefined })
        }
    }), [itemAtoms, itemsDispatch])
}
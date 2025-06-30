import {PrimitiveAtom, useAtomValue} from "jotai";
import {selectAtom} from "jotai/utils";
import {useDerived} from "./useDerived";

type UnionPickProps<T extends object, P extends keyof T> = T extends any ? Pick<T, P> : never
function unionPick<T extends object, P extends keyof T>(obj: T, props: Readonly<P[]>): UnionPickProps<T, P> {
    const ret = {} as Pick<T, P>
    for (const prop of props) {
        if (prop in obj) ret[prop] = obj[prop]
    }
    return ret as UnionPickProps<T, P>
}

type SplitUnionAtom<T extends object, P extends keyof T> = T extends unknown ? Pick<T, P> & {
    atom: PrimitiveAtom<T>
} : never

export function useUnionAtom<T extends object, P extends keyof T>(unionAtom: PrimitiveAtom<T>, keys: P[]): SplitUnionAtom<T, P> {
    const pickedKeysAtom = useDerived(() => selectAtom(unionAtom, obj => unionPick(obj, keys)), [unionAtom, ...keys])

    const pickedKeys = useAtomValue(pickedKeysAtom)

    return { ...pickedKeys, atom: unionAtom } as SplitUnionAtom<T, P>
}
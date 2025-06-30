import {PrimitiveAtom} from "jotai";
import {atomize, Atomized} from "@gamedev-sensei/jotai-atomizer";
import {useDerived} from "./useDerived";

export function useAtomized<T>(sourceAtom: PrimitiveAtom<T>): Atomized<T> {
    return useDerived(() => atomize(sourceAtom), [sourceAtom])
}
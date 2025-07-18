import {atomize, Atomized} from "@gamedev-sensei/jotai-atomizer";
import {atom} from "jotai";
import {useDerived} from "@gamedev-sensei/react-extras";
import {isDeepEqual} from "remeda";

export function useAtomizedValue<T>(initialValue: T): Atomized<T> {
    return useDerived(() => atomize(atom(initialValue)), [initialValue], isDeepEqual)
}
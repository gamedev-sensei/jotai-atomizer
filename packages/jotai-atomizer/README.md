# Jotai atomizer

This packages provides a simple way to access parts of your state via `Atomized` - wrapper around jotai atom.

## How it works?

Pass the primitive atom to the `atomize` function to wrap it with `Atomized`:

```ts
const someAtom = atom({ a: 4, b: 7 })
const atomizedAtom = atomize(someAtom)
```

Now, you can access atoms referring to the parts of source atom:

```ts
const aSubatom = atomizedAtom.a.atom
```

If your atom contains array property, additional `split` property will be accessible, so that you don't have to obtain the atom and split it manually:

```ts
const someAtom = atom({ test: [6, 7] })
const atomizedAtom = atomize(someAtom)
const splitAtom = atomizedAtom.test.split
```

## Other utilities

* `optionalAtom<T>(sourceAtom: PrimitiveAtom<T | undefined>): Atom<PrimitiveAtom<T> | undefined>` - helps to handle optional content
* `mappedAtom<T, R>(sourceAtom: PrimitiveAtom<T>, mapRead: (v: T) => R, mapWrite: (v: R) => T): PrimitiveAtom<R>` - creates proxy atom
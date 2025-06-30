import {defineConfig} from "tsup"
import alias from "esbuild-plugin-alias"
import path from "path"

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    outDir: "./dist",
    dts: true,
    clean: true,
    esbuildPlugins: [
        alias({
            "@": path.resolve(__dirname, "src")
        })
    ]
})
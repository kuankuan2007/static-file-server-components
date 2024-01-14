const esbuild=require("esbuild")
const fs=require("fs")
const child_process=require("child_process")
for(const i of fs.readdirSync("./lib")){
    fs.rmSync(`./lib/${i}`)
}
child_process.execSync("tsc",["--emitDeclarationOnl","-p","./tsconfig.json"],{
    cwd:process.cwd()
})
for(const i of fs.readdirSync("./lib")){
    if (i.endsWith(".d.ts")){
        fs.renameSync(`./lib/${i}`,`./lib/${i.slice(0,-5)}.d.cts`)
    }else if(i.endsWith(".js")){
        fs.rmSync(`./lib/${i}`)
    }
}
child_process.execSync("tsc",["--emitDeclarationOnl","-p","./tsconfig.m.json"],{
    cwd:process.cwd()
})
for(const i of fs.readdirSync("./lib")){
    if (i.endsWith(".d.ts")){
        fs.renameSync(`./lib/${i}`,`./lib/${i.slice(0,-5)}.d.mts`)
    }else if(i.endsWith(".js")){
        fs.rmSync(`./lib/${i}`)
    }
}
esbuild.buildSync({
    entryPoints:["./src/main.ts"],
    outfile:"./lib/main.cjs",
    bundle:true,
    platform:"node",
    format:"cjs",
    tsconfig:"./tsconfig.json",
})
esbuild.buildSync({
    entryPoints:["./src/main.ts"],
    outfile:"./lib/main.mjs",
    bundle:true,
    platform:"node",
    format:"esm",
    tsconfig:"./tsconfig.m.json",
})
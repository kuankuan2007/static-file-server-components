import type { IncomingMessage, ServerResponse } from "node:http"
import * as fs from "node:fs"
import * as path from "node:path"
import defaultMimeTypes from "./mime"

type ComponentConfig = {
    urlPrefix: string,
    rootDir: string,
    dirDefaultEntries?: string[] | null,
    mimeTypes?: { [key: string]: string },
    onNotFound?: (component: staticFileServerComponent, req: IncomingMessage, res: ServerResponse<IncomingMessage>, target: string) => Promise<void>,
    onDir?: (component: staticFileServerComponent, req: IncomingMessage, res: ServerResponse<IncomingMessage>, target: string) => Promise<void>,
    onFile?: (component: staticFileServerComponent, req: IncomingMessage, res: ServerResponse<IncomingMessage>, target: string) => Promise<void>,
    onError?: (component: staticFileServerComponent, req: IncomingMessage, res: ServerResponse<IncomingMessage>, target: string, err: Error | unknown) => Promise<void>,
    on404?: (component: staticFileServerComponent, req: IncomingMessage, res: ServerResponse<IncomingMessage>, target: string) => Promise<void>,
    on403?: (component: staticFileServerComponent, req: IncomingMessage, res: ServerResponse<IncomingMessage>, target: string) => Promise<void>
    on500?: (component: staticFileServerComponent, req: IncomingMessage, res: ServerResponse<IncomingMessage>, target: string, err: Error | unknown) => Promise<void>
}
export const defaultConfig = Object.freeze({
    dirDefaultEntries: ["index.html"],
    mimeTypes: defaultMimeTypes,
    onNotFound: async function (component: staticFileServerComponent, req: IncomingMessage, res: ServerResponse<IncomingMessage>, target: string) {
        await component.config.on404(component, req, res, target)
    }, onDir: async function (component: staticFileServerComponent, req: IncomingMessage, res: ServerResponse<IncomingMessage>, target: string) {

        if (component.config.dirDefaultEntries) {
            for (const i of component.config.dirDefaultEntries) {
                let newTarget = path.join(target, i);
                console.log(newTarget)
                if (fs.existsSync(newTarget)) {
                    try {
                        await new Promise((resolve, reject) => {
                            fs.stat(newTarget, (err, stat) => {
                                if (err) {
                                    reject(err);
                                }
                                if (stat.isDirectory()) {
                                    reject(new Error("target is dir"))
                                }
                                else {
                                    res.setHeader("Content-Type", component.getMime(newTarget))
                                    fs.createReadStream(newTarget).pipe(res).on("finish", resolve).on("error", reject);
                                }
                            })
                        })
                        return
                    } catch (err) {
                        continue
                    }
                }
            }
            await component.config.on404(component, req, res, target)
        } else {
            await component.config.on403(component, req, res, target)
        }
    }, onFile: async function (component: staticFileServerComponent, req: IncomingMessage, res: ServerResponse<IncomingMessage>, target: string) {
        res.setHeader("Content-Type", component.getMime(target))
        fs.createReadStream(target).pipe(res).on("finish", () => res.end()).on("error", (err) => { throw err });
    }, onError: async function (component: staticFileServerComponent, req: IncomingMessage, res: ServerResponse<IncomingMessage>, target: string, err: Error | unknown) {
        await component.config.on500(component, req, res, target, err)
        throw err
    }, on404: async function (component: staticFileServerComponent, req: IncomingMessage, res: ServerResponse<IncomingMessage>, target: string) {
        res.statusCode = 404
        res.end(404)
    }, on403: async function (component: staticFileServerComponent, req: IncomingMessage, res: ServerResponse<IncomingMessage>, target: string) {
        res.statusCode = 403
        res.end(403)
    }, on500: async function (component: staticFileServerComponent, req: IncomingMessage, res: ServerResponse<IncomingMessage>, target: string, err: Error | unknown) {
        res.statusCode = 500
        res.end()
    }
})
export default class staticFileServerComponent {
    config: Required<Readonly<ComponentConfig>>
    constructor(config: ComponentConfig) {
        this.config = Object.assign({}, defaultConfig, config)

    }
    onRequest(req: IncomingMessage, res: ServerResponse<IncomingMessage>): void {
        const url = new URL(req.url || "", `http://${req.headers.host || "localhost"}/`)
        if (!url.pathname.startsWith(this.config.urlPrefix)) {
            throw new Error(`${this.config.urlPrefix} is not in ${url.pathname}`)
        }
        let target = path.join(this.config.rootDir, url.pathname.slice(this.config.urlPrefix.length))
        if (fs.existsSync(target)) {
            fs.stat(target, (err, stat) => {
                if (err) {
                    this.config.onError(this, req, res, target, err)
                    return
                }
                if (stat.isDirectory()) {
                    this.config.onDir(this, req, res, target).catch(err => {
                        this.config.onError(this, req, res, target, err)
                    })
                } else {
                    this.config.onFile(this, req, res, target).catch(err => {
                        this.config.onError(this, req, res, target, err)
                    })
                }
            })
        }
        else {
            this.config.onNotFound(this, req, res, target).catch(err => {
                this.config.onError(this, req, res, target, err)
            })
        }
    }
    getMime(target: string): string {
        return this.config.mimeTypes[path.extname(target)]||"application/octet-stream"
    }
}
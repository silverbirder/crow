import * as fs from "fs";
import {IStorage} from "./storage";
import {promisify} from "util";

// @ts-ignore
export class LocalStorage implements IStorage {
    readonly rootDir: string;

    constructor(targets: [string]) {
        this.rootDir = targets[0];
        this.init().then((result:boolean) => { return result});
    }

    async init(): Promise<boolean> {
        if (!fs.existsSync(this.rootDir)) {
            return new Promise(resolve => {
                fs.mkdir(this.rootDir,err => {
                    resolve(true);
                });
            });
        }
    }

    async save(name: string, contents: string): Promise<boolean> {
        return await promisify(fs.writeFile)(`${this.rootDir}/${name}`, contents).then(() => {return true;}).catch(() => {return false});
    }
}
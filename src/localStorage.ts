import * as fs from "fs";
import {IStorage} from "./storage";

// @ts-ignore
export class LocalStorage implements IStorage {
    readonly rootDir: string;

    constructor(rootPath: string) {
        this.rootDir = rootPath;
        this.init();
    }

    init(): void {
        if (!fs.existsSync(this.rootDir)) {
            fs.mkdirSync(this.rootDir);
        }
    }

    save(name: string, contents: string): boolean {
        try {
            fs.writeFileSync(`${this.rootDir}/${name}`, contents);
            return true;
        } catch (e) {
            return false;
        }
    }
}
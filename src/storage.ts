export interface IStorage {
    rootDir: string,
    save(name: string, contents: string):boolean,
    init():void,
}
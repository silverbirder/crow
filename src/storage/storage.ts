export interface IStorage {
    save(name: string, contents: string):Promise<boolean>,
    init():void,
}
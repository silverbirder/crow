import {crow} from './crow';
import {IStorage} from './storage/storage';
import {LocalStorage} from "./storage/localStorage";
import {BigQueryStorage} from "./storage/bigQueryStorage";

class Crow {
    readonly storage: IStorage;
    constructor(storage: IStorage) {
        this.storage = storage;
    }
    invoke(name: string, url:string) {
        crow(url).then((contents:string) => {
            this.storage.save(name, contents);
        })
    }
}

module.exports = {
    Crow: Crow,
    LocalStorage: LocalStorage,
    BigQueryStorage: BigQueryStorage
};
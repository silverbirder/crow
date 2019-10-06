import {crow} from './crow';
import {IStorage} from './storage/storage';
import * as path from 'path';
import {BigQueryStorage} from "./storage/bigQueryStorage";

const rootDir: string = path.resolve(__dirname, '../');

const domain:string = 'google.com';
const url: string = `https://${domain}`;

const storage:IStorage  = new BigQueryStorage(`datasetId`, `tableId`);

crow(url).then((contents:string) => {
    storage.save(`${domain}.html`, contents).then((result:boolean) => {
    });
});

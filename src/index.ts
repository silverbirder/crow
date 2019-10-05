import {crow} from './crow';
import {IStorage} from './storage';
import {LocalStorage} from "./localStorage";
import * as path from 'path';

const rootDir: string = path.resolve(__dirname, '../');

const domain:string = 'google.com';
const url: string = `https://${domain}`;
const storage:IStorage  = new LocalStorage(`${rootDir}/storage`);

crow(url).then((contents:string) => {
    storage.save(`${domain}.html`, contents);
});

import {crow} from './crow';

crow('https://google.com').then((contents:string) => {
    console.log(contents);
});
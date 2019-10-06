define = typeof define === 'function' && define.amd
    ? define
    : (function () {
        'use strict';
        var name = 'mylib',
            workspace = {};
        return function define(m, rs, f) {
            return !f
                ? void define(name, m, rs)
                : void f.apply(this, rs.map(function (r) {
                    switch (r) {
                        case 'require': {
                            return typeof require === 'function' ? require : void 0;
                        }
                        case 'exports': {
                            return m.indexOf('/') === -1
                                ? workspace[m] = typeof exports === 'undefined' ? self[m] = self[m] || {} : exports
                                : workspace[m] = workspace.hasOwnProperty(m) ? workspace[m] : {};
                        }
                        default: {
                            return r.slice(-2) === '.d' && {}
                                || workspace.hasOwnProperty(r) && workspace[r]
                                || typeof require === 'function' && require(r)
                                || self[r];
                        }
                    }
                }));
        };
    })();

define("crow", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function crow(url) {
        const puppeteer = require('puppeteer');
        const html = (async () => {
            const browser = await puppeteer.launch({
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox'
                ]
            });
            const page = await browser.newPage();
            await page.goto(url);
            const html = await page.content();
            await browser.close();
            return html;
        })();
        return html;
    }
    exports.crow = crow;
});
define("storage/storage", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("storage/localStorage", ["require", "exports", "fs", "util"], function (require, exports, fs, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LocalStorage {
        constructor(targets) {
            this.rootDir = targets[0];
            this.init().then((result) => { return result; });
        }
        async init() {
            if (!fs.existsSync(this.rootDir)) {
                return new Promise(resolve => {
                    fs.mkdir(this.rootDir, err => {
                        resolve(true);
                    });
                });
            }
        }
        async save(name, contents) {
            return await util_1.promisify(fs.writeFile)(`${this.rootDir}/${name}`, contents).then(() => { return true; }).catch(() => { return false; });
        }
    }
    exports.LocalStorage = LocalStorage;
});
define("storage/bigQueryStorage", ["require", "exports", "@google-cloud/bigquery"], function (require, exports, bigquery_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const bigquery = new bigquery_1.BigQuery();
    class BigQueryStorage {
        constructor(targets) {
            this.datasetId = targets[0];
            this.tableId = targets[1];
            this.init();
        }
        async init() {
            const dataset = bigquery.dataset(this.datasetId);
            const isExistsDatasets = await dataset.exists();
            const isExistsDataset = isExistsDatasets.filter((value) => (value)).length > 0;
            if (!isExistsDataset) {
                await bigquery.createDataset(this.datasetId);
            }
            const table = dataset.table(this.tableId);
            const isExistsTables = await table.exists();
            const isExistsTable = isExistsTables.filter((value) => (value)).length > 0;
            if (!isExistsTable) {
                const schema = 'Name:string, Contents: string';
                const options = {
                    schema: schema,
                    location: 'JST',
                };
                await bigquery
                    .dataset(this.datasetId)
                    .createTable(this.tableId, options);
            }
        }
        async save(name, contents) {
            return await bigquery
                .dataset(this.datasetId)
                .table(this.tableId)
                .insert([{ name: name, contents: contents }])
                .then(() => { return true; }).catch(() => { return false; });
        }
    }
    exports.BigQueryStorage = BigQueryStorage;
});
define("index", ["require", "exports", "crow", "storage/localStorage", "storage/bigQueryStorage"], function (require, exports, crow_1, localStorage_1, bigQueryStorage_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Crow {
        constructor(storage) {
            this.storage = storage;
        }
        invoke(name, url) {
            crow_1.crow(url).then((contents) => {
                this.storage.save(name, contents);
            });
        }
    }
    module.exports = {
        Crow: Crow,
        LocalStorage: localStorage_1.LocalStorage,
        BigQueryStorage: bigQueryStorage_1.BigQueryStorage
    };
});
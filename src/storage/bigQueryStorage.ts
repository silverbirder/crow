import {IStorage} from "./storage";
import {BigQuery, Dataset, Table} from '@google-cloud/bigquery';
// @see https://cloud.google.com/bigquery/docs/reference/libraries#client-libraries-install-nodejs

const bigquery = new BigQuery();

// @ts-ignore
export class BigQueryStorage implements IStorage {
    readonly datasetId: string;
    readonly tableId: string;

    constructor(datasetId: string, tableId: string) {
        this.datasetId = datasetId;
        this.tableId = tableId;
        this.init();
    }

    async init() {
        const dataset:Dataset = bigquery.dataset(this.datasetId);
        const isExistsDatasets: [boolean] = await dataset.exists();
        const isExistsDataset:boolean = isExistsDatasets.filter((value:boolean) => (value)).length > 0;
        if (!isExistsDataset) {
            await bigquery.createDataset(this.datasetId);
        }
        const table:Table = dataset.table(this.tableId);
        const isExistsTables:[boolean] = await table.exists();
        const isExistsTable:boolean = isExistsTables.filter((value:boolean) => (value)).length > 0;
        if (!isExistsTable) {
            const schema:string = 'Name:string, Contents: string';
            const options = {
                schema: schema,
                location: 'JST',
            };
            await bigquery
                .dataset(this.datasetId)
                .createTable(this.tableId, options);
        }
    }

    async save(name: string, contents: string): Promise<boolean> {
        return await bigquery
            .dataset(this.datasetId)
            .table(this.tableId)
            .insert([{name: name, contents: contents}])
            .then(() => {return true}).catch(() => {return false});
    }
}
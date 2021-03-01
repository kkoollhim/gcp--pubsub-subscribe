import { Injectable } from '@nestjs/common';
import { v1 as uuidv1 } from 'uuid';
const { BigQuery } = require('@google-cloud/bigquery');
const bigquery = new BigQuery();
// const { pubSub } = require('@google-cloud/pubsub');
// const pubSubClient  = new pubSub();

const dataset = bigquery.dataset('admin');
const table = dataset.table('subscribed_data');

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getData(pubSubData) {
    let subData = JSON.parse(Buffer.from(pubSubData.message.data, 'base64').toString());

    for(const item of subData.items){
      const notification_id = await uuidv1();
      
      //push data into bigquery table
      await this.insertIntoDB(item, notification_id);
    }
    return JSON.stringify(pubSubData.message);
  }

  async insertIntoDB(item, notification_id) {
    const query =  await this.insertQuery(item, notification_id);
    await this.insertData(query);
  }

  
  insertQuery(item, notification_id){
    const query = `insert into ${dataset}.${table}
    ( ID, Key, Value)
    values ('${notification_id}', '${item}', '${item}')`;
    return query;
}
async insertData(query: string) {
  const options = {
      query: query,
      location: 'US',
  };

  const [job] = await bigquery.createQueryJob(options).catch(err=> console.log(err));

  // Wait for the query to finish
  await job.getQueryResults().catch(err=> console.log(err));
}
}

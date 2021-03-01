import { Injectable } from '@nestjs/common';
// const { pubSub } = require('@google-cloud/pubsub');
// const pubSubClient  = new pubSub();

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getData(pubSubData): String {
    // let subData = JSON.parse(Buffer.from(pubSubData.message.data, 'base64').toString());
    return JSON.stringify(pubSubData.message);
    // for(const item of subData.items){
    //   console.log(item);
    // }
  }
}

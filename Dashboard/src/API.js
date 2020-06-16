import axios from 'axios';
import Scraper from './Scraper';

const request = require('request');

const scraper = new Scraper();
const http = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production' ? 'https://2019ncov-api.now.sh' : 'http://localhost:3000'
});
// const baidunews = axios.create({
//   baseURL:
//     'http://opendata.baidu.com/data/inner?tn=reserved_all_res_tn&dspName=iphone&from_sf=1&dsp=iphone&resource_id=28565&alr=1&query=%E6%96%B0%E5%86%A0%E8%82%BA%E7%82%8E%E5%9B%BD%E5%A4%96%E7%96%AB%E6%83%85'
// });

// export async function request(url) {
//   const res = await fetch(url, { mode: 'no-cors' });
//   const data = await res.json();
//   return data;
// }
export default {
  async getCases() {
    const { data } = await scraper.fetchTimeSeries();
    console.log(data);
    return data;
  },
  async getTweets(params) {
    const { data } = await http('/api/tweets', {
      params
    });
    return data;
  },
  async getFatalityRate() {
    // const { data } = await http('/api/fatality-rate');
    // console.log(data);
    // console.log(JSON.stringify(data));
    const data = JSON.parse(
      '{"byAge":[{"age":"80+ years old","rate":"14.8%"},{"age":"70-79 years old","rate":"8.0%"},{"age":"60-69 years old","rate":"3.6%"},{"age":"50-59 years old","rate":"1.3%"},{"age":"40-49 years old","rate":"0.4%"},{"age":"30-39 years old","rate":"0.2%"},{"age":"20-29 years old","rate":"0.2%"},{"age":"10-19 years old","rate":"0.2%"},{"age":"0-9 years old","rate":"no fatalities"}],"bySex":[{"sex":"Male","rate":"4.7%"},{"sex":"Female","rate":"2.8%"}],"byComorbidity":[{"preExistingCondition":"Cardiovascular disease","rate":"10.5%"},{"preExistingCondition":"Diabetes","rate":"7.3%"},{"preExistingCondition":"Chronic respiratory disease","rate":"6.3%"},{"preExistingCondition":"Hypertension","rate":"6.0%"},{"preExistingCondition":"Cancer","rate":"5.6%"},{"preExistingCondition":"no pre-existing conditions","rate":"0.9%"}]}'
    );
    return data;
  },
  async getMyTime() {
    const { data } = await axios.get(
      'https://api.inews.qq.com/newsqa/v1/automation/modules/list?modules=FAutoNewsArticleList'
    );
    return data;
  },
  async getChianData() {
    const url = 'https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5';
    const { data } = await axios.get(`https://bird.ioliu.cn/v1?url=${url}`);
    return data;
  }
};

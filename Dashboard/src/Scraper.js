const cheerio = require('cheerio');
const request = require('request');
const csv = require('csvtojson');

const WORLD_COUNTRIES = [
  { name: 'Afghanistan', abbreviation: 'AF', translation: '阿富汗' },
  { name: 'Albania', abbreviation: 'AL', translation: '阿尔巴尼亚' },
  { name: 'Algeria', abbreviation: 'DZ', translation: '阿尔及利亚' },
  { name: 'American Samoa', abbreviation: 'AS', translation: '美属萨摩亚' },
  { name: 'Andorra', abbreviation: 'AD', translation: '安道尔' },
  { name: 'Angola', abbreviation: 'AO', translation: '安哥拉' },
  { name: 'Anguilla', abbreviation: 'AI', translation: '安圭拉' },
  { name: 'Antarctica', abbreviation: 'AQ', translation: '南极洲' },
  {
    name: 'Antigua and Barbuda',
    abbreviation: 'AG',
    translation: '安提瓜和巴布达'
  },
  { name: 'Argentina', abbreviation: 'AR', translation: '阿根廷' },
  { name: 'Armenia', abbreviation: 'AM', translation: '亚美尼亚' },
  { name: 'Aruba', abbreviation: 'AW', translation: '阿鲁巴' },
  { name: 'Australia', abbreviation: 'AU', translation: '澳大利亚' },
  { name: 'Austria', abbreviation: 'AT', translation: '奥地利' },
  { name: 'Azerbaijan', abbreviation: 'AZ', translation: '阿塞拜疆' },
  { name: 'Bahamas', abbreviation: 'BS', translation: '巴哈马' },
  { name: 'Bahrain', abbreviation: 'BH', translation: '巴林' },
  { name: 'Bangladesh', abbreviation: 'BD', translation: '孟加拉国' },
  { name: 'Barbados', abbreviation: 'BB', translation: '巴巴多斯' },
  { name: 'Belarus', abbreviation: 'BY', translation: '白俄罗斯' },
  { name: 'Belgium', abbreviation: 'BE', translation: '比利时' },
  { name: 'Belize', abbreviation: 'BZ', translation: '伯利兹' },
  { name: 'Benin', abbreviation: 'BJ', translation: '贝宁' },
  { name: 'Bermuda', abbreviation: 'BM', translation: '百慕大' },
  { name: 'Bhutan', abbreviation: 'BT', translation: '不丹' },
  { name: 'Bolivia', abbreviation: 'BO', translation: '玻利维亚' },
  {
    name: 'Bosnia and Herzegovina',
    abbreviation: 'BA',
    translation: '波斯尼亚和黑塞哥维那的'
  },
  { name: 'Botswana', abbreviation: 'BW', translation: '博茨瓦纳' },
  { name: 'Bouvet Island', abbreviation: 'BV', translation: '布维岛' },
  { name: 'Brazil', abbreviation: 'BR', translation: '巴西' },
  {
    name: 'British Indian Ocean Territory',
    abbreviation: 'IO',
    translation: '英属印度洋领土'
  },
  { name: 'Brunei', abbreviation: 'BN', translation: '文莱' },
  { name: 'Bulgaria', abbreviation: 'BG', translation: '保加利亚' },
  { name: 'Burkina Faso', abbreviation: 'BF', translation: '布基纳法索' },
  { name: 'Burundi', abbreviation: 'BI', translation: '布隆迪' },
  { name: 'Cambodia', abbreviation: 'KH', translation: '柬埔寨' },
  { name: 'Cameroon', abbreviation: 'CM', translation: '喀麦隆' },
  { name: 'Canada', abbreviation: 'CA', translation: '加拿大' },
  { name: 'Cape Verde', abbreviation: 'CV', translation: 'Cape Verde' },
  { name: 'Cayman Islands', abbreviation: 'KY', translation: '开曼群岛' },
  {
    name: 'Central African Republic',
    abbreviation: 'CF',
    translation: '中非共和国'
  },
  { name: 'Chad', abbreviation: 'TD', translation: '乍得' },
  { name: 'Chile', abbreviation: 'CL', translation: '智利' },
  { name: 'China', abbreviation: 'CN', translation: '中国' },
  { name: 'Christmas Island', abbreviation: 'CX', translation: '圣诞岛' },
  {
    name: 'Cocos (Keeling) Islands',
    abbreviation: 'CC',
    translation: '科科斯(基灵)群岛'
  },
  { name: 'Colombia', abbreviation: 'CO', translation: '哥伦比亚' },
  { name: 'Comoros', abbreviation: 'KM', translation: '科摩罗' },
  { name: 'Congo', abbreviation: 'CG', translation: '刚果' },
  { name: 'Cook Islands', abbreviation: 'CK', translation: '库克群岛' },
  { name: 'Costa Rica', abbreviation: 'CR', translation: '哥斯达黎加' },
  { name: 'Croatia', abbreviation: 'HR', translation: '克罗地亚' },
  { name: 'Cuba', abbreviation: 'CU', translation: '古巴' },
  { name: 'Cyprus', abbreviation: 'CY', translation: '塞浦路斯' },
  { name: 'Czech Republic', abbreviation: 'CZ', translation: '捷克共和国' },
  { name: 'Denmark', abbreviation: 'DK', translation: '丹麦' },
  { name: 'Djibouti', abbreviation: 'DJ', translation: '吉布提' },
  { name: 'Dominica', abbreviation: 'DM', translation: '多米尼克' },
  {
    name: 'Dominican Republic',
    abbreviation: 'DO',
    translation: '多米尼加共和国'
  },
  { name: 'East Timor', abbreviation: 'TP', translation: '东帝汶' },
  { name: 'Ecuador', abbreviation: 'EC', translation: '厄瓜多尔' },
  { name: 'Egypt', abbreviation: 'EG', translation: '埃及' },
  { name: 'El Salvador', abbreviation: 'SV', translation: '萨尔瓦多' },
  { name: 'Equatorial Guinea', abbreviation: 'GQ', translation: '赤道几内亚' },
  { name: 'Eritrea', abbreviation: 'ER', translation: '厄立特里亚' },
  { name: 'Estonia', abbreviation: 'EE', translation: '爱沙尼亚' },
  { name: 'Ethiopia', abbreviation: 'ET', translation: '埃塞俄比亚' },
  { name: 'Falkland Islands', abbreviation: 'FK', translation: '福克兰群岛' },
  { name: 'Faroe Islands', abbreviation: 'FO', translation: '法罗群岛' },
  { name: 'Fiji Islands', abbreviation: 'FJ', translation: '斐济群岛' },
  { name: 'Finland', abbreviation: 'FI', translation: '芬兰' },
  { name: 'France', abbreviation: 'FR', translation: '法国' },
  { name: 'French Guiana', abbreviation: 'GF', translation: '法属圭亚那' },
  {
    name: 'French Polynesia',
    abbreviation: 'PF',
    translation: '法属波利尼西亚'
  },
  {
    name: 'French Southern territories',
    abbreviation: 'TF',
    translation: '法国南部的领土'
  },
  { name: 'Gabon', abbreviation: 'GA', translation: '加蓬' },
  { name: 'Gambia', abbreviation: 'GM', translation: '冈比亚' },
  { name: 'Georgia', abbreviation: 'GE', translation: '格鲁吉亚' },
  { name: 'Germany', abbreviation: 'DE', translation: '德国' },
  { name: 'Ghana', abbreviation: 'GH', translation: '加纳' },
  { name: 'Gibraltar', abbreviation: 'GI', translation: '直布罗陀' },
  { name: 'Greece', abbreviation: 'GR', translation: '希腊' },
  { name: 'Greenland', abbreviation: 'GL', translation: '格陵兰' },
  { name: 'Grenada', abbreviation: 'GD', translation: '格林纳达' },
  { name: 'Guadeloupe', abbreviation: 'GP', translation: '瓜德罗普岛' },
  { name: 'Guam', abbreviation: 'GU', translation: '关岛' },
  { name: 'Guatemala', abbreviation: 'GT', translation: '危地马拉' },
  { name: 'Guernsey', abbreviation: 'GG', translation: '根西岛' },
  { name: 'Guinea', abbreviation: 'GN', translation: '几内亚' },
  { name: 'Guinea-Bissau', abbreviation: 'GW', translation: '几内亚比绍' },
  { name: 'Guyana', abbreviation: 'GY', translation: '圭亚那' },
  { name: 'Haiti', abbreviation: 'HT', translation: '海地' },
  {
    name: 'Heard Island and McDonald Islands',
    abbreviation: 'HM',
    translation: '赫德岛和麦克唐纳群岛'
  },
  {
    name: 'Holy See (Vatican City State)',
    abbreviation: 'VA',
    translation: '罗马教廷(梵蒂冈城市国家)'
  },
  { name: 'Honduras', abbreviation: 'HN', translation: '洪都拉斯' },
  { name: 'Hungary', abbreviation: 'HU', translation: '匈牙利' },
  { name: 'Iceland', abbreviation: 'IS', translation: '冰岛' },
  { name: 'India', abbreviation: 'IN', translation: '印度' },
  { name: 'Indonesia', abbreviation: 'ID', translation: '印度尼西亚' },
  { name: 'Iran', abbreviation: 'IR', translation: '伊朗' },
  { name: 'Iraq', abbreviation: 'IQ', translation: '伊拉克' },
  { name: 'Ireland', abbreviation: 'IE', translation: '爱尔兰' },
  { name: 'Isle of Man', abbreviation: 'IM', translation: '马恩岛' },
  { name: 'Israel', abbreviation: 'IL', translation: '以色列' },
  { name: 'Italy', abbreviation: 'IT', translation: '意大利' },
  { name: 'Ivory Coast', abbreviation: 'CI', translation: '象牙海岸' },
  { name: 'Jamaica', abbreviation: 'JM', translation: '牙买加' },
  { name: 'Japan', abbreviation: 'JP', translation: '日本' },
  { name: 'Jersey', abbreviation: 'JE', translation: '泽西' },
  { name: 'Jordan', abbreviation: 'JO', translation: '约旦' },
  { name: 'Kazakhstan', abbreviation: 'KZ', translation: '哈萨克斯坦' },
  { name: 'Kenya', abbreviation: 'KE', translation: '肯尼亚' },
  { name: 'Kiribati', abbreviation: 'KI', translation: '基里巴斯' },
  { name: 'Kuwait', abbreviation: 'KW', translation: '科威特' },
  { name: 'Kyrgyzstan', abbreviation: 'KG', translation: '吉尔吉斯斯坦' },
  { name: 'Laos', abbreviation: 'LA', translation: '老挝' },
  { name: 'Latvia', abbreviation: 'LV', translation: '拉脱维亚' },
  { name: 'Lebanon', abbreviation: 'LB', translation: '黎巴嫩' },
  { name: 'Lesotho', abbreviation: 'LS', translation: '莱索托' },
  { name: 'Liberia', abbreviation: 'LR', translation: '利比里亚' },
  {
    name: 'Libyan Arab Jamahiriya',
    abbreviation: 'LY',
    translation: '阿拉伯利比亚民众国'
  },
  { name: 'Liechtenstein', abbreviation: 'LI', translation: '列支敦士登' },
  { name: 'Lithuania', abbreviation: 'LT', translation: '立陶宛' },
  { name: 'Luxembourg', abbreviation: 'LU', translation: '卢森堡' },
  { name: 'Macao', abbreviation: 'MO', translation: '澳' },
  { name: 'North Macedonia', abbreviation: 'MK', translation: '北的马其顿' },
  { name: 'Madagascar', abbreviation: 'MG', translation: '马达加斯加' },
  { name: 'Malawi', abbreviation: 'MW', translation: '马拉维' },
  { name: 'Malaysia', abbreviation: 'MY', translation: '马来西亚' },
  { name: 'Maldives', abbreviation: 'MV', translation: '马尔代夫' },
  { name: 'Mali', abbreviation: 'ML', translation: '马里' },
  { name: 'Malta', abbreviation: 'MT', translation: '马耳他' },
  { name: 'Marshall Islands', abbreviation: 'MH', translation: '马绍尔群岛' },
  { name: 'Martinique', abbreviation: 'MQ', translation: '马提尼克岛' },
  { name: 'Mauritania', abbreviation: 'MR', translation: '毛里塔尼亚' },
  { name: 'Mauritius', abbreviation: 'MU', translation: '毛里求斯' },
  { name: 'Mayotte', abbreviation: 'YT', translation: '马约特岛' },
  { name: 'Mexico', abbreviation: 'MX', translation: '墨西哥' },
  {
    name: 'Micronesia, Federated States of',
    abbreviation: 'FM',
    translation: '密克罗尼西亚联邦'
  },
  { name: 'Moldova', abbreviation: 'MD', translation: '摩尔多瓦' },
  { name: 'Monaco', abbreviation: 'MC', translation: '摩纳哥' },
  { name: 'Mongolia', abbreviation: 'MN', translation: '蒙古' },
  { name: 'Montenegro', abbreviation: 'ME', translation: '黑山' },
  { name: 'Montserrat', abbreviation: 'MS', translation: '蒙特塞拉特' },
  { name: 'Morocco', abbreviation: 'MA', translation: '摩洛哥' },
  { name: 'Mozambique', abbreviation: 'MZ', translation: '莫桑比克' },
  { name: 'Myanmar', abbreviation: 'MM', translation: '缅甸' },
  { name: 'Namibia', abbreviation: 'NA', translation: '纳米比亚' },
  { name: 'Nauru', abbreviation: 'NR', translation: '瑙鲁' },
  { name: 'Nepal', abbreviation: 'NP', translation: '尼泊尔' },
  { name: 'Netherlands', abbreviation: 'NL', translation: '荷兰' },
  {
    name: 'Netherlands Antilles',
    abbreviation: 'AN',
    translation: '荷属安的列斯群岛'
  },
  { name: 'New Caledonia', abbreviation: 'NC', translation: '新喀里多尼亚' },
  { name: 'New Zealand', abbreviation: 'NZ', translation: '新西兰' },
  { name: 'Nicaragua', abbreviation: 'NI', translation: '尼加拉瓜' },
  { name: 'Niger', abbreviation: 'NE', translation: '尼日尔' },
  { name: 'Nigeria', abbreviation: 'NG', translation: '尼日利亚' },
  { name: 'Niue', abbreviation: 'NU', translation: '纽埃' },
  { name: 'Norfolk Island', abbreviation: 'NF', translation: '诺福克岛' },
  { name: 'North Korea', abbreviation: 'KP', translation: '北朝鲜' },
  { name: 'Northern Ireland', abbreviation: 'GB', translation: '北爱尔兰' },
  {
    name: 'Northern Mariana Islands',
    abbreviation: 'MP',
    translation: '北马里亚纳群岛'
  },
  { name: 'Norway', abbreviation: 'NO', translation: '挪威' },
  { name: 'Oman', abbreviation: 'OM', translation: '阿曼' },
  { name: 'Pakistan', abbreviation: 'PK', translation: '巴基斯坦' },
  { name: 'Palau', abbreviation: 'PW', translation: '帕劳' },
  { name: 'Palestine', abbreviation: 'PS', translation: '巴勒斯坦' },
  { name: 'Panama', abbreviation: 'PA', translation: '巴拿马' },
  {
    name: 'Papua New Guinea',
    abbreviation: 'PG',
    translation: '巴布亚新几内亚'
  },
  { name: 'Paraguay', abbreviation: 'PY', translation: '巴拉圭' },
  { name: 'Peru', abbreviation: 'PE', translation: '秘鲁' },
  { name: 'Philippines', abbreviation: 'PH', translation: '菲律宾' },
  { name: 'Pitcairn', abbreviation: 'PN', translation: '皮特凯恩' },
  { name: 'Poland', abbreviation: 'PL', translation: '波兰' },
  { name: 'Portugal', abbreviation: 'PT', translation: '葡萄牙' },
  { name: 'Puerto Rico', abbreviation: 'PR', translation: '波多黎各' },
  { name: 'Qatar', abbreviation: 'QA', translation: '卡塔尔' },
  { name: 'Reunion', abbreviation: 'RE', translation: '留尼汪' },
  { name: 'Romania', abbreviation: 'RO', translation: '罗马尼亚' },
  { name: 'Russia', abbreviation: 'RU', translation: '俄罗斯' },
  { name: 'Rwanda', abbreviation: 'RW', translation: '卢旺达问题' },
  { name: 'Saint Helena', abbreviation: 'SH', translation: '圣赫勒拿的' },
  {
    name: 'Saint Kitts and Nevis',
    abbreviation: 'KN',
    translation: '圣基茨和尼维斯'
  },
  { name: 'Saint Lucia', abbreviation: 'LC', translation: '圣卢西亚' },
  {
    name: 'Saint Pierre and Miquelon',
    abbreviation: 'PM',
    translation: '圣皮埃尔和密克隆群岛'
  },
  {
    name: 'Saint Vincent and the Grenadines',
    abbreviation: 'VC',
    translation: '圣文森特和格林纳丁斯'
  },
  { name: 'Samoa', abbreviation: 'WS', translation: '萨摩亚' },
  { name: 'San Marino', abbreviation: 'SM', translation: '圣马力诺' },
  {
    name: 'Sao Tome and Principe',
    abbreviation: 'ST',
    translation: '圣多美和普林西比'
  },
  { name: 'Saudi Arabia', abbreviation: 'SA', translation: '沙特阿拉伯' },
  { name: 'Senegal', abbreviation: 'SN', translation: '塞内加尔' },
  { name: 'Serbia', abbreviation: 'RS', translation: '塞尔维亚' },
  { name: 'Seychelles', abbreviation: 'SC', translation: '塞舌尔' },
  { name: 'Sierra Leone', abbreviation: 'SL', translation: '塞拉利昂' },
  { name: 'Singapore', abbreviation: 'SG', translation: '新加坡' },
  { name: 'Slovakia', abbreviation: 'SK', translation: '斯洛伐克' },
  { name: 'Slovenia', abbreviation: 'SI', translation: '斯洛文尼亚' },
  { name: 'Solomon Islands', abbreviation: 'SB', translation: '所罗门群岛' },
  { name: 'Somalia', abbreviation: 'SO', translation: '索马里的' },
  { name: 'South Africa', abbreviation: 'ZA', translation: '南非' },
  {
    name: 'South Georgia and the South Sandwich Islands',
    abbreviation: 'GS',
    translation: '南乔治亚岛和南桑威奇群岛'
  },
  { name: 'South Korea', abbreviation: 'KR', translation: '韩国' },
  { name: 'South Sudan', abbreviation: 'SS', translation: '苏丹南部' },
  { name: 'Spain', abbreviation: 'ES', translation: '西班牙' },
  { name: 'Sri Lanka', abbreviation: 'LK', translation: '斯里兰卡' },
  { name: 'Sudan', abbreviation: 'SD', translation: '苏丹' },
  { name: 'Suriname', abbreviation: 'SR', translation: '苏里南' },
  {
    name: 'Svalbard and Jan Mayen',
    abbreviation: 'SJ',
    translation: '斯瓦尔巴特群岛和扬马延岛'
  },
  { name: 'Swaziland', abbreviation: 'SZ', translation: '斯威士兰' },
  { name: 'Sweden', abbreviation: 'SE', translation: '瑞典' },
  { name: 'Switzerland', abbreviation: 'CH', translation: '瑞士' },
  { name: 'Syria', abbreviation: 'SY', translation: '叙利亚' },
  { name: 'Tajikistan', abbreviation: 'TJ', translation: '塔吉克斯坦' },
  { name: 'Tanzania', abbreviation: 'TZ', translation: '坦桑尼亚' },
  { name: 'Thailand', abbreviation: 'TH', translation: '泰国' },
  {
    name: 'The Democratic Republic of Congo',
    abbreviation: 'CD',
    translation: '刚果民主共和国'
  },
  { name: 'Timor-Leste', abbreviation: 'TL', translation: '东帝汶' },
  { name: 'Togo', abbreviation: 'TG', translation: '多哥' },
  { name: 'Tokelau', abbreviation: 'TK', translation: '托克劳' },
  { name: 'Tonga', abbreviation: 'TO', translation: '汤加' },
  {
    name: 'Trinidad and Tobago',
    abbreviation: 'TT',
    translation: '特立尼达和多巴哥'
  },
  { name: 'Tunisia', abbreviation: 'TN', translation: '突尼斯' },
  { name: 'Turkey', abbreviation: 'TR', translation: '土耳其' },
  { name: 'Turkmenistan', abbreviation: 'TM', translation: '土库曼斯坦' },
  {
    name: 'Turks and Caicos Islands',
    abbreviation: 'TC',
    translation: '特克斯和凯科斯群岛'
  },
  { name: 'Tuvalu', abbreviation: 'TV', translation: '图瓦卢' },
  { name: 'Uganda', abbreviation: 'UG', translation: '乌干达' },
  { name: 'Ukraine', abbreviation: 'UA', translation: '乌克兰' },
  {
    name: 'United Arab Emirates',
    abbreviation: 'AE',
    translation: '阿拉伯联合酋长国'
  },
  { name: 'UK', abbreviation: 'GB', translation: '英国' },
  { name: 'USA', abbreviation: 'US', translation: '美国' },
  {
    name: 'United States Minor Outlying Islands',
    abbreviation: 'UM',
    translation: '夏威夷'
  },
  { name: 'Uruguay', abbreviation: 'UY', translation: '乌拉圭' },
  { name: 'Uzbekistan', abbreviation: 'UZ', translation: '乌兹别克斯坦' },
  { name: 'Vanuatu', abbreviation: 'VU', translation: '瓦努阿图' },
  { name: 'Venezuela', abbreviation: 'VE', translation: '委内瑞拉' },
  { name: 'Vietnam', abbreviation: 'VN', translation: '越南' },
  {
    name: 'Virgin Islands, British',
    abbreviation: 'VG',
    translation: '属维尔京群岛、英国'
  },
  {
    name: 'Virgin Islands, U.S.',
    abbreviation: 'VI',
    translation: '属维尔京群岛、美国'
  },
  {
    name: 'Wallis and Futuna',
    abbreviation: 'WF',
    translation: '瓦利斯群岛和富图纳群岛'
  },
  { name: 'Western Sahara', abbreviation: 'EH', translation: '西撒哈拉' },
  { name: 'Yemen', abbreviation: 'YE', translation: '也门' },
  { name: 'Yugoslavia', abbreviation: 'YU', translation: '南斯拉夫问题' },
  { name: 'Zambia', abbreviation: 'ZM', translation: '赞比亚' },
  { name: 'Zimbabwe', abbreviation: 'ZW', translation: '津巴布韦' }
];
class Scraper {
  constructor() {
    // this.timeSeriesURL = 'public/static';
    this.timeSeriesURL = 'https://raw.githubusercontent.com/bumbeishvili/covid19-daily-data/master';
  }

  static getHTML(url) {
    return new Promise((resolve, reject) => {
      request.get(url, (error, _, body) => {
        if (error) return reject(error);
        resolve(cheerio.load(body));
        return null;
      });
      return null;
    });
  }

  async getChinaData() {
    console(this);
    const url = 'https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5';
    const body = request.get(url, (error, _, _body) => {
      if (error) return null;
      return _body;
    });
    return { data: body };
  }

  async fetchTimeSeries() {
    const CN_COUNTRIES = {};
    WORLD_COUNTRIES.forEach(element => {
      CN_COUNTRIES[element.name.toUpperCase()] = {};
      CN_COUNTRIES[element.name.toUpperCase()].translation = element.translation;
      CN_COUNTRIES[element.name.toUpperCase()].abbreviation = element.abbreviation;
    });
    const roundOffCoord = coord => parseFloat(coord.trim()).toFixed(5);

    const data = [];

    // Load confirmed cases
    const confirmedRows = await this.getConfirmedCases();
    const headers = Object.keys(confirmedRows[0]);

    // Load recovered sheet
    const recoveredRows = await this.getRecovered();

    // Load recovered sheet
    const deathRows = await this.getDeaths();

    confirmedRows.forEach(row => {
      const obj = {};
      headers.slice(0, 4).forEach(header => {
        obj[header] = row[header];
      });
      const uname = obj['Country/Region'].toUpperCase();
      if (Object.prototype.hasOwnProperty.call(CN_COUNTRIES, uname)) {
        obj.ISO_A2 = CN_COUNTRIES[uname].abbreviation;
        obj.CNAME = CN_COUNTRIES[uname].translation;
      } else {
        obj.ISO_A2 = '';
        obj.CNAME = obj['Country/Region'];
      }
      obj.flag = `https://corona.lmao.ninja/assets/img/flags/${obj.ISO_A2.toLowerCase()}.png`;
      obj.dates = [];
      headers.slice(4).forEach((header, idx) => {
        // Check if there's matching row in recovered csv
        const recovered = recoveredRows.find(
          i =>
            roundOffCoord(i.Lat) === roundOffCoord(row.Lat) &&
            roundOffCoord(i.Long) === roundOffCoord(row.Long)
        );

        // Check if there's matching row in death csv
        const deaths = deathRows.find(
          i =>
            roundOffCoord(i.Lat) === roundOffCoord(row.Lat) &&
            roundOffCoord(i.Long) === roundOffCoord(row.Long)
        );

        obj.dates.push({
          date: header,
          confirmed: Math.round(+row[header]) || 0,
          recovered: recovered ? Math.round(+recovered[header]) : 0,
          death: deaths ? Math.round(+deaths[header]) : 0
        });
      });
      const today = obj.dates[obj.dates.length - 1];
      const l_today = obj.dates[obj.dates.length - 2];
      obj.today = {
        confirmed: today.confirmed - l_today.confirmed,
        recovered: today.recovered - l_today.recovered,
        death: today.death - l_today.death,
        date: today.date
      };
      data.push(obj);
    });
    const cases = {
      total_confirmed: data.reduce((a, b) => a + b.dates[b.dates.length - 1].confirmed, 0),
      total_recovered: data.reduce((a, b) => a + b.dates[b.dates.length - 1].recovered, 0),
      total_death: data.reduce((a, b) => a + b.dates[b.dates.length - 1].death, 0),
      today_confirmed: data.reduce((a, b) => a + b.today.confirmed, 0),
      today_recovered: data.reduce((a, b) => a + b.today.recovered, 0),
      today_death: data.reduce((a, b) => a + b.today.death, 0),
      data
    };
    return { data: cases };
  }

  static parseCSV(url) {
    return new Promise((resolve, reject) => {
      const rows = [];
      csv()
        // .fromFile(url)
        .fromStream(request.get(url))
        .subscribe(
          json => {
            rows.push(json);
          },
          () => {
            reject();
          },
          () => {
            resolve(rows);
          }
        );
    });
  }

  getConfirmedCases() {
    return Scraper.parseCSV(`${this.timeSeriesURL}/time_series_19-covid-Confirmed.csv`);
  }

  getRecovered() {
    return Scraper.parseCSV(`${this.timeSeriesURL}/time_series_19-covid-Recovered.csv`);
  }

  getDeaths() {
    return Scraper.parseCSV(`${this.timeSeriesURL}/time_series_19-covid-Deaths.csv`);
  }

  static async getFatalityRate() {
    const url = 'https://www.worldometers.info/coronavirus/coronavirus-age-sex-demographics/';

    const $ = await Scraper.getHTML(url);

    const byAgeRows = $('h4:contains("COVID-19 Fatality Rate by AGE:")')
      .next()
      .next()
      .find('table tbody tr');
    const byAge = [];
    $(byAgeRows).each((idx, el) => {
      if (idx === 0) return;

      byAge.push({
        age: $(el)
          .children('td')
          .eq(0)
          .text()
          .trim(),
        rate: $(el)
          .children('td')
          .eq(2)
          .text()
          .trim()
      });
    });

    const bySexRows = $('h4:contains("COVID-19 Fatality Rate by SEX:")')
      .next()
      .next()
      .find('table tbody tr');
    const bySex = [];
    $(bySexRows).each((idx, el) => {
      if (idx === 0) return;

      bySex.push({
        sex: $(el)
          .children('td')
          .eq(0)
          .text()
          .trim(),
        rate: $(el)
          .children('td')
          .eq(1)
          .text()
          .trim()
      });
    });

    const byComorbidityRows = $('h4:contains("COVID-19 Fatality Rate by COMORBIDITY:")')
      .next()
      .next()
      .find('table tbody tr');
    const byComorbidity = [];
    $(byComorbidityRows).each((idx, el) => {
      if (idx === 0) return;

      byComorbidity.push({
        preExistingCondition: $(el)
          .children('td')
          .eq(0)
          .text()
          .trim(),
        rate: $(el)
          .children('td')
          .eq(2)
          .text()
          .trim()
      });
    });

    return {
      data: {
        byAge,
        bySex,
        byComorbidity
      }
    };
  }
}

module.exports = Scraper;

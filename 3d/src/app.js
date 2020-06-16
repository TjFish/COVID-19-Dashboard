import Globe from 'globe.gl';
import { request, getCoordinates, numberWithCommas, formatDate } from './utils';
const TimeSeries = require('./TimeSeries');
import {
  GLOBE_IMAGE_URL,
  BACKGROUND_IMAGE_URL,
  GEOJSON_URL,
  CASES_API,
  WORLD_COUNTRIES,
} from './constants';
import * as d3 from 'd3';

// Globe container
const globeContainer = document.getElementById('globeViz');

const colorScale = d3.scaleSequentialPow(d3.interpolateYlOrRd).exponent(1 / 4);
const getVal = (feat) => {
  return feat.covidData.confirmed / feat.properties.POP_EST;
};

let world;

const flagEndpoint = 'https://corona.lmao.ninja/assets/img/flags';

init();

function init() {
  world = Globe()(globeContainer)
    .globeImageUrl(GLOBE_IMAGE_URL)
    .backgroundImageUrl(BACKGROUND_IMAGE_URL)
    .showGraticules(false)
    .polygonAltitude(0.06)
    .polygonCapColor((feat) => colorScale(getVal(feat)))
    .polygonSideColor(() => 'rgba(0, 100, 0, 0.05)')
    .polygonStrokeColor(() => '#111')
    .polygonLabel(
      ({ properties: d, covidData: c }) => `
            <div class="card">
              <img class="card-img" src="${flagEndpoint}/${d.ISO_A2.toLowerCase()}.png" alt="flag" />
              <div class="container">
                 <span class="card-title"><b>${d.CNNAME}</b></span> <br />
                 <div class="card-spacer"></div>
                 <hr />
                 <div class="card-spacer"></div>
                 <span>确诊: ${numberWithCommas(c.confirmed)}</span>  <br />
                 <span>死亡: ${numberWithCommas(c.deaths)}</span> <br />
                 <span>治愈: ${numberWithCommas(
                   c.recoveries
                 )}</span> <br />
                 <span>总人口: ${d3.format('.3s')(d.POP_EST)}</span>
              </div>
            </div>
          `
    )
    .onPolygonHover((hoverD) =>world
        .polygonAltitude((d) => (d === hoverD ? 0.12 : 0.06))
        .polygonCapColor((d) =>
          d === hoverD ? 'steelblue' : colorScale(getVal(d))
        )
    )
    .polygonsTransitionDuration(200);

  getCases();
}

let dates = [];
let countries = [];
let featureCollection = [];

// Play button
const playButton = document.querySelector('.play-button');
// Slider
const slider = document.querySelector('.slider');
// Slider date
const sliderDate = document.querySelector('.slider-date');

var CN_COUNTRIES={};
WORLD_COUNTRIES.forEach(element => {
  CN_COUNTRIES[element.name.toUpperCase()]=element.translation;
});
function toChina(name)
{
    var uname=name.toUpperCase();
    if(CN_COUNTRIES.hasOwnProperty(uname))
    {
      return CN_COUNTRIES[uname];
    }
    else{
      return name;
    }
}

async function getCases() {
  //countries = await request(CASES_API);
  countries = await TimeSeries.fetchTimeSeries();
  console.log(countries)
  featureCollection = (await request(GEOJSON_URL)).features;
  document.querySelector('.title-desc').innerHTML =
    '选中国家查看具体疫情数据.';

  dates = Object.keys(countries.China);

  // Set slider values
  slider.max = dates.length - 1;
  slider.value = dates.length - 1;

  slider.disabled = false;
  playButton.disabled = false;

  updateCounters();
  updatePolygonsData();

  updatePointOfView();
  featureCollection.forEach(element => {
    element.properties.CNNAME=toChina(element.properties.NAME);
  });
}

const infectedEl = document.querySelector('#infected');
const deathsEl = document.querySelector('#deaths');
const recoveriesEl = document.querySelector('#recovered');
const updatedEl = document.querySelector('.updated');

function updateCounters() {
  sliderDate.innerHTML = dates[slider.value];

  let totalConfirmed = 0;
  let totalDeaths = 0;
  let totalRecoveries = 0;

  Object.keys(countries).forEach((item) => {
    if (countries[item][dates[slider.value]]) {
      const countryDate = countries[item][dates[slider.value]];
      totalConfirmed += +countryDate.confirmed;
      totalDeaths += +countryDate.deaths;
      totalRecoveries += countryDate.recoveries ? +countryDate.recoveries : 0;
    }
  });

  infectedEl.innerHTML = numberWithCommas(totalConfirmed);
  deathsEl.innerHTML = numberWithCommas(totalDeaths);
  recoveriesEl.innerHTML = numberWithCommas(totalRecoveries);

  updatedEl.innerHTML = `(as of ${formatDate(dates[slider.value])})`;
}

function updatePolygonsData() {
  for (let x = 0; x < featureCollection.length; x++) {
    const country = featureCollection[x].properties.NAME;
    if (countries[country]) {
      featureCollection[x].covidData = {
        confirmed: countries[country][dates[slider.value]].confirmed,
        deaths: countries[country][dates[slider.value]].deaths,
        recoveries: countries[country][dates[slider.value]].recoveries,
      };
    } else {
      featureCollection[x].covidData = {
        confirmed: 0,
        deaths: 0,
        recoveries: 0,
      };
    }
  }

  const maxVal = Math.max(...featureCollection.map(getVal));
  colorScale.domain([0, maxVal]);
  world.polygonsData(featureCollection);
}

async function updatePointOfView() {
  // Get coordinates
  try {
    const { latitude, longitude } = await getCoordinates();

    world.pointOfView(
      {
        lat: latitude,
        lng: longitude,
      },
      1000
    );
  } catch (e) {
    console.log('Unable to set point of view.');
  }
}

let interval;

playButton.addEventListener('click', () => {
  if (playButton.innerText === '播放') {
    playButton.innerText = '暂停';
  } else {
    playButton.innerText = '播放';
    world.controls().autoRotate=false;
    clearInterval(interval);
    return;
  }

  // Check if slider position is max
  if (+slider.value === dates.length - 1) {
    slider.value = 0;
  }

  sliderDate.innerHTML = dates[slider.value];
  world.controls().autoRotate=true;
  world.controls().autoRotateSpeed=4;
  interval = setInterval(() => {
    slider.value++;
    sliderDate.innerHTML = dates[slider.value];
    updateCounters();
    updatePolygonsData();
    
    if (+slider.value === dates.length - 1) {
      playButton.innerHTML = '播放';
      world.controls().autoRotate=false;
      //world.controls().autoRotateSpeed=5;
      clearInterval(interval);
    }
  }, 200);
});

if ('oninput' in slider) {
  slider.addEventListener(
    'input',
    function () {
      updateCounters();
      updatePolygonsData();
    },
    false
  );
}

// Responsive globe
window.addEventListener('resize', (event) => {
  world.width([event.target.innerWidth]);
  world.height([event.target.innerHeight]);
});

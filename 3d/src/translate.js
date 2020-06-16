

export function toChina(name)
{
  var CN_COUNTRIES={};
  WORLD_COUNTRIES.forEach(element => {
  CN_COUNTRIES[element.name]=element.translation;
});
  name=toUpperCase(name);
  console.log(name);
  if(CN_COUNTRIES.hasOwnProperty(name))
  {
    return CN_COUNTRIES[name];
  }
  else{
    return name;
  }
}



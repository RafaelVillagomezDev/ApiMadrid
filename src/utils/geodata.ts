

interface GeoData {
  address: string;
  latitud:string;
  longitud:string;
  country:string;
  county:string;
  town:string;
}


const getCoords = (address: string): Promise<GeoData> => {
    const key=process.env.APIGEODATA;
    return new Promise((resolve, reject) => {
      fetch(`https://api.opencagedata.com/geocode/v1/json?q=${address}&key=${key}`)
        .then((response) => response.json())
        .then((data) => {
          
          if (data["results"].length>0) {

            const geoData={
                latitud:data["results"][0].geometry.lat,
                longitud:data["results"][0].geometry.lng,
                address:data["results"][0].formatted,
                country:data["results"][0].components.country,
                county:data["results"][0].components.county,
                town:data["results"][0].components.town
            }
          
            resolve(geoData);
          } else {
            reject(new Error('No se encontraron coordenadas'));
          }
        })
        .catch((error) => {
          reject(error); 
        });
    });
  };
 
export { getCoords };

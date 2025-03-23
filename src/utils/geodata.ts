

interface GeoData {
  address: string;
  latitud:string;
  longitud:string;
  
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
                longitud:data["results"][0].geometry.lng
            }

            resolve({
              latitud: geoData.latitud,
              longitud: geoData.longitud,
              address: address,
            });
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

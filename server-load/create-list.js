const fs = require('fs'),
  fetch = require('node-fetch'),
  api = require('./api-creds');

const images = `https://${api.key}:${api.secret}@${api.url}/image?max_results=500`;

// Cloudinary processing parameters
const imgParam = "c_fit,f_auto,h_1280,w_1280/";

const processParam = (filename) => {
  let insertPos = filename.indexOf('upload/') + 7;
  filename = filename.slice(0, insertPos) + imgParam + filename.slice(insertPos);
  return filename;
}

const fetchItems = async () => {
  try {
    let links = [];
    const apiCall = await fetch(images);
    const json = await apiCall.json();
    const resources = (json) => {
      for (item of json.resources) {
        let filename = item.secure_url;
        if (filename.endsWith('.json')) { 
          continue;
        } else if (filename.endsWith('.jpg')) {
          links.push(processParam(filename));
        } else {
          links.push(filename);
        }
      };
      return links
    }
    const arr = await resources(json);
    await fs.writeFile(`../data/images.json`, JSON.stringify(arr), (err) => {  
      if (err) throw err;
      console.log('saved!');
    });

  } catch(error) {
    console.log("Error:", error);
  }
};

fetchItems(images);
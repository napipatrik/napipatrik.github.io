const patrikFn = require('./assets/js/functions');
const patrikok = require('./assets/js/patrikok');

const args = process.argv.slice(2);


let index = patrikFn.getDefaultOffset() % patrikok.length;
if (args.length && args[0] === '--image') {
  (async function () {
    const Jimp = require('jimp');
    const request = require('request-promise-native');
    const fs = require('fs');

    const imageOriginal = await request({url: 'https://source.unsplash.com/600x600/?nature,calm', encoding: null});
    fs.writeFileSync('./napipatrik.jpg', imageOriginal);
    const image = await Jimp.read('./napipatrik.jpg');
    const shadow = await Jimp.read('./shadow.png');
    await image.blit(shadow, 0, 0);
    const font = await Jimp.loadFont('./assets/Serif.fnt');
    await image.print(font, 100, 250, {text: patrikok[index], alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE}, 400);
    await image.write('napipatrik.jpg');
  })();
} else if (args.length && args[0] === '--index') {
  console.log(index);
} else if (args.length && args[0] === '--rss') {
  const fs = require('fs');
  const xml2js = require('xml2js');
  
  const parser = new xml2js.Parser();
  fs.readFile(__dirname + '/rss.xml', function(err, data) {
    parser.parseString(data, function (err, rss) {
      rss.rss.channel[0].lastBuildDate = (new Date()).toDateString();
      rss.rss.channel[0].item.unshift({
        title: [patrikok[index]],
        description: [patrikok[index]],
        link: ['https://napipatrik.hu/#' + index],
        pubDate: [(new Date()).toDateString()]
      });
      rss.rss.channel[0].item = rss.rss.channel[0].item.slice(0, 10);

      builder = new xml2js.Builder();
      const output = builder.buildObject(rss);
      console.log(output);
    });
});
} else {
  console.log(patrikok[index]);
}


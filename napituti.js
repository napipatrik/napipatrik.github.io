const patrikFn = require('./assets/js/functions');
const patrikok = require('./assets/js/patrikok');

const args = process.argv.slice(2);


let index = process.env.NAPIPATRIK_ID ? process.env.NAPIPATRIK_ID : patrikFn.getDefaultOffset() % patrikok.length;
let napituti = patrikok[index];
let imageTags = 'nature,calm,forest';

if ((new Date()).getMonth() === 2 && (new Date()).getDate() === 17) {
  index = 'nameday-special';
  napituti = 'Boldog névnapot Művész Úr!';
  imageTags = 'muffin,donut';
}
if ((new Date()).getMonth() === 6 && (new Date()).getDate() === 15) {
  index = 'birthday-special';
  napituti = 'Boldog születésnapot Művész Úr!';
  imageTags = 'cake';
}

if (args.length && args[0] === '--image') {
  (async function () {
    const Jimp = require('jimp');
    const fetch = require('node-fetch');
    const fs = require('fs');
    const util = require('util');
    const stream = require('stream');
    const streamPipeline = util.promisify(stream.pipeline);

    const text = napituti;
    const lines = Math.ceil(text.length / 28);

    const response = await fetch('https://source.unsplash.com/600x600/?' + imageTags);
    if (!response.ok) {
      throw new Error(`unexpected response ${response.statusText}`);
    }
    await streamPipeline(response.body, fs.createWriteStream('./napipatrik.jpg'));
    const image = await Jimp.read('./napipatrik.jpg');
    const shadow = await Jimp.read(lines < 4 ? './shadow.png' : './shadow_thick.png');
    await image.blit(shadow, 0, 0);
    const font = await Jimp.loadFont('./assets/Serif.fnt');
    await image.print(font, 100, 300 - lines * 22, {text: text, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE}, 400);
    await image.write('napipatrik.jpg');
  })();
} else if (args.length && args[0] === '--index') {
  process.stdout.write("" + index);
} else if (args.length && args[0] === '--rss') {
  const fs = require('fs');
  const xml2js = require('xml2js');

  const parser = new xml2js.Parser();
  fs.readFile(__dirname + '/rss.xml', function (err, data) {
    parser.parseString(data, function (err, rss) {
      rss.rss.channel[0].lastBuildDate = (new Date()).toDateString();
      rss.rss.channel[0].item.unshift({
        title: [napituti],
        description: [napituti],
        link: ['https://napipatrik.hu/' + index + '/'],
        pubDate: [(new Date()).toDateString()]
      });
      rss.rss.channel[0].item = rss.rss.channel[0].item.slice(0, 10);

      builder = new xml2js.Builder();
      const output = builder.buildObject(rss);
      console.log(output);
    });
  });
} else {
  console.log(napituti);
}


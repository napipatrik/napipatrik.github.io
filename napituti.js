const patrikFn = require('./assets/js/functions');
const tutik = require('./assets/js/patrikok');

const args = process.argv.slice(2);


let index = process.env.NAPIPATRIK_ID ? process.env.NAPIPATRIK_ID : patrikFn.getDefaultOffset() % tutik.length;
let napituti = tutik[index];
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
  const xml2js = require('xml2js');

  const parser = new xml2js.Parser();
  fetch('https://napipatrik.hu/rss.xml')
    .then(response => {
      if (!response.ok) {
        console.error('Unable to request rss.xml!');
        process.exit(10);
      }

      return response.blob();
    })
    .then(blob => {
      return blob.text();
    })
    .then(data => {
      parser.parseString(data, function (err, rss) {
        if (err) {
          console.error('Unable to parse rss.xml!');
          process.exit(11);
        }

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
    })
    .catch(err => {
      console.error(err);
      process.exit(10);
    });
} else if (args.length && args[0] === '--publish-mastodon') {
  const fs = require('fs');
  const {createRestAPIClient} = require('masto');

  if (!process.env.MASTODON_TOKEN) {
    console.error('Missing Mastodon API token!');
    return;
  }

  (async function () {
    const masto = createRestAPIClient({
      url: 'https://mastodon.social',
      accessToken: process.env.MASTODON_TOKEN,
    })

    const attachment = await masto.v2.media.create({
      file: new Blob([fs.readFileSync(__dirname + '/napipatrik.jpg')]),
      description: napituti,
    });

    const status = await masto.v1.statuses.create({
      status: 'Napi Patrik #napipatrik #napidevops',
      visibility: 'public',
      mediaIds: [attachment.id],
    });
  })();
} else {
  console.log(napituti);
}

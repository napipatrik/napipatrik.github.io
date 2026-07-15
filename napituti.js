const patrikFn = require('./assets/js/functions');
const tutik = require('./assets/js/patrikok');
const fs = require("fs");

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
    const {Jimp, loadFont, HorizontalAlign, VerticalAlign} = require('jimp');
    const fs = require('fs');

    const text = napituti;
    const lines = Math.ceil(text.length / 28);

    let responseImg = await fetch('https://source.unsplash.com/600x600/?' + imageTags);
    if (process.env.PEXELS_API_KEY && !responseImg.ok) {
      console.log("Unspash failed, trying Pexels...");
      const response = await fetch('https://api.pexels.com/v1/search?per_page=1&query=' + imageTags, {
        headers: {
          'Authorization': process.env.PEXELS_API_KEY
        },
      });
      if (!response.ok) {
        throw new Error(`unexpected response ${response.statusText}`);
      }
      const page = await response.json();
      responseImg = await fetch(page.photos[0].src.original + '?auto=compress&cs=tinysrgb&h=600&w=600&fit=crop', {
        headers: {
          'Authorization': process.env.PEXELS_API_KEY
        },
      });
    }
    if (responseImg.ok) {
      fs.writeFileSync('./napipatrik.jpg', Buffer.from(await responseImg.arrayBuffer()));
    } else {
      throw new Error(`unexpected response ${responseImg.statusText}`);
    }

    const image = await Jimp.read('./napipatrik.jpg');
    const shadow = await Jimp.read(lines < 4 ? './shadow.png' : './shadow_thick.png');
    await image.blit({src: shadow, x: 0, y: 0});
    const font = await loadFont('./assets/Serif.fnt');
    image.print({
      font,
      x: 100,
      y: 300 - lines * 22,
      text: {text: text, alignmentX: HorizontalAlign.CENTER, alignmentY: VerticalAlign.MIDDLE},
      maxWidth: 400,
    });
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

      return response.text();
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

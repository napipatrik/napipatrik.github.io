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
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
    await image.print(font, 100, 250, {text: patrikok[index], alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE}, 400);
    await image.write('napipatrik.jpg');
  })();
} else if (args.length && args[0] === '--index') {
  console.log(index);
} else {
  console.log(patrikok[index]);
}


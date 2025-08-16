const fs = require('fs');
const path = require('path');

const mediaJsonPath = path.join(__dirname, '../media_source/media');
const destDir = path.join(__dirname, '../media_destination');
const templatePath = path.join(__dirname, 'template.html');
const outputHtmlPath = path.join(destDir, 'index.html');

function getExtension(filename) {
  return path.extname(filename).toLowerCase();
}

function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function buildCardsHtml(media) {
  const ids = Object.keys(media).map(Number).sort((a, b) => a - b);
  let html = '';
  let row = [];
  for (let i = 0; i < ids.length; i += 2) {
    const evenId = ids[i];
    const oddId = ids[i + 1];
    const evenExt = media[evenId] ? media[evenId].match(/\.[^.]+$/)[0] : '';
    const oddExt = media[oddId] ? media[oddId].match(/\.[^.]+$/)[0] : '';
    const cardHtml = `<div class="anki-card shadcn-card">
      <div class="card-top">${evenId !== undefined ? `<img src=\"${evenId}${evenExt}\" alt=\"${evenId}\">` : ''}</div>
      <div class="card-bottom">${oddId !== undefined ? `<img src=\"${oddId}${oddExt}\" alt=\"${oddId}\">` : ''}</div>
    </div>`;
    row.push(cardHtml);
    if (row.length === 4 || i + 2 >= ids.length) {
      html += `<div class="anki-row">${row.join('\n')}</div>\n`;
      row = [];
    }
  }
  return html;
}

function main() {
  let media;
  try {
    media = JSON.parse(fs.readFileSync(mediaJsonPath, 'utf8'));
  } catch (err) {
    console.error('Failed to read or parse media JSON:', err);
    process.exit(1);
  }

  ensureDirSync(destDir);

  let template = fs.readFileSync(templatePath, 'utf8');
  const cardsHtml = buildCardsHtml(media);
  template = template.replace('<!-- ANKI_CARDS_PLACEHOLDER -->', cardsHtml);
  fs.writeFileSync(outputHtmlPath, template, 'utf8');
  console.log(`Static HTML generated at ${outputHtmlPath}`);
}

main();

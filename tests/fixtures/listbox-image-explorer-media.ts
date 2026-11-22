/** Keep browser image decoding and pinned visual captures on one fixture. */
export const imageFixtureWidth = 400;
export const imageFixtureHeight = 300;
export const imageFixtureSvg =
  `<svg xmlns="http://www.w3.org/2000/svg" width="${imageFixtureWidth}" height="${imageFixtureHeight}">` +
  `<rect width="${imageFixtureWidth}" height="${imageFixtureHeight}" fill="#6b8f71"/></svg>`;
export const imageFixtureDataUrl = `data:image/svg+xml,${encodeURIComponent(imageFixtureSvg)}`;

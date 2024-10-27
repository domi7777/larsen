export const FontFamily = {
  Icons: 'Icons', // source: https://fonts.google.com/icons
  Text: 'Courier',
}

export const loadFonts = async() =>  {
  const newFontFace = new FontFace(FontFamily.Icons, 'url(./fonts/material.woff2)');
  document.fonts.add(newFontFace);
  return newFontFace.load().catch(error => console.error(error));
}

export const FontFamily = {
  Material: 'Material', // source: https://fonts.google.com/icons
  Arial: 'Arial',
}

export const loadFonts = async() =>  {
  const newFontFace = new FontFace(FontFamily.Material, 'url(./fonts/material.woff2)');
  document.fonts.add(newFontFace);
  return newFontFace.load().catch(error => console.error(error));
}

export const FontFamily = {
  Icons: 'Icons', // source: https://fonts.google.com/icons
  Text: 'Verdana, Geneva, sans-serif',
}

export const FontSize = {
  tiny: '15px',
  small: '30px',
  medium: '50px',
  big: '90px'
}

export const FontColor = {
  white: '#FFF',
}

export const loadFonts = async () => {
  const newFontFace = new FontFace(FontFamily.Icons, 'url(./fonts/material.woff2)');
  document.fonts.add(newFontFace);
  return newFontFace.load().catch(error => console.error(error));
}

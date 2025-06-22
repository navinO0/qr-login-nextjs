function getRandomColor() {
  const letters = '0123456789ABCDEF';

  function generateColor() {
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function isTooLight(hex) {
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 240; // adjust this threshold as needed
  }

  let color = generateColor();
  while (isTooLight(color)) {
    color = generateColor();
  }

  return color;
}

export default getRandomColor;
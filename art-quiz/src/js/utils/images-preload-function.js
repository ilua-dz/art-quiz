const preloadImages = (sources, callback) => {
  let counter = 0;

  function onload() {
    counter += 1;
    if (counter === sources.length) callback();
  }

  sources.forEach((source) => {
    const img = document.createElement('img');
    img.onload = onload;
    img.src = source;
  });
};

export default preloadImages;

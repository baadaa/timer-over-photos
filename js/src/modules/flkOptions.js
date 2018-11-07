const imgOptions = {
  cellAlign: 'center',
  contain: true,
  imagesLoaded: true,
  percentPosition: false,
  wrapAround: true,
  autoPlay: 5000,
  bgLazyLoad: true,
  bgLazyLoad: 2,
  pauseAutoPlayOnHover: false,
  on: {
    ready() {
      document.querySelector('.preloader').style.display = 'none';
    }
  }
}
const vidOptions = {
  cellAlign: 'center',
  contain: true,
  imagesLoaded: true,
  percentPosition: false,
  wrapAround: true,
  autoPlay: false,
  pauseAutoPlayOnHover: false
}

export { imgOptions, vidOptions };
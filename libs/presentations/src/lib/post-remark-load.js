let initialized = false;

// eslint-disable-next-line no-undef
remark
  // eslint-disable-next-line no-undef
  .create({ source: `${md}`, ratio: '16:9' })
  .on('showSlide', function (slide) {
    if (initialized) return;
    initialized = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target instanceof HTMLVideoElement) {
            if (entry.isIntersecting) {
              entry.target.play();
              entry.target.currentTime = 0;
            } else if (!entry.isIntersecting) {
              entry.target.pause();
            }
          } else if (entry.target instanceof HTMLImageElement) {
            if (entry.isIntersecting && entry.target.src.endsWith('.gif')) {
              entry.target.src = entry.target.getAttribute('src');
            }
          }
        });
      },
      {
        rootMargin: '0px',
        threshold: 0.95,
        root: document.querySelector('.remark-visible'),
      }
    );
    document.querySelectorAll('video,img').forEach((el) => {
      observer.observe(el);
    });
  });

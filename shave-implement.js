$(document).ready(function () {
    const $wraps = $('.wrap');
    const start = Date.now();
    shave('p', '30px');
    const end = Date.now();
    const elapsed = end - start;
    $('h2').text(`It took ${elapsed} ms to clamp ${$wraps.length} paragraphs`);
});

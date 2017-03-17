$(document).ready(function () {
    const start = Date.now();
    const $wraps = $('.wrap');

    $wraps.each(function () {
        const $ellipsisClamp = $(this);
        const $ellipsisOverflow = $ellipsisClamp.find('p');
        if ($ellipsisOverflow.height() > $ellipsisClamp.height()) {
            $ellipsisClamp.addClass('ellipsis-on');
        }
    });

    const end = Date.now();
    const elapsed = end - start;

    $('h2').text(`It took ${elapsed} ms to clamp ${$wraps.length} paragraphs`);
});

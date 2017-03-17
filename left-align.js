$(document).ready(function () {
    const start = Date.now();
    const $wraps = $('.wrap');
    const contentLengths = [];

    $wraps.each(function () {
        const $ellipsisClamp = $(this);
        const $ellipsisOverflow = $ellipsisClamp.find('p');
        const clampHeight = $ellipsisClamp.height();
        let overflowHeight = $ellipsisOverflow.height();

        if (overflowHeight > clampHeight) {
            let content = $ellipsisOverflow.html() + '…';
            let contentLength = content.length;

            while (contentLength > 0) {
                const contentHeight = overflowHeight;
console.info(contentLength);
                content = content.slice(0, -2) + '…';
                contentLength = content.length;
console.info(contentLength);
                $ellipsisOverflow.html(content);

                overflowHeight = $ellipsisOverflow.height();
                if (overflowHeight <= clampHeight) {
console.info('breaking at ' + contentLength);
                    break;
                }
            }

            return;
        }
    });

    const end = Date.now();
    const elapsed = end - start;

    $('h2').text(`It took ${elapsed} ms to clamp ${$wraps.length} paragraphs`);
});

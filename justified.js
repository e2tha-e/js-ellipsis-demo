var start = Date.now();
var d = document;
var ellipsisClamps = d.querySelectorAll('.ellipsis-clamp');

function lengthToNumber(length) {
    var number = parseFloat(length.replace(/([\d\.]*)/, '$1'));
    return number;
}

for (var i = 0; i < ellipsisClamps.length; i++) {
    var ellipsisClamp = ellipsisClamps[i];
    var ellipsisOverflow = ellipsisClamp.querySelector('.ellipsis-overflow');

    var ellipsisClampStyles = window.getComputedStyle(ellipsisClamp);
    var clampHeight = ellipsisClampStyles.getPropertyValue('height');
    var clampHeightNum = lengthToNumber(clampHeight);

    var ellipsisOverflowStyles = window.getComputedStyle(ellipsisOverflow);
    var overflowHeight = ellipsisOverflowStyles.getPropertyValue('height');
    var overflowHeightNum = lengthToNumber(overflowHeight);

    if (overflowHeightNum > clampHeightNum) {
        ellipsisClamp.classList.add('ellipsis-on');
    }
}

var end = Date.now();
var elapsed = end - start;

d.querySelector('h2').innerHTML = `took ${elapsed} ms to clamp ${ellipsisClamps.length} paragraphs`;

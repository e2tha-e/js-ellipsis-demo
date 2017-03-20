const start = Date.now();
const d = document;
const ellipsisClamps = d.querySelectorAll('.ellipsis-clamp');

function lengthToNumber(length) {
    const number = parseFloat(length.replace(/([\d\.]*)/, '$1'));
    return number;
}

for (let i = 0; i < ellipsisClamps.length; i++) {
    const ellipsisClamp = ellipsisClamps[i];
    const ellipsisOverflow = ellipsisClamp.querySelector('.ellipsis-overflow');

    const ellipsisClampStyles = window.getComputedStyle(ellipsisClamp);
    const clampHeight = ellipsisClampStyles.getPropertyValue('height');
    const clampHeightNum = lengthToNumber(clampHeight);

    const ellipsisOverflowStyles = window.getComputedStyle(ellipsisOverflow);
    const overflowHeight = ellipsisOverflowStyles.getPropertyValue('height');
    const overflowHeightNum = lengthToNumber(overflowHeight);

    if (overflowHeightNum > clampHeightNum) {
        ellipsisClamp.classList.add('ellipsis-on');
    }
}

const end = Date.now();
const elapsed = end - start;

d.querySelector('h2').innerHTML = `It took ${elapsed} ms to clamp ${ellipsisClamps.length} paragraphs`;

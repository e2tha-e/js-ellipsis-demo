var start = Date.now();
var d = document;
var contentLengths = [];
var lengthUnit = '';
var leftAlignFail = false;
var ellipsisClamps = d.querySelectorAll('.ellipsis-clamp');

function checkForConsistentLengthUnits(length) {
    if (typeof length === 'string' && /\d/.test(length[0])) {
        var lengthUnitNew = length.replace(/[\d\.]*/, '');
        if (!lengthUnit) {
            lengthUnit = lengthUnitNew;
            return true;
        } else if (lengthUnitNew === lengthUnit) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function lengthToNumber(length) {
    if (leftAlignFail) {
        return null;
    }
    if (checkForConsistentLengthUnits(length)) {
        var number = parseFloat(length.replace(/([\d\.]*)/, '$1'));
        return number;
    } else {
        leftAlignFail = true;
        return null;
    }
}

for (var i = 0; i < ellipsisClamps.length; i++) {
    var ellipsisClamp = ellipsisClamps[i];
    var ellipsisOverflow = ellipsisClamp.querySelector('.ellipsis-overflow');

    var ellipsisClampStyles = window.getComputedStyle(ellipsisClamp);
    var clampWidth = ellipsisClampStyles.getPropertyValue('width');
    var clampWidthNum = lengthToNumber(clampWidth);

    if (!clampWidthNum) {
        leftAlignFail = true;
    }

    var clampHeight = ellipsisClampStyles.getPropertyValue('height');
    var clampHeightNum = lengthToNumber(clampHeight);

    if (!clampHeightNum) {
        leftAlignFail = true;
    }

    var clampFontSize = ellipsisClampStyles.getPropertyValue('font-size');
    var clampFontSizeNum = lengthToNumber(clampFontSize);

    if (!clampFontSizeNum) {
        leftAlignFail = true;
    }

    var clampLineHeight = ellipsisClampStyles.getPropertyValue('line-height');
    var clampLineHeightNum = lengthToNumber(clampLineHeight);

    if (!clampLineHeightNum) {
        leftAlignFail = true;
    }

    var ellipsisOverflowStyles = window.getComputedStyle(ellipsisOverflow);
    var overflowHeight = ellipsisOverflowStyles.getPropertyValue('height');
    var overflowHeightNum = lengthToNumber(overflowHeight);

    if (!overflowHeightNum) {
        leftAlignFail = true;
    }

    var charLimit = Math.round((clampWidthNum * 2 / clampFontSizeNum) * (clampHeightNum / clampLineHeightNum));

    if (overflowHeightNum > clampHeightNum) {
        if (leftAlignFail) {
            ellipsisClamp.classList.add('ellipsis-on');
        } else {
            var innerHTML = ellipsisOverflow.innerHTML.slice(0, charLimit);
            if (innerHTML.lastIndexOf(' ') > -1) {
                innerHTML = innerHTML.slice(0, innerHTML.lastIndexOf(' '));
            } else {
                continue;
            }
            innerHTML = innerHTML + '\u2026';
            ellipsisOverflow.innerHTML = innerHTML;

            overflowHeight = ellipsisOverflowStyles.getPropertyValue('height');
            overflowHeightNum = lengthToNumber(overflowHeight);

            while (overflowHeightNum > clampHeightNum) {
                if (innerHTML.lastIndexOf(' ') > -1) {
                    innerHTML = innerHTML.slice(0, innerHTML.lastIndexOf(' '));
                    innerHTML = innerHTML + '\u2026';
                    ellipsisOverflow.innerHTML = innerHTML;

                    overflowHeight = ellipsisOverflowStyles.getPropertyValue('height');
                    overflowHeightNum = lengthToNumber(overflowHeight);
                } else {
                    break;
                }
            }
        }
    }
}

var end = Date.now();
var elapsed = end - start;

d.querySelector('h2').innerHTML = `took ${elapsed} ms to clamp ${ellipsisClamps.length} paragraphs`;

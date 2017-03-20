'use strict';

const fs = require('fs');
const loremIpsum = require('lorem-ipsum');
const path = require('path');

function prefix(file) {
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="style.css" rel="stylesheet">
<script src="jquery.min.js"></script>
</head>
<body>
<header>
<h2></h2>
</header>
<main>
`;
    fs.writeFileSync(file, html);
}

function hundredParagraphs(file) {
    let html = '';
    for (let i = 0; i < 100; i++) {
        html += '<div class="ellipsis-clamp"><p class="ellipsis-overflow">';
        html += loremIpsum({
            count: 1,
            units: 'sentences'
        });
        html += '</p></div>';
    }
    fs.appendFileSync(file, html);
}

function suffix(file) {
    const html = `
</main>
<script src="${path.basename(file, '.html')}.js"></script>
</body>
</html>
`;
    fs.appendFileSync(file, html);
}

function process(file) {
    prefix(file);
    hundredParagraphs(file);
    suffix(file);
}

process('justified.html');
process('left-aligned.html');
process('shaved.html');

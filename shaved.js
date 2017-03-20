const start = Date.now();
shave('.ellipsis-overflow', '30px');
const end = Date.now();
const elapsed = end - start;
const ellipsisClamps = document.querySelectorAll('.ellipsis-clamp');
document.querySelector('h2').innerHTML = `took ${elapsed} ms to clamp ${ellipsisClamps.length} paragraphs`;

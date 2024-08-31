'use strict';
 
// using import

import WebTorrent from "webtorrent-hybrid";
import fs from "fs";
import cliProgress from 'cli-progress';
import colors from 'ansi-colors';

function plusSlides(torrent){
    const torrentId = torrent;
 //const torrentId = process.argv[2];
 console.log("Torrent Id:- \t"+torrentId);
 const client = new WebTorrent();

// const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const bar = new cliProgress.SingleBar({
    format: 'CLI Progress |' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total} Chunks || Speed: speed',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
});

bar.start(100,0);
 
client.add(torrentId, torrent => {
const files = torrent.files;
let length = files.length;
console.log("Number of files:- \t"+length);

let interval = setInterval(() => {
// console.log("Progress : "+(torrent.progress * 100).toFixed()+ "%");
bar.update((torrent.progress * 100));
}, 3000);
files.forEach(file => {
    const source = file.createReadStream();
    const destination = fs.createWriteStream(file.name);
source.on('end',()=>{
console.log('file: \t\t', file.name,"downloaded successfuly");
length -= 1;
if(!length){ 
    bar.stop();
    console.log("completed");
    clearInterval(interval);
    process.exit();
}
}).pipe(destination);

});



    
 });
}
export { plusSlides };
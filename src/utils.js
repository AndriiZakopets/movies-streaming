import ffprobeStatic from 'ffprobe-static';
import readline from 'readline-sync';
import ffprobe from 'ffprobe';
import chalk from 'chalk';
import path from 'path';
import url from 'url';
import fs from 'fs';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function selectOption(question, arr, printFn) {
  arr.forEach((el, i) => {
    const chalkFn = i % 2 ? chalk.bgYellow : chalk.bgBlue;
    printFn(el, i, chalkFn);
  });
  const userQuery = readline.question(question);
  const selectedIndex = parseInt(userQuery);
  const selectedOption = arr[selectedIndex];
  return selectedOption;
}

export async function exitWithMessage(message) {
  console.log(chalk.blue.bgRed(message));
  process.exit(1);
}

export function getVideoPath(filename) {
  return path.join(__dirname, '../public', filename);
}

export async function getMkvFiles() {
  const allFiles = await new Promise((res) => {
    fs.readdir(path.join(__dirname, '../public'), function (err, files) {
      if (err) return [];
      else res(files);
    });
  });
  const mkvFiles = allFiles.filter((file) => /^\S*\.mkv$/.test(file));
  return mkvFiles;
}

export async function selectFile() {
  const files = await getMkvFiles();
  console.log('Files with whitespace in name won\'t appear')
  return selectOption('Enter file index from list above . . . ', files, (file, i, chalkFn) => {
    console.log(chalkFn(`${i}. ${file}`));
  });
}

export async function getFileStreams(filename, type) {
  const filePath = getVideoPath(filename);
  try {
    const { streams } = await ffprobe(filePath, { path: ffprobeStatic.path });
    return streams.filter((stream) => stream.codec_type === type);
  } catch (e) {
    exitWithMessage('Error reading file streams');
  }
}

export async function selectVideoStream(filename) {
  const streams = await getFileStreams(filename, 'video');
  if (streams.length === 0) exitWithMessage('Video streams not found');
  if (streams.length === 1) return streams[0];
  return selectOption('Enter video stream index from list above . . . ', streams, (stream, i, chalkFn) => {
    console.log(chalkFn(`index: ${i}`));
    console.log(chalkFn(`codec: ${stream.codec_name}`));
    console.log(chalkFn(`resolution: ${stream.width}x${stream.height}`));
  });
}

export async function selectAudioStream(filename) {
  const streams = await getFileStreams(filename, 'audio');
  if (streams.length === 0) exitWithMessage('Audio streams not found');
  if (streams.length === 1) return streams[0];
  return selectOption('Enter audio stream index from list above . . . ', streams, (stream, i, chalkFn) => {
    console.log(chalkFn(`index: ${i}`));
    console.log(chalkFn(`language: ${stream.tags?.language}`));
    console.log(chalkFn(`title: ${stream.tags?.title}`));
  });
}

export async function selectVideoName() {
  const userQuery = readline.question('Enter video name . . . ');
  const name = /\.mp4$/.test(userQuery) ? userQuery : `${userQuery}.mp4`;
  return getVideoPath(name);
}

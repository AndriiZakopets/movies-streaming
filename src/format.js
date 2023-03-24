import ffmpeg from 'ffmpeg';
import { exitWithMessage, getVideoPath, selectFile, selectVideoStream, selectAudioStream, selectVideoName } from './utils.js';

async function formatFile() {
  const file = await selectFile();
  if (!file) exitWithMessage('Wrong index');
  const videoStream = await selectVideoStream(file);
  const audioStream = await selectAudioStream(file);
  const inputPath = getVideoPath(file);
  const outputPath = await selectVideoName();
  const video = await new ffmpeg(inputPath);
  video.addCommand(`-c:v copy -c:a libmp3lame -map 0:${audioStream.index} -map 0:${videoStream.index} -t 00:01:00`);
  video.save(`"${outputPath}"`, (err) => {
    if (err) throw err;
    console.log('success');
  });
}

await formatFile();

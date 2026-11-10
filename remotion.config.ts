import {Config} from '@remotion/cli/config';

// Lossless intermediate frames, 4K output via --scale=2 on a 1920x1080 / 60 fps composition.
Config.setVideoImageFormat('png');
Config.setEntryPoint('src/index.ts');
Config.setConcurrency(4);
// Use the preinstalled headless shell when present (no download needed).
if (process.env.REMOTION_CHROME) Config.setBrowserExecutable(process.env.REMOTION_CHROME);


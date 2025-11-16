export type AudioFrameData = {
    audioFrame: Float32Array,
    audioFrameShape: vec3,
}

export type AudioRecording = AudioFrameData[];

export function flattenAudioRecording(frames: AudioRecording): Float32Array {
    const len = frames.reduce((acc, f) => acc + f.audioFrameShape.x, 0);
    const out = new Float32Array(len);
    
    let offset = 0;
    for (const frame of frames) {
      out.set(frame.audioFrame.slice(0, frame.audioFrameShape.x), offset);
      offset += frame.audioFrameShape.x;
    }
    return out;
}

export function expandAudioRecording(pcm: Float32Array): AudioRecording {
    return [{
        audioFrame: pcm,
        audioFrameShape: new vec3(pcm.length, 1, 1)
    }];
}
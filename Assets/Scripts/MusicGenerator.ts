import { Lyria } from "RemoteServiceGateway.lspkg/HostedExternal/Lyria";
import { SAMPLE_RATE } from "./Audio";

export class MusicGenerator {
    private static readonly INSTRUMENTS = [
        "Guitar",
        "Piano",
        "Accordion",
        "Violin",
        "Drums",
        "Saxophone",
        "Bass",
        "Flute",
        "Trumpet",
        "Synthesizer",
        "Cello",
        "Harp",
        "Banjo",
        "Clarinet",
        "Ukulele",
        "Trombone",
        "Xylophone",
        "Organ",
        "Harmonica",
        "Mandolin",
        "Bongos",
        "Oboe",
        "Electric Guitar",
        "Tambourine",
        "Marimba",
        "Bagpipes",
        "Sitar",
        "Theremin",
        "Steel Drums",
        "Kalimba",
        "Djembe",
        "Keytar",
        "Harpsichord",
        "Viola",
        "Bassoon",
    ];

    private static readonly GENRES = [
        "Jazz",
        "Chiptune",
        "Hyperpop",
        "Rock",
        "Pop",
        "Hip Hop",
        "R&B",
        "Electronic",
        "Classical",
        "Country",
        "Metal",
        "Blues",
        "Reggae",
        "Folk",
        "Indie",
        "Punk",
        "Soul",
        "Funk",
        "Disco",
        "Techno",
        "House",
        "Dubstep",
        "Ambient",
        "Lofi",
        "Trap",
        "Latin",
        "K-Pop",
        "J-Pop",
        "EDM",
        "Alternative",
        "Grunge",
        "Synthwave",
        "Afrobeat",
        "Experimental",
    ];

    private static readonly SILENCE_DURATION = 10;

    static async generateRandomTrack(): Promise<Float32Array> {
        const instrument = this.INSTRUMENTS[Math.floor(Math.random() * this.INSTRUMENTS.length)];
        const genre = this.GENRES[Math.floor(Math.random() * this.GENRES.length)];
        const prompt = `Generate a simple ${instrument} solo in the style of ${genre} (no other instruments). Don't add fancy motifs. Make it repetitive.`;

        console.log(`Generating music with prompt: "${prompt}"`);

        const req = {
            model: "lyria-002",
            type: "predict",
            body: {
                instances: [{
                    prompt,
                }],
                parameters: {
                    sample_count: 1,
                },
            },
        };

        try {
            const res = await Lyria.performLyriaRequest(req);
            if (!res?.predictions?.length || !res?.predictions[0]?.bytesBase64Encoded) {
                return new Float32Array(this.SILENCE_DURATION * SAMPLE_RATE);
            }

            const b64 = res.predictions[0].bytesBase64Encoded;
            const pcmStereoRaw = Base64.decode(b64);
            const pcmStereo16bit = new DataView(pcmStereoRaw.buffer);
            const pcmMonoFloat = new Float32Array(pcmStereoRaw.length / 4);

            for (let i = 0; i < pcmMonoFloat.length; i++) {
                const a = pcmStereo16bit.getInt16(i * 4, true) / 32768;
                const b = pcmStereo16bit.getInt16(i * 4 + 2, true) / 32768;

                pcmMonoFloat[i] = (a + b) / 2;
            }

            if (pcmMonoFloat.length > SAMPLE_RATE * 15) {
                return pcmMonoFloat.slice(0, SAMPLE_RATE * 15);
            }
            return pcmMonoFloat;
        } catch (e) {
            console.error(`Lyria error: ${e}`);

            // return silence
            return new Float32Array(this.SILENCE_DURATION * SAMPLE_RATE);
        }
    }
}
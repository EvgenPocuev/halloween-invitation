# Audio Assets Directory

The Halloween Invitation application supports custom soundtrack and audio effects.

Place your custom audio files in this directory with the following exact filenames:

* `theme.mp3` - Main cinematic gothic music theme (plays when the invitation opens)
* `ambience.mp3` - Low dark ambient background drone (plays during envelope stage)
* `seal-crack.wav` - Visceral wax fracture & snapping SFX
* `impact.wav` - Deep sub-bass boom when the seal breaks
* `bell.wav` - Ominous gothic church bell chime

## Zero-Dependency Procedural Fallback

If no audio files are added to this folder, the built-in **Web Audio API Gothic Synthesizer** (`src/audio/audioEngine.ts`) automatically generates real-time sub-drones, tension risers, visceral wax fractures, impact transients, bell overtones, and gothic chord progressions out of the box with zero external dependencies!

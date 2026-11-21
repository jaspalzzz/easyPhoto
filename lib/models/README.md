# Models

## face_landmarker.task

MediaPipe Face Landmarker (float16, version 1): the model behind every face
check on the site (lib/faceDetection.ts). The build emits it under
/_next/static/media/ with a content hash; lib/faceModelAssets.ts holds its
address.

| | |
|---|---|
| Source | https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task |
| Fetched | 21 Nov 2026 |
| Size | 3,758,596 bytes |
| SHA-256 | `64184e229b263107bc2b804c6625db1341ff2bb731874b0bcc2fe6544e0bc9ff` |
| Licence | Apache License 2.0 (https://www.apache.org/licenses/LICENSE-2.0) |
| Model card | https://developers.google.com/mediapipe/solutions/vision/face_landmarker |

The engine that runs it (the `vision_wasm_*` files) is not stored here: it
ships inside the installed `@mediapipe/tasks-vision` package and is emitted
from there, so it always matches the JavaScript API.

To update the model, replace the file and the size and SHA-256 above;
`test/faceModelAssets.test.ts` fails if they disagree.

# Tool analytics lifecycle coverage

Audited against `components/tools/*Tool.tsx`. A check means the component (or its
shared workflow engine) emits the event with the standard semantics. “Partial”
means an event exists but is missing on at least one meaningful path. A dash in
Download means the tool has no downloadable output.

| Tool component | View | Start | Success | Failure | Download | Current semantics / note |
|---|:---:|:---:|:---:|:---:|:---:|---|
| AadhaarOcrTool | ✅ | ✗ | ✅ | ✅ | — | View and OCR outcome tracked; first OCR attempt is not tracked as start. |
| AutoCropTool | ✅ | ✗ | ✅ | ✅ | ✗ | Crop outcome tracked; input/start and JPG download are not yet tracked. |
| BackgroundRemovalTool | ✅ | ✅ | ✅ | ✅ | ✅ | Input-backed auto-run starts once, then records output/failure and central download. |
| CameraCaptureTool | ✅ | ✗ | ✅ | ✗ | ✅ | Capture success and download tracked; opening/capture start and camera failure are gaps. |
| ComplianceCheckerTool | ✅ | ✅ | ✅ | ✅ | ✅ | Upload starts analysis; decode outcome tracked; fallback file save uses central download tracking. |
| CompressDocumentTool | ✅ | ✗ | ✗ | ✗ | ✗ | Only mount is tracked. |
| DpiConverterTool | ✅ | ✗ | ✅ | ✗ | ✅ | Output and download tracked; input/start and processing failure are gaps. |
| ExamPackageTool | ✅ | ✅ | ✅ | ✅ | ✅ | Exam choice starts the flow; processed kit outcome and all downloads are tracked. |
| FaceCenteringTool | ✅ | ✗ | ✅ | partial | ✗ | Outcomes exist, but start/download are absent and one failure lacks a stable reason. |
| FormFillTool | ✅ | ✗ | ✗ | ✗ | ✗ | Only mount is tracked. |
| FormatConverterTool | ✗ | ✗ | ✗ | ✗ | ✗ | No lifecycle events. |
| ImageCropTool | ✅ | ✅ | ✗ | ✗ | ✅ | Input and download tracked; generated crop output/failure are not. |
| ImageToTextTool | ✅ | ✅ | ✅ | ✅ | ✅ | OCR run and stable outcome are tracked; TXT save uses central download tracking. |
| JpgToPdfTool | ✗ | ✗ | ✗ | ✗ | ✗ | No lifecycle events. |
| LinkedInPhotoTool | ✅ | ✅ | ✅ | ✅ | ✅ | Full lifecycle tracked by the component. |
| MaskDocumentTool | ✅ | ✅ | ✗ | ✗ | ✅ | Input and save tracked; completed mask output/failure are gaps. |
| NameDatePhotoTool | ✅ | ✅ | ✅ | ✅ | ✅ | Full lifecycle tracked by the component. |
| PanCardOcrTool | ✅ | ✗ | ✅ | ✅ | — | OCR outcome tracked; first processing attempt is not tracked as start. |
| PdfCompressTool | ✅ | ✅ | ✅ | ✅ | ✅ | Compression lifecycle is complete; auto/manual saves use central download tracking. |
| PdfMergeTool | ✗ | ✗ | ✗ | ✗ | ✗ | No lifecycle events. |
| PdfPageNumbersTool | ✅ | ✅ | ✅ | ✅ | ✅ | Full lifecycle tracked; download is still locally emitted. |
| PdfReorderTool | ✗ | ✗ | ✗ | ✗ | ✗ | No lifecycle events. |
| PdfSplitTool | ✗ | ✗ | ✗ | ✗ | ✗ | No lifecycle events. |
| PdfToJpgTool | ✗ | ✗ | ✗ | ✗ | ✗ | No lifecycle events. |
| PdfToTextTool | ✅ | ✗ | ✗ | ✗ | — | Only mount is tracked; text extraction lifecycle is missing. |
| PhotoSignatureMergeTool | ✅ | ✗ | ✅ | ✗ | ✅ | Generated output and save tracked; first input/start and failure are gaps. |
| PhotoValidatorTool | ✅ | ✗ | ✅ | ✗ | — | Validation success tracked; start and validation failure are gaps. |
| PrintSheetTool | ✅ | ✗ | ✗ | ✅ | ✅ | Save failures/downloads tracked; input/start and successful render are not. |
| RedEyeTool | ✅ | ✗ | partial | ✗ | ✅ | Save currently doubles as success; input/start and processing failure are gaps. |
| RejectionPredictorTool | ✅ | ✗ | ✅ | ✅ | — | Analysis outcomes tracked; analysis start is missing. |
| ResizeDimensionsTool | ✗ | ✗ | ✗ | ✗ | ✗ | No lifecycle events. |
| ResizeKbTool | ✅ | ✅ | ✅ | ✅ | ✅ | Full lifecycle; shared download helper emits the save event. |
| SignImageTool | ✅ | ✅ | ✅ | ✅ | ✅ | First valid image starts; export output/failure and central download are tracked. |
| SignPdfTool | ✅ | ✅ | ✅ | ✅ | ✅ | PDF input starts; decode/render outcomes and central PDF download are tracked. |
| SignatureKbTool | ✅ | ✅ | ✅ | ✅ | ✅ | Full lifecycle; shared download helper emits the save event. |
| SignatureManualCropTool | ✅ | ✅ | ✅ | ✅ | ✅ | Upload starts; valid preview/failure and central download are tracked. |
| SignatureWorkflowTool | ✅ | ✅ | ✅ | ✅ | ✅ | Shared engine covers transparent, background-removal, cleaner and resize routes. |
| StraightenPhotoTool | ✅ | ✗ | ✅ | ✗ | ✅ | Output/save tracked; input/start and processing failure are gaps. |
| UnlockPdfTool | ✅ | ✅ | ✅ | ✅ | partial | Auto-save tracked locally; later manual re-download is not tracked. |
| WatermarkPdfTool | ✅ | ✅ | ✅ | ✅ | ✅ | Full lifecycle tracked; download is still locally emitted. |
| WhiteBackgroundTool | ✅ | ✅ | ✅ | ✅ | ✅ | Input-backed auto-run, generated composite, failure and central downloads are tracked. |

## Shared and non-`components/tools` coverage

- Passport maker: `components/tool/PhotoTool.tsx` emits `tool_view`; its Zustand
  processing engine emits start/success/failure, and `ExportPanel.tsx` passes the
  stable `passport-photo` slug to the central download helper.
- Signature routes: the live transparent-signature, background-removal,
  signature-cleaner and signature-resize pages use `SignatureWorkflowTool`.
- Central download contract: `downloadBlob(blob, filename, tool)` emits exactly
  one download event after the browser download click is triggered. Callers that
  have not yet passed a tool slug remain visible as gaps in the matrix rather
  than being guessed from filenames or URLs.

## Stable failure reason codes used in completed major tools

`decode`, `render`, `remove-bg`, `ocr-error`, `crop`, `photo-error`,
`signature-error`, and `compress-error`. User-facing or raw exception messages
are never sent.

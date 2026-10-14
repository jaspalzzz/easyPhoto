import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FormFillTool } from "@/components/tools/FormFillTool";
import type { FormField } from "@/lib/formFill";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

const FIELDS: FormField[] = [
  { name: "full_name", type: "Text", value: "" },
  { name: "state", type: "Dropdown", value: "", options: ["Delhi", "Punjab"] },
  { name: "gender", type: "RadioGroup", value: "", options: ["Male", "Female"] },
  { name: "agree", type: "CheckBox", value: "" },
];

vi.mock("@/lib/analytics", () => ({ track: vi.fn() }));
vi.mock("@/lib/formFill", () => ({
  loadPdfFormFields: vi.fn(async () => FIELDS),
  fillAndExport: vi.fn(),
}));

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

async function renderWithFields() {
  act(() => root.render(<FormFillTool />));
  const input = container.querySelector<HTMLInputElement>('input[type="file"]')!;
  const pdf = new File(["%PDF-1.7"], "form.pdf", { type: "application/pdf" });
  Object.defineProperty(input, "files", { value: [pdf], configurable: true });
  await act(async () => {
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

describe("Form Fill field labels", () => {
  // Screen readers announced the dropdowns with no name: their <label> was
  // not associated with the control.
  it.each([
    ["full_name", "INPUT"],
    ["state", "SELECT"],
    ["gender", "SELECT"],
    ["agree", "SELECT"],
  ])("labels the %s control", async (name, tag) => {
    await renderWithFields();
    const label = [...container.querySelectorAll("label")].find((l) => l.textContent?.startsWith(name));
    expect(label?.control?.tagName).toBe(tag);
  });

  it("gives every control a unique id", async () => {
    await renderWithFields();
    const ids = [...container.querySelectorAll("select, input[type=text]")].map((c) => c.id);
    expect(ids).toHaveLength(FIELDS.length);
    expect(new Set(ids).size).toBe(FIELDS.length);
    expect(ids.every(Boolean)).toBe(true);
  });
});

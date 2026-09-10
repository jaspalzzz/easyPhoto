import * as React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useNumericField } from "@/components/tool/useNumericField";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

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

/** Harness exposing a single numeric field plus the value it has committed. */
function Harness({ min, max }: { min?: number; max?: number }) {
  const [value, setValue] = React.useState(50);
  const field = useNumericField(value, setValue, { min, max });
  return (
    <>
      <input aria-label="field" type="text" {...field} />
      <output data-testid="committed">{value}</output>
    </>
  );
}

function input(): HTMLInputElement {
  return container.querySelector("input")!;
}
function committed(): string {
  return container.querySelector("output")!.textContent ?? "";
}

const nativeSetter = () =>
  Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")!.set!;

/** One keystroke: React only sees the change via the native setter + input event. */
function typeInto(el: HTMLInputElement, next: string) {
  act(() => {
    nativeSetter().call(el, next);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

/** React binds onBlur to focusout, which bubbles. A plain "blur" event won't do. */
function blur(el: HTMLInputElement) {
  act(() => {
    el.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
  });
}

describe("useNumericField", () => {
  it("lets you type a value whose first digit is below the minimum", () => {
    // The reported bug: with a floor of 5, clamping per keystroke turned the
    // leading "1" of "100" into "5", so 100 and 200 could never be entered
    // while 500 and 54 worked.
    act(() => root.render(<Harness min={5} />));
    const el = input();

    typeInto(el, "");
    typeInto(el, "1");
    typeInto(el, "10");
    typeInto(el, "100");

    expect(el.value).toBe("100");
    expect(committed()).toBe("100");
  });

  it("allows the field to be emptied while editing instead of snapping back", () => {
    act(() => root.render(<Harness min={1} />));
    const el = input();

    typeInto(el, "");

    // Still empty: backspacing to nothing is a legitimate mid-edit state.
    expect(el.value).toBe("");
    // The committed value is left alone until blur decides.
    expect(committed()).toBe("50");
  });

  it("clamps an empty field up to the minimum on blur", () => {
    act(() => root.render(<Harness min={5} />));
    const el = input();

    typeInto(el, "");
    blur(el);

    expect(el.value).toBe("5");
    expect(committed()).toBe("5");
  });

  it("clamps a below-minimum value up on blur, not while typing", () => {
    act(() => root.render(<Harness min={20} />));
    const el = input();

    typeInto(el, "");
    typeInto(el, "1");
    expect(el.value).toBe("1"); // untouched mid-edit

    blur(el);
    expect(el.value).toBe("20");
    expect(committed()).toBe("20");
  });

  it("applies an upper bound as you type, since a cap cannot block a prefix", () => {
    act(() => root.render(<Harness min={1} max={99} />));
    const el = input();

    typeInto(el, "");
    typeInto(el, "150");

    expect(committed()).toBe("99");
  });

  it("ignores non-digit input", () => {
    act(() => root.render(<Harness min={1} />));
    const el = input();

    typeInto(el, "12abc3");

    expect(el.value).toBe("123");
  });

  it("reflects a value changed elsewhere, e.g. by a preset button", () => {
    function PresetHarness() {
      const [value, setValue] = React.useState(50);
      const field = useNumericField(value, setValue, { min: 1 });
      return (
        <>
          <input aria-label="field" type="text" {...field} />
          <button type="button" onClick={() => setValue(300)}>
            preset
          </button>
        </>
      );
    }
    act(() => root.render(<PresetHarness />));
    expect(input().value).toBe("50");

    act(() => {
      container.querySelector("button")!.dispatchEvent(
        new MouseEvent("click", { bubbles: true })
      );
    });

    expect(input().value).toBe("300");
  });
});

/**
 * Guard against the bug class returning. Clamping a numeric input inside its
 * onChange rewrites the value on every keystroke, which can make a number
 * impossible to type. Numeric inputs should use `useNumericField`, or hold a
 * raw string and clamp in an onBlur handler.
 */
describe("no input clamps on every keystroke", () => {
  const roots = ["components", "app"];

  function tsxFiles(dir: string): string[] {
    const out: string[] = [];
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) out.push(...tsxFiles(full));
      else if (entry.endsWith(".tsx")) out.push(full);
    }
    return out;
  }

  it("has no typed-entry input that clamps e.target.value on change", () => {
    const offenders: string[] = [];

    for (const dir of roots) {
      for (const file of tsxFiles(dir)) {
        const src = readFileSync(file, "utf8");

        // Walk whole <input …/> elements so the check sees the element's own
        // `type`, which decides whether clamping is a problem at all.
        const inputs = src.matchAll(/<input\b[\s\S]*?\/>/g);
        for (const match of inputs) {
          const el = match[0];

          // A range slider cannot emit a value outside [min,max] and has no
          // half-typed states, so clamping in its onChange is harmless.
          if (/type=\{?"range"/.test(el)) continue;
          // Likewise for non-numeric controls.
          if (/type=\{?"(checkbox|radio|file|color|hidden)"/.test(el)) continue;

          const clampsWhileTyping =
            /onChange=/.test(el) &&
            /e\.target\.value/.test(el) &&
            /Math\.(max|min)\(/.test(el);

          if (clampsWhileTyping) {
            const line = src.slice(0, match.index).split("\n").length;
            offenders.push(`${file}:${line}`);
          }
        }
      }
    }

    expect(
      offenders,
      `These onChange handlers clamp while typing, which can make a value ` +
        `impossible to enter. Use useNumericField (components/tool/useNumericField) ` +
        `or clamp in onBlur instead:\n${offenders.join("\n")}`
    ).toEqual([]);
  });
});

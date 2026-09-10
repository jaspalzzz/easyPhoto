"use client";

import * as React from "react";

/**
 * A numeric text field that stays editable while you are typing it.
 *
 * The bug this exists to prevent: clamping inside `onChange` rewrites the value
 * on every keystroke, so a number can become impossible to enter. The KB target
 * field clamped to its 5 KB floor per keystroke, which turned the leading "1" of
 * "100" into "5" — "100" and "200" could never be typed while "500" and "54"
 * worked. The milder form of the same defect is that backspacing to an empty
 * field snaps it straight back to the minimum, so the value cannot be retyped —
 * painful on a phone, where select-all is fiddly.
 *
 * The rule: while the field has focus it holds whatever the user is typing,
 * including an empty string. The floor is applied on blur, when the value is
 * actually finished. An upper bound is applied as you type, because a cap can
 * never block a prefix (any prefix of a valid number is smaller than it), while
 * a floor always can.
 *
 * Use `type="text" inputMode="numeric"` on the input rather than
 * `type="number"`: a number input silently discards the intermediate states we
 * rely on here, and still shows the numeric keypad on mobile via inputMode.
 */
export function useNumericField(
  /** Current committed value, owned by the caller. */
  value: number,
  /** Called with a usable number as the user types, and again on blur. */
  onCommit: (next: number) => void,
  options: { min?: number; max?: number } = {}
) {
  const { min = 0, max = Number.MAX_SAFE_INTEGER } = options;
  const [text, setText] = React.useState(String(value));

  // Reflect changes made elsewhere (a preset button, a new source image) into
  // the field. Committing from onChange also lands here, harmlessly: the text
  // it writes back is the text the user just typed.
  React.useEffect(() => {
    setText(String(value));
  }, [value]);

  const clamp = (n: number) => Math.min(max, Math.max(min, Math.floor(n)));

  return {
    value: text,
    inputMode: "numeric" as const,
    pattern: "[0-9]*",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "");
      setText(raw);
      // An empty field is a legitimate mid-edit state; leave the committed
      // value alone until blur decides what it should be.
      if (raw === "") return;
      const n = Number(raw);
      // Cap only. Applying `min` here is what breaks typing.
      if (Number.isFinite(n)) onCommit(Math.min(max, n));
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      // Read the DOM, not the `text` closure, so the result cannot depend on
      // React re-render timing.
      const raw = e.currentTarget.value.replace(/\D/g, "");
      const n = Number(raw);
      const fixed = raw !== "" && Number.isFinite(n) ? clamp(n) : clamp(min);
      setText(String(fixed));
      onCommit(fixed);
    },
  };
}

"use client";

/**
 * Root-layout error boundary — the last line of defence (fires only when the
 * layout itself crashes, so it must render its own <html>/<body> and cannot
 * rely on app CSS or components).
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background: "#faf9f7",
          color: "#2b2723",
          margin: 0,
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 420, padding: 24 }}>
          <h1 style={{ fontSize: 22, margin: "0 0 8px" }}>
            easyPhoto hit an unexpected error
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: "#6b6258" }}>
            Your photo was never uploaded — it only existed in this tab&apos;s
            memory. Reloading is safe.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: 16,
              padding: "10px 18px",
              borderRadius: 8,
              border: 0,
              background: "#0C1B34",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}

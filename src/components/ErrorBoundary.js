'use client';
export function fallbackRender({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert">
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
}

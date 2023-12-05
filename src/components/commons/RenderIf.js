export default function RenderIf({ render, children }) {
  return !!render ? children : <></>;
}

// Inline-editable text. The element is the input: click it and type directly —
// no side panel. Commits the trimmed text on blur; Enter commits (Shift+Enter
// allows a newline). When no `onChange` is passed it renders as static text, so
// the same component works for both the editor and a read-only public render.
// Shared by the Wall builder and the Form builder.
export function EditableText({ as: Component = "span", value, placeholder, onChange, className, style }) {
  const editable = typeof onChange === "function";

  if (!editable) {
    return (
      <Component className={className} style={style}>
        {value || placeholder}
      </Component>
    );
  }

  return (
    <Component
      className={className}
      style={style}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      tabIndex={0}
      data-placeholder={placeholder}
      onBlur={(event) => onChange(event.currentTarget.textContent.trim())}
      onKeyDown={(event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          event.currentTarget.blur();
        }
      }}
    >
      {value}
    </Component>
  );
}

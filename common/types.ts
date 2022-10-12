export type RendererChannel = "open-file-dialog" | "open-save-dialog"

export type MainChannel =
  | "recieve-draft-path"
  | "save-draft"
  | "save-new-draft"
  | "toggle-color-theme"
  | "toggle-char-count"
  | "toggle-line-number"
  | "select-all"
  | "undo"
  | "redo"

export type RendererChannel = "open-file-dialog" | "open-save-dialog"

export type MainChannel =
  | "recieve-draft-path"
  | "save-draft"
  | "save-new-draft"
  | "toggle-color-theme"
  | "toggle-char-count"
  | "select-all"
  | "undo"
  | "redo"

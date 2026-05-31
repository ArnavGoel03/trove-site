// Mirror of the AppIntents surface in macos/app_intents.swift. The
// /shortcuts-gallery page renders this catalog so users can browse the
// available intents before building a Shortcut, without having to launch
// the Shortcuts editor and squint at the Trove sidebar.

import {
  Camera,
  ClipboardPaste,
  ClipboardList,
  Clipboard,
  Eraser,
  FileDigit,
  Hash,
  KeySquare,
  ListOrdered,
  type LucideIcon,
  MousePointerClick,
  Pencil,
  QrCode,
  Search,
  Sigma,
  Tally5,
  Type as TypeIcon,
} from "lucide-react";

export type IntentCategory =
  | "Stage"
  | "Compute"
  | "Snippets"
  | "Clipboard history";

export type Intent = {
  name: string;
  /** As it appears in the Shortcuts editor. */
  title: string;
  description: string;
  category: IntentCategory;
  icon: LucideIcon;
  /** "Entity picker" → the intent surfaces a rich picker; "Action" → fire and forget. */
  kind: "Action" | "Entity picker" | "Query";
};

export const INTENTS: Intent[] = [
  // Stage
  {
    name: "OpenPaneIntent",
    title: "Open Pane in Trove",
    description: "Switch Trove to a specific pane. Honors hidden-pane settings.",
    category: "Stage",
    icon: MousePointerClick,
    kind: "Action",
  },
  {
    name: "AddTextToStageIntent",
    title: "Add Text to Trove Stage",
    description:
      "Drop a string into Stage. Useful for chaining workflows that produce text and want a holding pen for review.",
    category: "Stage",
    icon: TypeIcon,
    kind: "Action",
  },
  {
    name: "AddFileToStageIntent",
    title: "Add File to Trove Stage",
    description:
      "Drop one or more files into Stage. Path-validated, 200 MB cap per file.",
    category: "Stage",
    icon: ClipboardPaste,
    kind: "Action",
  },
  {
    name: "PasteClipboardToStageIntent",
    title: "Paste Clipboard to Trove Stage",
    description: "Take whatever is on the system clipboard and stage it.",
    category: "Stage",
    icon: Clipboard,
    kind: "Action",
  },
  {
    name: "CaptureScreenshotToStageIntent",
    title: "Capture Screenshot to Trove Stage",
    description: "Trigger an interactive region screenshot, route to Stage.",
    category: "Stage",
    icon: Camera,
    kind: "Action",
  },
  {
    name: "CopyStageAsFilesIntent",
    title: "Copy Trove Stage as Files",
    description: "Copy every Stage item to the clipboard as file references.",
    category: "Stage",
    icon: Clipboard,
    kind: "Action",
  },
  {
    name: "CopyStageAsTextIntent",
    title: "Copy Trove Stage as Text",
    description:
      "Stringify every Stage item and put the joined text on the clipboard.",
    category: "Stage",
    icon: Clipboard,
    kind: "Action",
  },
  {
    name: "ClearStageIntent",
    title: "Clear Trove Stage",
    description: "Empty Stage.",
    category: "Stage",
    icon: Eraser,
    kind: "Action",
  },
  {
    name: "GetStageCountIntent",
    title: "Get Trove Stage Item Count",
    description:
      "Returns the count as an Int — useful for branching in a Shortcut.",
    category: "Stage",
    icon: Tally5,
    kind: "Query",
  },

  // Compute
  {
    name: "EvaluateExpressionIntent",
    title: "Evaluate Expression with Trove",
    description:
      "Run an expression through Trove's calc engine — variables, units, currency.",
    category: "Compute",
    icon: Sigma,
    kind: "Action",
  },
  {
    name: "GenerateQRCodeIntent",
    title: "Generate QR Code with Trove",
    description:
      "Render a QR PNG from any text. Returns the PNG as the intent result.",
    category: "Compute",
    icon: QrCode,
    kind: "Action",
  },
  {
    name: "HashFileIntent",
    title: "Hash File with Trove",
    description:
      "MD5 / SHA-1 / SHA-256 / SHA-512 in one streaming pass over the file.",
    category: "Compute",
    icon: FileDigit,
    kind: "Action",
  },

  // Snippets — entity picker surface (8 total counting entity queries)
  {
    name: "GetSnippetIntent",
    title: "Get Trove Snippet",
    description:
      "Rich picker — shows snippet name + body preview. Returns the body.",
    category: "Snippets",
    icon: Pencil,
    kind: "Entity picker",
  },
  {
    name: "GetSnippetByNameIntent",
    title: "Get Trove Snippet by Name",
    description:
      "Name lookup — exact, then prefix, then substring. Returns the body.",
    category: "Snippets",
    icon: Search,
    kind: "Action",
  },
  {
    name: "ListSnippetsIntent",
    title: "List Trove Snippets",
    description: "Returns every snippet entity for downstream filtering.",
    category: "Snippets",
    icon: ListOrdered,
    kind: "Query",
  },
  {
    name: "CountSnippetsIntent",
    title: "Get Trove Snippet Count",
    description: "Returns the snippet count as an Int.",
    category: "Snippets",
    icon: Tally5,
    kind: "Query",
  },

  // Clipboard history
  {
    name: "GetClipboardHistoryAtIntent",
    title: "Get Trove Clipboard History Item",
    description: "Returns the N-th text entry from clipboard history.",
    category: "Clipboard history",
    icon: ClipboardList,
    kind: "Query",
  },
  {
    name: "GetRecentClipboardTextIntent",
    title: "Get Recent Trove Clipboard Text",
    description: "Returns the most recent text entry from clipboard history.",
    category: "Clipboard history",
    icon: Hash,
    kind: "Query",
  },
  {
    name: "CountClipboardHistoryIntent",
    title: "Get Trove Clipboard History Count",
    description: "Returns the clipboard-history count as an Int.",
    category: "Clipboard history",
    icon: Tally5,
    kind: "Query",
  },
  {
    name: "PickClipboardEntryIntent",
    title: "Pick Trove Clipboard Entry",
    description:
      "Rich picker — shows entry kind, capture date, and a preview. Returns the entry.",
    category: "Clipboard history",
    icon: KeySquare,
    kind: "Entity picker",
  },
];

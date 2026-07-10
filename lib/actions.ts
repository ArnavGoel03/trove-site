// lib/actions.ts
//
// Catalog of every inline ⌘K action shipped by Trove, as data. Drives
// the dynamic /action/[slug] SEO pages, each targeting a high-volume
// search like "base64 encode mac" or "sha256 generator mac".
//
// Adding a new action: append one record here. The route, sitemap, and
// cross-link mesh pick it up automatically.

export type ActionCategory =
  | "encoding"
  | "hash"
  | "case"
  | "json"
  | "time"
  | "number"
  | "color"
  | "text"
  | "identifier"
  | "system"
  | "path"
  | "regex"
  | "network";

export interface InlineAction {
  /** URL slug, used for /action/[slug] and the sitemap. */
  slug: string;
  /** Human title for the page <h1> and breadcrumbs. */
  title: string;
  /** Short one-liner — used as the meta description fallback. */
  tagline: string;
  /** ⌘K query string the user types to trigger this. */
  triggers: string[];
  /** Example input → output, for the page body and JSON-LD HowTo. */
  example: { input: string; output: string };
  /** Long-form body. ~80-150 words for SEO depth. */
  body: string;
  /** What competitor / pattern people search for to find this. */
  searchTerms: string[];
  category: ActionCategory;
}

export const ACTIONS: InlineAction[] = [
  // ── ENCODING ─────────────────────────────────────────────────────────
  {
    slug: "base64-encode",
    title: "Base64 encode",
    tagline:
      "Encode any text to Base64 instantly on Mac. Local, no upload, one keystroke from anywhere.",
    triggers: ["base64 encode hello world", "b64 enc hello world"],
    example: { input: "hello world", output: "aGVsbG8gd29ybGQ=" },
    body:
      "Trove encodes any string to Base64 inline from ⌘K. Press the Trove hotkey, type 'base64 encode' followed by your payload, hit Return, and the result is on your clipboard. Nothing leaves the Mac — no upload, no logging, no ad-tracked online tool tab to close. The shorthand 'b64 enc' works too. Built into the same palette as 60+ other dev transforms, so you don't tab-switch.",
    searchTerms: [
      "base64 encoder mac",
      "encode base64 online",
      "base64 encode command line mac",
      "private base64 encoder",
      "offline base64 encoder mac",
    ],
    category: "encoding",
  },
  {
    slug: "base64-decode",
    title: "Base64 decode",
    tagline:
      "Decode Base64 strings on Mac instantly. Paste the encoded value, get plain text — locally, never uploaded.",
    triggers: ["base64 decode aGVsbG8=", "b64 dec aGVsbG8="],
    example: { input: "aGVsbG8gd29ybGQ=", output: "hello world" },
    body:
      "Open Trove (⌘ + space, then \"trove\" — or whatever hotkey you bound), type 'base64 decode' followed by the encoded value, Return. The decoded text is on your clipboard. Same pattern for the entire encoding suite (URL, hex, HTML, ROT13). Works on values up to a few MB without lag.",
    searchTerms: ["base64 decoder mac", "decode base64", "base64 to text mac"],
    category: "encoding",
  },
  {
    slug: "url-encode",
    title: "URL encode (percent encode)",
    tagline:
      "Percent-encode any string for URL-safe transport. ⌘K → 'url encode'.",
    triggers: ["url encode hello world?id=42"],
    example: { input: "a b&c=1", output: "a%20b%26c%3D1" },
    body:
      "URL-encodes a string using RFC 3986 character classes — what you need for query parameters or path components. Triggers: 'url encode', 'urlencode', 'percent encode', 'enc url'. Trove also ships an URL-decode action and a built-in API Tester that does this for you on every request.",
    searchTerms: [
      "url encoder mac",
      "percent encode mac",
      "url encode online private",
    ],
    category: "encoding",
  },
  {
    slug: "url-decode",
    title: "URL decode",
    tagline: "Decode percent-encoded URLs and query strings inline.",
    triggers: ["url decode hello%20world"],
    example: { input: "hello%20world%3Fid%3D42", output: "hello world?id=42" },
    body:
      "Percent-decodes a URL or query string. Triggers: 'url decode', 'urldecode', 'percent decode', 'dec url'.",
    searchTerms: ["url decoder mac", "percent decode mac"],
    category: "encoding",
  },
  {
    slug: "hex-encode",
    title: "Hex encode",
    tagline: "Hex (UTF-8 bytes) encode of any string. ⌘K → 'hex encode'.",
    triggers: ["hex encode hello"],
    example: { input: "hello", output: "68656c6c6f" },
    body: "UTF-8 byte sequence as hex pairs.",
    searchTerms: ["hex encoder mac", "text to hex"],
    category: "encoding",
  },
  {
    slug: "hex-decode",
    title: "Hex decode",
    tagline: "Decode a hex byte string back to UTF-8 text.",
    triggers: ["hex decode 68656c6c6f"],
    example: { input: "68656c6c6f", output: "hello" },
    body:
      "Decodes a hex byte sequence (whitespace ignored, must be even length).",
    searchTerms: ["hex to text mac", "hex decoder online"],
    category: "encoding",
  },
  {
    slug: "html-escape",
    title: "HTML entity escape",
    tagline: "Escape HTML special characters in a string.",
    triggers: ["html escape <div>"],
    example: { input: '<a href="?q=&">', output: '&lt;a href=&quot;?q=&amp;&quot;&gt;' },
    body: "Escapes &, <, >, \", '. Sister action: 'html unescape'.",
    searchTerms: ["html entity encoder", "escape html mac"],
    category: "encoding",
  },
  {
    slug: "rot13",
    title: "ROT13",
    tagline: "Classic Caesar shift cipher (13 positions).",
    triggers: ["rot13 hello world"],
    example: { input: "hello", output: "uryyb" },
    body:
      "Applies a 13-position Caesar shift. ROT13 is its own inverse — apply twice to get the original.",
    searchTerms: ["rot13 encoder mac", "caesar cipher"],
    category: "encoding",
  },

  // ── HASH ─────────────────────────────────────────────────────────────
  {
    slug: "md5",
    title: "MD5 hash",
    tagline: "MD5 digest of any string, inline.",
    triggers: ["md5 hello"],
    example: { input: "hello", output: "5d41402abc4b2a76b9719d911017c592" },
    body:
      "MD5 of the UTF-8 bytes. Not collision-resistant — use for non-security checksums only.",
    searchTerms: ["md5 generator mac", "md5 hash online private"],
    category: "hash",
  },
  {
    slug: "sha1",
    title: "SHA-1 hash",
    tagline: "SHA-1 digest of any string, inline.",
    triggers: ["sha1 hello"],
    example: { input: "hello", output: "aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d" },
    body: "SHA-1 of the UTF-8 bytes. Use SHA-256+ for new applications.",
    searchTerms: ["sha1 generator mac"],
    category: "hash",
  },
  {
    slug: "sha256",
    title: "SHA-256 hash",
    tagline:
      "SHA-256 hash of any string instantly. The most common modern digest.",
    triggers: ["sha256 hello", "sha-256 hello"],
    example: {
      input: "hello",
      output: "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
    },
    body:
      "SHA-256 of the UTF-8 bytes. Output is 64 hex chars. Also available: SHA-384, SHA-512 actions, and the Hash pane for files.",
    searchTerms: [
      "sha256 generator mac",
      "sha-256 hash online",
      "sha256 of a string mac",
    ],
    category: "hash",
  },
  {
    slug: "sha384",
    title: "SHA-384 hash",
    tagline: "SHA-384 digest of any string.",
    triggers: ["sha384 hello"],
    example: { input: "hello", output: "59e1748777448c69de6b800d7a33bbfb9ff1b463e44354c3553bcdb9c666fa90125a3c79f90397bdf5f6a13de828684f" },
    body: "SHA-384 of the UTF-8 bytes.",
    searchTerms: ["sha384 generator mac"],
    category: "hash",
  },
  {
    slug: "sha512",
    title: "SHA-512 hash",
    tagline: "SHA-512 digest of any string. Highest-strength SHA-2 variant.",
    triggers: ["sha512 hello"],
    example: { input: "hello", output: "9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043" },
    body: "SHA-512 of the UTF-8 bytes.",
    searchTerms: ["sha512 generator mac"],
    category: "hash",
  },
  {
    slug: "hmac-sha256",
    title: "HMAC-SHA256",
    tagline:
      "Compute HMAC-SHA256 from a key and message. ⌘K → 'hmac KEY | MESSAGE'.",
    triggers: ["hmac mysecret | important payload"],
    example: { input: "key | message", output: "(64-char hex)" },
    body:
      "Pipe separates the key from the message. Useful for signing webhooks, API requests, JWT (HS256), and TOTP.",
    searchTerms: ["hmac sha256 calculator mac", "hmac signing mac"],
    category: "hash",
  },

  // ── CASE ─────────────────────────────────────────────────────────────
  {
    slug: "snake-case",
    title: "snake_case",
    tagline: "Convert any string to snake_case for Python/Ruby/PostgreSQL.",
    triggers: ["snake case Some Title"],
    example: { input: "FirstName lastName", output: "first_name_last_name" },
    body:
      "Splits the input on camelCase boundaries, spaces, hyphens, underscores — then lowercases and joins with underscores.",
    searchTerms: ["snake case converter mac"],
    category: "case",
  },
  {
    slug: "camel-case",
    title: "camelCase",
    tagline: "Convert any string to camelCase for JavaScript/Java/Swift.",
    triggers: ["camel case Some Title"],
    example: { input: "first_name_last_name", output: "firstNameLastName" },
    body: "Lower-camel: first segment lowercased, rest title-cased.",
    searchTerms: ["camel case converter mac"],
    category: "case",
  },
  {
    slug: "pascal-case",
    title: "PascalCase",
    tagline: "Convert any string to PascalCase / UpperCamelCase.",
    triggers: ["pascal case some title"],
    example: { input: "some_title", output: "SomeTitle" },
    body: "All segments title-cased.",
    searchTerms: ["pascal case converter mac"],
    category: "case",
  },
  {
    slug: "constant-case",
    title: "CONSTANT_CASE",
    tagline:
      "Convert any string to SCREAMING_SNAKE_CASE for constants and env vars.",
    triggers: ["constant case some title"],
    example: { input: "some-title", output: "SOME_TITLE" },
    body: "All segments upper-cased, joined with underscores.",
    searchTerms: ["constant case converter mac", "screaming snake case"],
    category: "case",
  },
  {
    slug: "slug",
    title: "Slugify",
    tagline:
      "Generate a URL-safe slug (kebab-case) from any title or sentence.",
    triggers: ["slug Hello, World!"],
    example: { input: "Hello, World!", output: "hello-world" },
    body:
      "Lowercases, strips non-alphanumerics, collapses whitespace, joins with hyphens. Same algorithm WordPress uses.",
    searchTerms: ["slugify online", "url slug generator"],
    category: "case",
  },

  // ── JSON ─────────────────────────────────────────────────────────────
  {
    slug: "json-format",
    title: "JSON pretty-print",
    tagline: "Format JSON with indentation and sorted keys, inline.",
    triggers: ['json format {"a":1,"b":2}', 'json pp {"a":1,"b":2}'],
    example: { input: '{"a":1,"b":2}', output: '{\n  "a" : 1,\n  "b" : 2\n}' },
    body:
      "Parses and pretty-prints any JSON. Bad JSON returns nothing. Trove also ships a dedicated JSON/XML pane with diff and validate.",
    searchTerms: [
      "json formatter mac",
      "json pretty print mac",
      "json beautifier private",
    ],
    category: "json",
  },
  {
    slug: "json-minify",
    title: "JSON minify",
    tagline: "Strip whitespace from JSON for transport or storage.",
    triggers: ['json minify {"a":  1}'],
    example: { input: '{ "a" : 1 }', output: '{"a":1}' },
    body: "Removes all insignificant whitespace.",
    searchTerms: ["json minify mac", "json compactor"],
    category: "json",
  },
  {
    slug: "jsonpath",
    title: "JSONPath query",
    tagline: "Pull a value out of a JSON object with a simple path.",
    triggers: ['jsonpath $.user.id | {"user":{"id":42}}'],
    example: { input: '$.user.id | {"user":{"id":42}}', output: "42" },
    body:
      "Pipe-separated path and body. Supports dot-paths and numeric indices. For more, the JSON / XML pane has a full JSONPath editor.",
    searchTerms: ["jsonpath evaluator", "jq mac"],
    category: "json",
  },

  // ── TIME ─────────────────────────────────────────────────────────────
  {
    slug: "unix-timestamp",
    title: "Unix timestamp now",
    tagline: "Get the current Unix timestamp (seconds since 1970-01-01 UTC).",
    triggers: ["now", "timestamp", "ts"],
    example: { input: "now", output: "(current Unix seconds)" },
    body: "Returns Date().timeIntervalSince1970 as an integer.",
    searchTerms: ["unix timestamp now mac", "epoch time mac"],
    category: "time",
  },
  {
    slug: "iso-8601-now",
    title: "ISO 8601 now",
    tagline: "Current time as ISO 8601 (RFC 3339) for logs and APIs.",
    triggers: ["iso now"],
    example: { input: "iso now", output: "2026-06-02T05:30:00Z" },
    body: "ISO 8601 string in UTC.",
    searchTerms: ["iso 8601 timestamp now", "rfc 3339 mac"],
    category: "time",
  },
  {
    slug: "unix-to-iso",
    title: "Unix timestamp → ISO 8601",
    tagline: "Convert Unix seconds to human-readable ISO 8601.",
    triggers: ["unix to iso 1717000000"],
    example: { input: "1717000000", output: "2024-05-29T16:26:40Z" },
    body: "Parses the input as Unix seconds and formats as ISO 8601.",
    searchTerms: ["unix to date mac", "epoch converter mac"],
    category: "time",
  },
  {
    slug: "now-in-tz",
    title: "Now in timezone",
    tagline:
      "Show the current time in any timezone. ⌘K → 'now in JST' / 'now in PST'.",
    triggers: ["now in JST", "now in America/New_York"],
    example: { input: "JST", output: "2026-06-02 14:30:00 JST" },
    body:
      "Aliases supported: UTC, GMT, JST, PST, PDT, EST, EDT, CET, IST, BST, AEST. Or any full IANA timezone identifier.",
    searchTerms: ["world clock mac", "timezone converter mac"],
    category: "time",
  },

  // ── NUMBER ───────────────────────────────────────────────────────────
  {
    slug: "format-with-commas",
    title: "Format number with commas",
    tagline: "Format a large number with thousands separators.",
    triggers: ["format number 1234567"],
    example: { input: "1234567", output: "1,234,567" },
    body: "Uses the locale-aware NumberFormatter for grouping.",
    searchTerms: ["number formatter mac"],
    category: "number",
  },
  {
    slug: "bytes-human",
    title: "Bytes → human-readable",
    tagline: "Convert raw byte counts to KB/MB/GB/TB.",
    triggers: ["bytes 1048576"],
    example: { input: "1048576", output: "1 MB" },
    body: "Uses ByteCountFormatter — produces Apple's standard size strings.",
    searchTerms: ["bytes to mb mac", "byte size formatter"],
    category: "number",
  },
  {
    slug: "hex-to-decimal",
    title: "Hex → decimal",
    tagline: "Convert a hex number to decimal.",
    triggers: ["hex to dec ff"],
    example: { input: "ff", output: "255" },
    body: "Accepts optional 0x prefix.",
    searchTerms: ["hex to decimal converter"],
    category: "number",
  },
  {
    slug: "binary-to-decimal",
    title: "Binary → decimal",
    tagline: "Convert a binary number to decimal.",
    triggers: ["bin to dec 1011"],
    example: { input: "1011", output: "11" },
    body: "Plain base-2 integer parsing.",
    searchTerms: ["binary to decimal converter"],
    category: "number",
  },

  // ── COLOR ────────────────────────────────────────────────────────────
  {
    slug: "hex-to-rgb",
    title: "Hex → RGB color",
    tagline: "Convert a hex color string to its rgb(r, g, b) form.",
    triggers: ["hex to rgb #E10600"],
    example: { input: "#E10600", output: "rgb(255, 106, 42)" },
    body:
      "Accepts # prefix, 3 or 6 digits. Trove also ships a Color picker pane with a full HEX / RGB / HSL / OKLCH inspector.",
    searchTerms: ["hex to rgb converter", "color picker mac"],
    category: "color",
  },
  {
    slug: "rgb-to-hex",
    title: "RGB → hex color",
    tagline: "Convert rgb(r, g, b) to a hex string.",
    triggers: ["rgb to hex 255, 106, 42"],
    example: { input: "255, 106, 42", output: "#E10600" },
    body: "Accepts space- or comma-separated triplets, with or without 'rgb('.",
    searchTerms: ["rgb to hex converter"],
    category: "color",
  },
  {
    slug: "color-name-to-hex",
    title: "Color name → hex",
    tagline: "Convert a CSS color name to its hex value.",
    triggers: ["color crimson"],
    example: { input: "crimson", output: "#DC143C" },
    body: "Supports 45+ named CSS colors plus trove (#F08227).",
    searchTerms: ["css color names hex"],
    category: "color",
  },

  // ── IDENTIFIER ───────────────────────────────────────────────────────
  {
    slug: "uuid-generator",
    title: "UUID generator (v4)",
    tagline:
      "Generate a UUID v4 instantly. Single keystroke from anywhere on Mac.",
    triggers: ["uuid", "guid"],
    example: { input: "uuid", output: "550e8400-e29b-41d4-a716-446655440000" },
    body: "Returns a fresh UUIDv4 each time. No network call.",
    searchTerms: ["uuid generator mac", "guid generator mac", "uuid v4 generator"],
    category: "identifier",
  },
  {
    slug: "ulid",
    title: "ULID (sortable identifier)",
    tagline:
      "Generate a Crockford-base32 sortable identifier (ULID-style).",
    triggers: ["ulid"],
    example: { input: "ulid", output: "(timestamp + random in Crockford)" },
    body:
      "10 chars of timestamp + 16 chars random. Sortable; collision-resistant in practice.",
    searchTerms: ["ulid generator mac"],
    category: "identifier",
  },

  // ── TEXT ─────────────────────────────────────────────────────────────
  {
    slug: "sort-lines",
    title: "Sort lines",
    tagline: "Sort the lines of any text input alphabetically.",
    triggers: ["sort lines\nbanana\napple\ncherry"],
    example: { input: "banana\napple\ncherry", output: "apple\nbanana\ncherry" },
    body:
      "Lexicographic sort, ascending. Sister actions: 'reverse lines', 'unique lines', 'shuffle lines'.",
    searchTerms: ["sort lines online", "text sorter mac"],
    category: "text",
  },
  {
    slug: "unique-lines",
    title: "Unique lines",
    tagline: "Drop duplicate lines from text. Order preserved.",
    triggers: ["unique lines\napple\napple\nbanana"],
    example: { input: "apple\napple\nbanana", output: "apple\nbanana" },
    body: "First occurrence wins.",
    searchTerms: ["dedupe lines online", "uniq mac"],
    category: "text",
  },
  {
    slug: "lorem-ipsum",
    title: "Lorem ipsum generator",
    tagline:
      "Generate filler text for design mocks. ⌘K → 'lorem 30' for 30 words.",
    triggers: ["lorem 30"],
    example: { input: "30", output: "Lorem ipsum dolor sit amet… (30 words)" },
    body: "Specify word count after the trigger.",
    searchTerms: ["lorem ipsum generator", "filler text mac"],
    category: "text",
  },
  {
    slug: "leet-speak",
    title: "Leet speak (1337)",
    tagline: "Convert text to leet speak.",
    triggers: ["leet hello"],
    example: { input: "hello", output: "h3110" },
    body: "Substitutes letters with classic 1337 digits/symbols.",
    searchTerms: ["leet speak converter", "1337 generator"],
    category: "text",
  },
  {
    slug: "phonetic",
    title: "NATO phonetic",
    tagline: "Spell text using the NATO phonetic alphabet (Alpha, Bravo, …).",
    triggers: ["phonetic hello"],
    example: { input: "AB1", output: "Alpha Bravo One" },
    body: "Letters and digits get spelled out, anything else passes through.",
    searchTerms: ["nato phonetic alphabet converter"],
    category: "text",
  },
  {
    slug: "extract-urls",
    title: "Extract URLs",
    tagline:
      "Pull every http(s) URL out of any text block, one per line.",
    triggers: ["extract urls Some text with https://example.com and more."],
    example: {
      input: "see https://a.test and https://b.test/x",
      output: "https://a.test\nhttps://b.test/x",
    },
    body: "Matches http/https URLs only. Sister: 'extract emails', 'extract numbers'.",
    searchTerms: ["extract urls from text mac"],
    category: "text",
  },

  // ── NETWORK / SYSTEM ────────────────────────────────────────────────
  {
    slug: "local-ip",
    title: "Local IP addresses",
    tagline:
      "Get your local IPv4 addresses (per interface) without opening a terminal.",
    triggers: ["ip", "my ip"],
    example: { input: "ip", output: "en0: 192.168.1.42" },
    body:
      "Returns non-loopback IPv4 addresses per interface. Skips link-local 169.254 ranges.",
    searchTerms: [
      "find my local ip mac",
      "show local ip address mac",
      "private ip lookup mac",
    ],
    category: "network",
  },
  {
    slug: "jwt-decoder",
    title: "JWT decoder",
    tagline:
      "Decode a JSON Web Token and pretty-print its payload. Signature is NOT verified.",
    triggers: ["jwt decode eyJ..."],
    example: { input: "eyJ.eyJ.sig", output: "(payload JSON pretty-printed)" },
    body:
      "Splits on dots, base64url-decodes the payload, JSON-pretty-prints it. Use HMAC-SHA256 or the Passwords pane to verify the signature.",
    searchTerms: [
      "jwt decoder mac",
      "jwt decoder online private",
      "jwt parser mac local",
    ],
    category: "system",
  },
  {
    slug: "trove-version",
    title: "Trove version",
    tagline: "Show which version of Trove is installed.",
    triggers: ["version", "trove version"],
    example: { input: "version", output: "Trove 1.5.x" },
    body:
      "Returns the CFBundleShortVersionString of the running app.",
    searchTerms: ["trove version"],
    category: "system",
  },
  {
    slug: "free-disk",
    title: "Free disk space",
    tagline: "Show free disk space at a glance.",
    triggers: ["disk", "free disk"],
    example: { input: "disk", output: "412.6 GB free" },
    body: "Uses Apple's volumeAvailableCapacityForImportantUsage.",
    searchTerms: ["check disk space mac"],
    category: "system",
  },
];

export const ACTIONS_BY_SLUG: Record<string, InlineAction> = Object.fromEntries(
  ACTIONS.map((a) => [a.slug, a])
);

export const ACTION_CATEGORIES: { id: ActionCategory; label: string }[] = [
  { id: "encoding", label: "Encoding" },
  { id: "hash", label: "Hashing" },
  { id: "case", label: "Case conversion" },
  { id: "json", label: "JSON" },
  { id: "time", label: "Time" },
  { id: "number", label: "Number" },
  { id: "color", label: "Color" },
  { id: "text", label: "Text" },
  { id: "identifier", label: "Identifiers" },
  { id: "system", label: "System" },
  { id: "path", label: "Path" },
  { id: "regex", label: "Regex" },
  { id: "network", label: "Network" },
];

export function relatedActions(action: InlineAction, n = 6): InlineAction[] {
  return ACTIONS.filter(
    (a) => a.slug !== action.slug && a.category === action.category
  ).slice(0, n);
}

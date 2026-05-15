"use client";

import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { useEffect, useRef } from "react";
import {
  Clipboard,
  Calculator,
  Type,
  Pipette,
  QrCode,
  ScanLine,
  Video,
  Crop,
  Image as ImageIcon,
  FileText,
  Hash,
  FileEdit,
  LayoutGrid,
  Activity,
  Scissors,
  Folder,
  Cpu,
  ShieldCheck,
  ScrollText,
  Thermometer,
  Disc3,
  Network,
  HardDrive,
  Trash2,
  ArrowDownToLine,
  Sticker,
  StickyNote,
  History,
  Coffee,
} from "lucide-react";

const PANES = [
  { icon: Clipboard, label: "Stage", group: "clip" },
  { icon: History, label: "History", group: "clip" },
  { icon: Sticker, label: "Snippets", group: "clip" },
  { icon: StickyNote, label: "Notes", group: "clip" },
  { icon: Calculator, label: "Calculator", group: "compute" },
  { icon: Type, label: "Text Tools", group: "compute" },
  { icon: Pipette, label: "Color", group: "capture" },
  { icon: QrCode, label: "QR", group: "capture" },
  { icon: ScanLine, label: "OCR", group: "capture" },
  { icon: Video, label: "Recorder", group: "capture" },
  { icon: Crop, label: "Snip", group: "capture" },
  { icon: ImageIcon, label: "Image Tools", group: "files" },
  { icon: FileText, label: "PDF", group: "files" },
  { icon: Hash, label: "Hash", group: "files" },
  { icon: FileEdit, label: "Rename", group: "files" },
  { icon: LayoutGrid, label: "Window Snap", group: "sys" },
  { icon: Activity, label: "AltTab", group: "sys" },
  { icon: Scissors, label: "Cut-paste", group: "sys" },
  { icon: Folder, label: "Finder Tweaks", group: "sys" },
  { icon: Cpu, label: "Processes", group: "sys" },
  { icon: Coffee, label: "Keep Awake", group: "sys" },
  { icon: ShieldCheck, label: "Permissions", group: "sys" },
  { icon: ScrollText, label: "Log Viewer", group: "sys" },
  { icon: Thermometer, label: "GPU & Thermals", group: "sys" },
  { icon: Disc3, label: "Disk Speed", group: "sys" },
  { icon: Network, label: "Network", group: "sys" },
  { icon: HardDrive, label: "Overview", group: "storage" },
  { icon: HardDrive, label: "Scan", group: "storage" },
  { icon: Trash2, label: "Clean Caches", group: "storage" },
  { icon: ArrowDownToLine, label: "Sweep ~/Downloads", group: "storage" },
];

const GROUP_COLORS: Record<string, string> = {
  clip: "from-[#ff7a45]/30 to-[#ff7a45]/0",
  compute: "from-[#4cb8ff]/30 to-[#4cb8ff]/0",
  capture: "from-[#b27cff]/30 to-[#b27cff]/0",
  files: "from-[#5be3a4]/30 to-[#5be3a4]/0",
  sys: "from-[#ffd166]/30 to-[#ffd166]/0",
  storage: "from-[#ff5d8f]/30 to-[#ff5d8f]/0",
};

export default function AppMockup({
  className = "",
}: {
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 90, damping: 18 });
  const sy = useSpring(my, { stiffness: 90, damping: 18 });

  const rotX = useTransform(sy, [0, 1], [6, -6]);
  const rotY = useTransform(sx, [0, 1], [-8, 8]);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      mx.set((e.clientX - rect.left) / rect.width);
      my.set((e.clientY - rect.top) / rect.height);
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1200 }}
      className={`relative ${className}`}
    >
      <div className="pane rounded-2xl shadow-[0_40px_120px_-30px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)] overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/30">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="text-[11px] text-[var(--color-fg-mute)] font-mono tracking-tight">
            Trove
          </div>
          <div className="w-12" />
        </div>

        {/* Pane grid */}
        <div className="p-4 sm:p-6 bg-gradient-to-br from-[#0c0c10] to-[#08080b]">
          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2.5">
            {PANES.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={`${p.label}-${i}`}
                  initial={{ opacity: 0, scale: 0.9, y: 6 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20%" }}
                  transition={{
                    duration: 0.4,
                    delay: 0.02 * i,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className={`group relative aspect-square rounded-xl bg-gradient-to-br ${GROUP_COLORS[p.group]} bg-white/[0.02] border border-white/[0.06] flex flex-col items-center justify-center gap-1.5 cursor-default`}
                >
                  <Icon
                    size={18}
                    className="text-white/85 group-hover:text-white transition-colors"
                  />
                  <span className="text-[9.5px] sm:text-[10px] text-[var(--color-fg-dim)] text-center leading-tight px-1 truncate max-w-full">
                    {p.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Glow */}
      <div
        className="absolute -inset-20 -z-10 opacity-60 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 30%, rgba(255,122,69,0.25), transparent 70%), radial-gradient(50% 50% at 70% 70%, rgba(178,124,255,0.22), transparent 70%)",
        }}
      />
    </motion.div>
  );
}

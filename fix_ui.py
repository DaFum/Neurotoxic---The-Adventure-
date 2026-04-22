import re

with open('src/components/UI.tsx', 'r') as f:
    text = f.read()

# Restore aria-hidden={!!dialogue} for top status bar and controls hint
text = re.sub(
    r"""      <div
        className=\{`absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto z-20 \$\{isCompactViewport \? 'w-\[calc\(100\%-7rem\)\]' : 'w-\[min\(560px,calc\(100\%-9rem\)\)\]'\}\`\}
      >""",
    r"""      <div
        aria-hidden={!!dialogue}
        className={`absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto z-20 ${isCompactViewport ? 'w-[calc(100%-7rem)]' : 'w-[min(560px,calc(100%-9rem))]'}`}
      >""",
    text
)

text = re.sub(
    r"""      \{\/\* Controls Hint \*\/\}
      <div
        className="absolute bottom-4 left-4 bg-black/50 text-white/70 px-3 py-2 rounded text-xs font-mono pointer-events-none select-none"
      >""",
    r"""      {/* Controls Hint */}
      <div
        aria-hidden={!!dialogue}
        className="absolute bottom-4 left-4 bg-black/50 text-white/70 px-3 py-2 rounded text-xs font-mono pointer-events-none select-none"
      >""",
    text
)

with open('src/components/UI.tsx', 'w') as f:
    f.write(text)

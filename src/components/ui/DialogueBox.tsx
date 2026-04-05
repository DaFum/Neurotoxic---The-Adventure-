import { useState, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useStore, Dialogue } from '../../store';
import { useShallow } from 'zustand/react/shallow';
import { canSelectOption, executeDialogueOption } from '../../dialogueEngine';
import { audio } from '../../audio';

interface DialogueBoxProps {
  dialogue: Dialogue | null;
  setDialogue: (dialogue: Dialogue | string | null) => void;
  questDictionary: Map<string, string>;
}

export function DialogueBox({
  dialogue,
  setDialogue,
  questDictionary,
}: DialogueBoxProps) {
  useStore(
    useShallow((state) => ({
      flags: state.flags,
      trait: state.trait,
      skills: state.skills,
      quests: state.quests,
      inventoryCounts: state.inventoryCounts,
    }))
  ); // Subscribe to all dependencies for canSelectOption so locked/unlocked UI syncs perfectly

  const [displayedText, setDisplayedText] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const isResolvingRef = useRef(false);
  const typewriterIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useLayoutEffect(() => {
    isResolvingRef.current = false;
    setIsResolving(false);

    if (typewriterIntervalRef.current) {
      clearInterval(typewriterIntervalRef.current);
    }

    if (!dialogue) {
      setDisplayedText('');
      return;
    }

    let i = 0;
    setDisplayedText('');

    // Determine speed: urgency 1 (high) = fast, urgency 3 (low) = slow
    const baseDelay =
      dialogue.urgency === 1 ? 15 : dialogue.urgency === 3 ? 50 : 30;

    typewriterIntervalRef.current = setInterval(() => {
      if (i >= dialogue.text.length) {
        if (typewriterIntervalRef.current) {
          clearInterval(typewriterIntervalRef.current);
        }
        return;
      }

      const char = dialogue.text[i];
      if (char !== undefined) {
        setDisplayedText((prev) => prev + char);
        // Play typing sound for non-space characters
        if (char !== ' ') {
          audio.playTypewriter();
        }
      }
      i++;
    }, baseDelay);

    return () => {
      if (typewriterIntervalRef.current) {
        clearInterval(typewriterIntervalRef.current);
      }
    };
  }, [dialogue]);

  return (
    <AnimatePresence>
      {dialogue && (
        <div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-2xl pointer-events-auto"
          role="dialog"
          aria-labelledby="dialogue-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            <div
              className={`bg-black/95 brutal-border-toxic p-8 relative overflow-hidden ${
                dialogue.visualEffect === 'glitch'
                  ? 'animate-glitch ring-2 ring-red-500 shadow-[0_0_20px_red]'
                  : ''
              } ${
                dialogue.visualEffect === 'shake'
                  ? 'animate-shake ring-2 ring-toxic shadow-[0_0_20px_#adff2f]'
                  : ''
              }`}
            >
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-toxic" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-toxic" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-toxic" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-toxic" />

              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-toxic/20 pb-2">
                  <h2
                    id="dialogue-title"
                    className="text-[10px] font-black text-toxic uppercase tracking-[0.4em]"
                  >
                    Incoming_Transmission
                  </h2>
                  <button
                    onClick={() => setDialogue(null)}
                    aria-label="Close transmission"
                    className="text-toxic hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-toxic"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-xl font-bold leading-tight text-zinc-100 italic">
                  {displayedText}
                  <span className="inline-block w-2 h-5 bg-toxic ml-1 animate-pulse" />
                </p>

                {/* Branching Options */}
                {displayedText.length >= (dialogue?.text.length || 0) &&
                  dialogue?.options &&
                  dialogue.options.length > 0 && (
                    <div className="flex flex-col gap-2 mt-4">
                      {dialogue.options.map((option, idx) => {
                        const skillReq = option.requiredSkill;
                        const traitReq = option.requiredTrait;
                        const questDeps = option.questDependencies;
                        const requiredItems = option.requiredItems;
                        const requiredFlags = option.requiredFlags;
                        const forbiddenFlags = option.forbiddenFlags;
                        const isLocked = !canSelectOption(option);

                        return (
                          <button
                            key={option.id || idx}
                            aria-disabled={isLocked || isResolving}
                            onClick={() => {
                              if (
                                isLocked ||
                                isResolving ||
                                isResolvingRef.current
                              )
                                return;
                              const currentDialogue = dialogue;
                              isResolvingRef.current = true;
                              setIsResolving(true);
                              try {
                                executeDialogueOption(option);
                              } finally {
                                if (
                                  useStore.getState().dialogue === currentDialogue
                                ) {
                                  isResolvingRef.current = false;
                                  setIsResolving(false);
                                }
                              }
                            }}
                            className={`group relative flex flex-col px-4 py-3 text-sm font-bold uppercase tracking-wider text-left border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-toxic focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                              isLocked || isResolving
                                ? 'bg-zinc-900/50 border-zinc-800 text-zinc-600 cursor-not-allowed grayscale'
                                : 'bg-zinc-900 hover:bg-toxic text-zinc-400 hover:text-black border-zinc-800 hover:border-toxic'
                            }`}
                          >
                            <div className="flex justify-between items-center w-full">
                              <span>{`> ${option.text}`}</span>
                              {isLocked && (
                                <X size={14} className="text-blood" />
                              )}
                            </div>

                            {(skillReq ||
                              traitReq ||
                              questDeps ||
                              requiredItems ||
                              requiredFlags ||
                              forbiddenFlags) && (
                              <div
                                className={`text-[8px] mt-1 font-mono ${
                                  isLocked
                                    ? 'text-blood'
                                    : 'text-toxic/60 group-hover:text-black/60'
                                }`}
                              >
                                {skillReq &&
                                  `[ REQ: ${skillReq.name.toUpperCase()} ${
                                    skillReq.level
                                  } ] `}
                                {traitReq &&
                                  `[ REQ: ${traitReq.toUpperCase()} ] `}
                                {questDeps &&
                                  questDeps.map((dep, depIdx) => {
                                    if (typeof dep === 'string') {
                                      const questTitle =
                                        questDictionary.get(dep) || dep;
                                      return (
                                        <span key={`dep-${depIdx}`}>
                                          [ REQ: QUEST COMPLETED: {questTitle}{' '}
                                          ]{' '}
                                        </span>
                                      );
                                    } else {
                                      const questTitle =
                                        questDictionary.get(dep.id) || dep.id;
                                      return (
                                        <span key={`dep-${depIdx}`}>
                                          [ REQ: QUEST{' '}
                                          {dep.status.toUpperCase()}:{' '}
                                          {questTitle} ]{' '}
                                        </span>
                                      );
                                    }
                                  })}
                                {requiredItems &&
                                  requiredItems.map((item, itemIdx) => (
                                    <span key={`req-item-${itemIdx}`}>
                                      [ REQ: ITEM: {item.toUpperCase()} ]{' '}
                                    </span>
                                  ))}
                                {requiredFlags &&
                                  requiredFlags.map((flag, flagIdx) => (
                                    <span key={`req-flag-${flagIdx}`}>
                                      [ REQ: FLAG: {flag.toUpperCase()} ]{' '}
                                    </span>
                                  ))}
                                {forbiddenFlags &&
                                  forbiddenFlags.map((flag, flagIdx) => (
                                    <span key={`forbid-flag-${flagIdx}`}>
                                      [ BLOCKED BY: FLAG: {flag.toUpperCase()}{' '}
                                      ]{' '}
                                    </span>
                                  ))}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                <div className="flex justify-end mt-4">
                  {(!dialogue?.options || dialogue.options.length === 0) && (
                    <button
                      onClick={() => {
                        if (
                          displayedText.length < (dialogue?.text.length || 0)
                        ) {
                          setDisplayedText(dialogue?.text || '');
                          if (typewriterIntervalRef.current) {
                            clearInterval(typewriterIntervalRef.current);
                          }
                        } else {
                          setDialogue(null);
                        }
                      }}
                      className="bg-toxic/10 hover:bg-toxic text-toxic hover:text-black px-6 py-2 font-black uppercase tracking-[0.2em] text-[10px] transition-all border border-toxic/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-toxic"
                    >
                      {displayedText.length < (dialogue?.text.length || 0)
                        ? 'SKIP_DATA'
                        : 'ACKNOWLEDGE'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

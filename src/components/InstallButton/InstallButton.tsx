import { AnimatePresence, motion } from 'framer-motion';
import { useState, useSyncExternalStore } from 'react';
import { playClick } from '../../lib/audio';
import { canPromptInstall, isIos, isRunningInstalled, promptInstall, subscribeInstall } from '../../lib/install';

function IosGuide({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[90] grid place-items-center bg-[rgba(59,42,90,0.45)] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ios-install-title"
        className="w-full max-w-md rounded-[2rem] border-[0.5vh] border-white bg-[var(--color-sky-bottom)] p-6 text-center shadow-xl"
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="ios-install-title" className="font-display text-3xl font-extrabold">
          نزّل عالم نور 📲
        </h2>
        <ol className="mt-4 space-y-3 text-start text-xl font-bold leading-relaxed">
          <li>
            ١. اضغط زرار المشاركة{' '}
            <span className="inline-grid h-9 w-9 place-items-center rounded-lg bg-white align-middle shadow">
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-label="مشاركة">
                <path d="M12 3v12M7 8l5-5 5 5" fill="none" stroke="#2f7bff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" fill="none" stroke="#2f7bff" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </span>{' '}
            تحت أو فوق
          </li>
          <li>٢. اختار «إضافة إلى الشاشة الرئيسية» ➕</li>
          <li>٣. اضغط «إضافة» — وهتلاقي أيقونة الأرنبة 🐰</li>
        </ol>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 cursor-pointer rounded-full border-4 border-white bg-[var(--color-mint)] px-8 py-2 font-display text-2xl font-extrabold text-white shadow-[0_6px_0_#2fae86]"
        >
          تمام 👍
        </button>
      </motion.div>
    </motion.div>
  );
}

/**
 * Small, parent-facing "install the app" pill. Uses the real install
 * dialog where the browser supports it, a how-to guide on iPhone/iPad,
 * and hides itself once the app is installed.
 */
export function InstallButton() {
  const canPrompt = useSyncExternalStore(subscribeInstall, canPromptInstall);
  const installed = useSyncExternalStore(subscribeInstall, isRunningInstalled);
  const [showGuide, setShowGuide] = useState(false);
  const ios = isIos();

  if (installed || (!canPrompt && !ios)) return null;

  const handleClick = () => {
    playClick();
    if (canPrompt) void promptInstall();
    else setShowGuide(true);
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={handleClick}
        className="flex min-h-12 cursor-pointer items-center gap-2 rounded-full border-[0.4vh] border-white bg-white/85 px-4 py-1 font-display text-[max(1rem,3.6vh)] font-extrabold text-[var(--color-ink)] shadow-[0_0.6vh_0_#e9dcff]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        whileTap={{ scale: 0.92, y: 3 }}
      >
        <span aria-hidden>📲</span>
        نزّل اللعبة
      </motion.button>
      <AnimatePresence>{showGuide && <IosGuide onClose={() => setShowGuide(false)} />}</AnimatePresence>
    </>
  );
}

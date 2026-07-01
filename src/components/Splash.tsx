/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";
import { motion } from "motion/react";

interface SplashProps {
  onComplete: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#F8F5EE] flex flex-col items-center justify-center z-50 px-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-xl"
      >
        {/* Abstract elegant premium logo representation */}
        <div className="inline-flex items-center justify-center space-x-2 mb-6">
          <div className="relative w-12 h-12 flex items-center justify-center">
            {/* The "FaultLine" visual metaphor: a split solid line representing split decisions */}
            <div className="absolute w-full h-[3px] bg-[#233A66] rotate-45 transform translate-x-[-2px] rounded-full" />
            <div className="absolute w-full h-[3px] bg-[#D7A859] rotate-45 transform translate-x-[2px] translate-y-[4px] rounded-full" />
          </div>
          <span className="font-display text-4xl font-extrabold tracking-tight text-[#233A66]">
            FaultLine
          </span>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.6, duration: 1.0 }}
          className="font-mono text-sm tracking-widest text-[#6B7280] uppercase mb-4"
        >
          Decision Intelligence Network
        </motion.p>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "80px" }}
          transition={{ delay: 0.8, duration: 0.8, ease: "easeInOut" }}
          className="h-[1px] bg-[#E5E7EB] mx-auto my-6"
        />

        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1.0 }}
          className="text-lg text-[#233A66] italic font-medium"
        >
          "Learn From Decisions. Not Just Outcomes."
        </motion.p>
      </motion.div>
    </div>
  );
}

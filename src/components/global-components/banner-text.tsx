"use client";
import { motion } from "framer-motion";
import { ColourfulText } from "./colorful-text";
import { Button } from "@/components/ui/button";
import { ArrowDown, ShoppingCart } from "lucide-react";

export const BannerText = () => {
  const scrollToProducts = () => {
    const element = document.getElementById("san-pham");
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -80,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{ duration: 0.6 }}
      className="z-50 flex flex-col items-center justify-center gap-6 px-4"
    >
      {/* Glassmorphism container for text */}
      <div className="backdrop-blur-md bg-black/20 rounded-3xl p-6 md:p-8 border border-white/10">
        <motion.h1 className="font-bold text-2xl md:text-6xl lg:text-7xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-2">
          <ColourfulText text="Thai Fruitz" /> sản phẩm cho bạn{" "}
          <br className="hidden md:block" /> cho{" "}
          <ColourfulText text="mọi nhà" />!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-white/90 text-center text-sm md:text-lg mt-4 max-w-2xl mx-auto"
        >
          Trái cây sấy organic 100% tự nhiên, không đường, không chất bảo quản
        </motion.p>
      </div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Button
          size="lg"
          onClick={scrollToProducts}
          className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-semibold px-8 py-6 rounded-xl shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 text-base md:text-lg"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Mua sắm ngay
        </Button>

        <Button
          size="lg"
          variant="outline"
          onClick={scrollToProducts}
          className="backdrop-blur-md bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 font-semibold px-8 py-6 rounded-xl shadow-lg transition-all duration-300 text-base md:text-lg"
        >
          <ArrowDown className="mr-2 h-5 w-5" />
          Khám phá
        </Button>
      </motion.div>
    </motion.div>
  );
};

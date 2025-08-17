import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import plant1 from "../assets/images/plant/plant-1.png";
import plant2 from "../assets/images/plant/plant-2.png";
import plant3 from "../assets/images/plant/plant-3.png";
import plant4 from "../assets/images/plant/plant-4.png";
import plant5 from "../assets/images/plant/plant-5.png";
import plant6 from "../assets/images/plant/plant-6.png";
import plant7 from "../assets/images/plant/plant-7.png";
import plant8 from "../assets/images/plant/plant-8.png";
import plant9 from "../assets/images/plant/plant-9.png";
import plant10 from "../assets/images/plant/plant-10.png";
import plant11 from "../assets/images/plant/plant-11.png";
import plant12 from "../assets/images/plant/plant-12.png";
import plant13 from "../assets/images/plant/plant-13.png";
import plant14 from "../assets/images/plant/plant-14.png";
import plant15 from "../assets/images/plant/plant-15.png";
import plantSound from "../assets/sounds/plant-grow.mp3";

const plantImages = [plant1, plant2, plant3, plant4, plant5, plant6, plant7, plant8, plant9, plant10, plant11, plant12, plant13, plant14, plant15];

const PlantProgressCircle = ({ totalTasks, completedTasks }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [prevLevel, setPrevLevel] = useState(1);
  const progress = Math.ceil((completedTasks / totalTasks) * 100);
  const newLevel = Math.min(15, Math.max(1, completedTasks + 1));

  useEffect(() => {
    if (newLevel !== currentLevel) {
      setPrevLevel(currentLevel);
      setCurrentLevel(newLevel);
      new Audio(plantSound).play();
    }
  }, [newLevel]);

  return (
    <div className="relative w-20 h-20 rounded-full border-4 border-green-500 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentLevel}
          src={plantImages[currentLevel - 1]}
          alt={`Plant ${currentLevel}`}
          className="w-16 h-16 object-contain"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      </AnimatePresence>
      <div className="absolute bottom-0 text-xs text-green-700 bg-white px-2 rounded-full">{progress}%</div>
    </div>
  );
};

export default PlantProgressCircle;

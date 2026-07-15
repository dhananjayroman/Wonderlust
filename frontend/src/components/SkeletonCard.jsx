import React from 'react';
import { motion } from 'framer-motion';

const SkeletonCard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-3 w-full"
    >
      <div className="w-full aspect-[4/3] bg-gray-200 rounded-2xl animate-pulse" />
      <div className="space-y-2">
        <div className="h-5 bg-gray-200 rounded-md w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded-md w-1/2 animate-pulse" />
        <div className="h-5 bg-gray-200 rounded-md w-1/3 animate-pulse mt-2" />
      </div>
    </motion.div>
  );
};

export default SkeletonCard;

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface NeuroscienceWidgetProps {
  title: string;
  content: string;
  showInitially?: boolean;
}

const NeuroscienceWidget: React.FC<NeuroscienceWidgetProps> = ({ 
  title, 
  content, 
  showInitially = false 
}) => {
  const [expanded, setExpanded] = useState(showInitially);
  
  return (
    <div className="bg-gray-700 bg-opacity-50 rounded-lg overflow-hidden border border-purple-800">
      <div 
        className="p-3 flex justify-between items-center cursor-pointer hover:bg-gray-700 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <span className="text-purple-300 mr-2">🧠</span>
          <h3 className="font-medium text-purple-300 text-sm">{title}</h3>
        </div>
        <span className="text-gray-400 text-sm">
          {expanded ? '▲' : '▼'}
        </span>
      </div>
      
      <motion.div
        initial={{ height: showInitially ? 'auto' : 0 }}
        animate={{ height: expanded ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-3 pt-0 text-xs text-gray-300 border-t border-purple-800 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
          <p>{content}</p>
          
          {/* Adiciona feedback visual positivo para reforçar interesse científico */}
          <motion.div 
            className="mt-3 flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <button 
              className="text-xs text-purple-300 flex items-center space-x-1 hover:text-purple-200"
              onClick={(e) => {
                e.stopPropagation();
                // Aqui em uma implementação real seria registrado o interesse em tópicos científicos
                // aumentando a frequência com que conteúdos educativos aparecem
              }}
            >
              <span>🔍</span>
              <span>Saiba mais</span>
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default NeuroscienceWidget; 
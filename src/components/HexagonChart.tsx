import React from 'react';

// Tipo para as dimensões do desenvolvimento pessoal
interface DevelopmentDimension {
  name: string;
  value: number;
  color: string;
}

interface HexagonChartProps {
  dimensions: DevelopmentDimension[];
  size?: number;
  maxValue?: number;
}

const HexagonChart: React.FC<HexagonChartProps> = ({ 
  dimensions, 
  size = 300, 
  maxValue = 100 
}) => {
  // Certificar-se de que temos exatamente 6 dimensões
  const validDimensions = dimensions.slice(0, 6);
  while (validDimensions.length < 6) {
    validDimensions.push({
      name: `Dimensão ${validDimensions.length + 1}`,
      value: 0,
      color: '#4A5568'
    });
  }

  // Configurações do hexágono
  const center = size / 2;
  const radius = size * 0.4;
  const angleStep = (Math.PI * 2) / 6;

  // Calcular os pontos dos hexágonos (referência e valor)
  const calculatePoints = (value: number) => {
    let points = '';
    for (let i = 0; i < 6; i++) {
      const angle = i * angleStep - Math.PI / 2; // Começar do topo
      const x = center + (radius * value / maxValue) * Math.cos(angle);
      const y = center + (radius * value / maxValue) * Math.sin(angle);
      points += `${x},${y} `;
    }
    return points.trim();
  };

  // Calcular pontos para os rótulos
  const getLabelPosition = (index: number) => {
    const angle = index * angleStep - Math.PI / 2; // Começar do topo
    const distance = radius * 1.2; // Colocar um pouco além do hexágono
    return {
      x: center + distance * Math.cos(angle),
      y: center + distance * Math.sin(angle)
    };
  };

  // Calcular alinhamento do texto
  const getLabelAlignment = (index: number) => {
    if (index === 0) return { textAnchor: 'middle', dominantBaseline: 'auto' };
    if (index === 3) return { textAnchor: 'middle', dominantBaseline: 'hanging' };
    
    if (index < 3) return { textAnchor: 'start', dominantBaseline: 'middle' };
    return { textAnchor: 'end', dominantBaseline: 'middle' };
  };

  return (
    <div className="flex justify-center items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grade de fundo */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((level, i) => (
          <polygon
            key={`grid-${i}`}
            points={calculatePoints(maxValue * level)}
            fill="none"
            stroke="#2D3748"
            strokeWidth="1"
            opacity={level * 0.4}
          />
        ))}

        {/* Linhas de referência */}
        {validDimensions.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          return (
            <line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={center + radius * Math.cos(angle)}
              y2={center + radius * Math.sin(angle)}
              stroke="#2D3748"
              strokeWidth="1"
              opacity="0.5"
            />
          );
        })}

        {/* Polígono de valor */}
        <polygon
          points={validDimensions.map((dim, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const value = dim.value / maxValue;
            return `${center + radius * value * Math.cos(angle)},${center + radius * value * Math.sin(angle)}`;
          }).join(' ')}
          fill="url(#hexGradient)"
          stroke="rgba(0,0,0,0)"
          strokeWidth="0"
          opacity="0.7"
        />

        {/* Gradiente para polígono */}
        <defs>
          <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0D47A1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#42A5F5" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Pontos de dados */}
        {validDimensions.map((dim, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const value = dim.value / maxValue;
          return (
            <circle
              key={`point-${i}`}
              cx={center + radius * value * Math.cos(angle)}
              cy={center + radius * value * Math.sin(angle)}
              r="4"
              fill={dim.color || '#FFF'}
              stroke="#0D47A1"
              strokeWidth="2"
            />
          );
        })}

        {/* Rótulos */}
        {validDimensions.map((dim, i) => {
          const pos = getLabelPosition(i);
          const align = getLabelAlignment(i);
          return (
            <text
              key={`label-${i}`}
              x={pos.x}
              y={pos.y}
              fill="#E2E8F0"
              fontSize="12"
              fontWeight="500"
              textAnchor={align.textAnchor}
              dominantBaseline={align.dominantBaseline}
            >
              {dim.name}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default HexagonChart; 
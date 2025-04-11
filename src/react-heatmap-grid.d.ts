declare module 'react-heatmap-grid' {
  export interface HeatMapProps {
    xLabels: string[];
    yLabels: string[];
    data: number[][];
    xLabelsLocation?: 'top' | 'bottom';
    xLabelsVisibility?: (index: number) => boolean;
    yLabelWidth?: number;
    cellStyle?: (background: string, value: number, min: number, max: number) => React.CSSProperties;
    cellRender?: (value: number) => string | null;
    title?: (value: number) => string;
  }

  const HeatMap: React.FC<HeatMapProps>;
  export default HeatMap;
} 
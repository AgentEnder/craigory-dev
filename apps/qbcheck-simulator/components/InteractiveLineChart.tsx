import { useState, useRef, useEffect } from 'react';

export interface ChartDataPoint {
  x: number; // Index or timestamp
  xLabel: string; // Display label for x-axis
  values: { [key: string]: number }; // Multiple metrics per point
  metadata?: { [key: string]: any }; // Additional hover info
}

export interface ChartLine {
  key: string; // Key in the values object
  label: string; // Display name
  color: string; // Line color
  strokeWidth?: number;
  strokeDasharray?: string;
  pointRadius?: number;
  unit?: string; // e.g., '%', 'ms'
}

interface InteractiveLineChartProps {
  data: ChartDataPoint[];
  lines: ChartLine[];
  width?: number;
  height?: number;
  title: string;
  subtitle?: string;
  yAxisLabel?: string;
  xAxisLabel?: string;
  yRange?: { min?: number; max?: number };
  showGrid?: boolean;
  interpretation?: string;
}

interface HoverInfo {
  x: number;
  y: number;
  dataIndex: number;
  visible: boolean;
}

export function InteractiveLineChart({
  data,
  lines,
  width, // Optional override width
  height = 350,
  title,
  subtitle,
  yAxisLabel,
  xAxisLabel = 'Assessment Number',
  yRange,
  showGrid = true,
  interpretation,
}: InteractiveLineChartProps) {
  const [hoverInfo, setHoverInfo] = useState<HoverInfo>({
    x: 0,
    y: 0,
    dataIndex: -1,
    visible: false,
  });
  const [containerWidth, setContainerWidth] = useState<number>(800); // Default fallback
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Measure container width on mount and resize
  useEffect(() => {
    const measureContainer = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerWidth(rect.width);
      }
    };

    measureContainer();
    window.addEventListener('resize', measureContainer);
    return () => window.removeEventListener('resize', measureContainer);
  }, []);

  if (data.length === 0) return null;

  // Use provided width or container width
  const effectiveWidth = width || containerWidth;

  // Calculate data range
  const allValues = data.flatMap((point) =>
    lines.map((line) => point.values[line.key]).filter((v) => v !== undefined)
  );
  const finalDisplayMin = yRange?.min ?? Math.min(...allValues, 0);
  const finalDisplayMax = yRange?.max ?? Math.max(...allValues, 100);

  // Calculate Y-axis ticks
  const yTicks: number[] = [];
  const tickCount = 5;
  for (let i = 0; i <= tickCount; i++) {
    const value =
      finalDisplayMin + (finalDisplayMax - finalDisplayMin) * (i / tickCount);
    yTicks.push(value);
  }

  // Helper to format tick values (same format as displayed)
  const formatValue = (value: number, unit?: string) => {
    const formatted =
      typeof value === 'number'
        ? value % 1 === 0
          ? value.toString()
          : value.toFixed(1)
        : value;
    return `${formatted}${unit || ''}`;
  };

  // Calculate maximum tick label width
  const maxTickLabelWidth = Math.max(
    ...yTicks.map((tick) => {
      const label = formatValue(tick, lines[0]?.unit);
      // Approximate width: ~7px per character for 12px font
      return label.length * 7;
    })
  );

  // Dynamic left padding based on tick labels and Y-axis label
  const tickLabelSpace = maxTickLabelWidth + 20; // tick width + gap from axis
  const yAxisLabelSpace = yAxisLabel ? 40 : 0; // space for rotated label if present
  const leftPadding = tickLabelSpace + yAxisLabelSpace + 10; // total with margin

  // Calculate maximum legend text width
  const maxLegendTextWidth = Math.max(...lines.map((line) => {
    // Approximate width: ~7px per character for 11px font
    return line.label.length * 6.5;
  }));
  
  // Dynamic right padding for legend
  const legendBoxPadding = 10; // padding inside legend box
  const legendLineWidth = 15; // width of line sample
  const legendTextGap = 20; // gap between line and text
  const legendMargin = 20; // margin from chart edge
  const rightPadding = legendLineWidth + legendTextGap + maxLegendTextWidth + legendBoxPadding + legendMargin;

  // Padding configuration
  const padding = {
    top: 30,
    right: rightPadding,
    bottom: 80,
    left: leftPadding,
  };

  // Ensure minimum chart width
  const minChartWidth = 300;
  const totalPaddingNeeded = padding.left + padding.right;
  const availableChartWidth = effectiveWidth - totalPaddingNeeded;
  
  // If container is too small, we need to adjust
  const chartWidth = Math.max(minChartWidth, availableChartWidth);
  const actualSvgWidth = chartWidth + totalPaddingNeeded;
  const chartHeight = height - padding.top - padding.bottom;

  // Ensure we have positive dimensions
  if (chartWidth < minChartWidth || chartHeight <= 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-500 text-center py-8">
          Chart area too small to display. Container needs at least {minChartWidth + totalPaddingNeeded}px width.
        </p>
      </div>
    );
  }

  // Scale functions (finalDisplayMin and finalDisplayMax already calculated above)
  const xScale = (index: number) => (index / (data.length - 1)) * chartWidth;
  const yScale = (value: number) =>
    chartHeight -
    ((value - finalDisplayMin) / (finalDisplayMax - finalDisplayMin)) *
      chartHeight;

  // Handle mouse events
  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left - padding.left;
    const mouseY = event.clientY - rect.top - padding.top;

    // Check if mouse is within chart bounds
    if (
      mouseX < 0 ||
      mouseX > chartWidth ||
      mouseY < 0 ||
      mouseY > chartHeight
    ) {
      setHoverInfo((prev) => ({ ...prev, visible: false }));
      return;
    }

    // Find which data point (if any) the mouse is close to
    let closestIndex = -1;
    let closestDistance = Infinity;

    // Check distance to each data point
    for (let i = 0; i < data.length; i++) {
      const pointX = xScale(i);
      const distance = Math.abs(mouseX - pointX);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    }

    // Define hover zone radius around each data point
    const hoverRadius =
      data.length === 1
        ? 60
        : Math.min(60, Math.abs(xScale(1) - xScale(0)) * 0.3); // 30% of distance between points, max 60px

    // Only show hover if we're within the hover radius of a data point
    if (closestIndex >= 0 && closestDistance <= hoverRadius) {
      setHoverInfo({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        dataIndex: closestIndex,
        visible: true,
      });
    } else {
      setHoverInfo((prev) => ({ ...prev, visible: false }));
    }
  };

  const handleMouseLeave = () => {
    setHoverInfo((prev) => ({ ...prev, visible: false }));
  };

  // Generate path data for each line
  const linePaths = lines.map((line) => {
    const pathData = data
      .map((point, index) => {
        const value = point.values[line.key];
        if (value === undefined) return '';
        return `${index === 0 ? 'M' : 'L'} ${xScale(index)} ${yScale(value)}`;
      })
      .filter(Boolean)
      .join(' ');

    return { ...line, pathData };
  });

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
    >
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>

      <div className="relative flex justify-center overflow-x-auto">
        <svg
          ref={svgRef}
          width={actualSvgWidth}
          height={height}
          className="border rounded"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <g transform={`translate(${padding.left}, ${padding.top})`}>
            {/* Grid lines */}
            {showGrid &&
              yTicks.map((tick, i) => (
                <g key={i}>
                  <line
                    x1={0}
                    y1={yScale(tick)}
                    x2={chartWidth}
                    y2={yScale(tick)}
                    stroke="#e5e7eb"
                    strokeWidth={1}
                  />
                  <text
                    x={-15}
                    y={yScale(tick)}
                    textAnchor="end"
                    dominantBaseline="middle"
                    fontSize="12"
                    fill="#6b7280"
                  >
                    {formatValue(tick, lines[0]?.unit)}
                  </text>
                </g>
              ))}

            {/* Lines */}
            {linePaths.map((line, lineIndex) => (
              <g key={line.key}>
                <path
                  d={line.pathData}
                  fill="none"
                  stroke={line.color}
                  strokeWidth={line.strokeWidth || 2}
                  strokeDasharray={line.strokeDasharray}
                  style={{
                    opacity: hoverInfo.visible ? 0.7 : 1,
                    transition: 'opacity 0.2s ease',
                  }}
                />
              </g>
            ))}

            {/* Data points */}
            {data.map((point, pointIndex) => (
              <g key={pointIndex}>
                {lines.map((line) => {
                  const value = point.values[line.key];
                  if (value === undefined || line.pointRadius === 0)
                    return null;

                  const isActive =
                    hoverInfo.visible && hoverInfo.dataIndex === pointIndex;

                  return (
                    <circle
                      key={line.key}
                      cx={xScale(pointIndex)}
                      cy={yScale(value)}
                      r={
                        isActive
                          ? (line.pointRadius || 3) + 2
                          : line.pointRadius || 3
                      }
                      fill={line.color}
                      stroke={isActive ? line.color : '#ffffff'}
                      strokeWidth={isActive ? 3 : 1}
                      className="cursor-pointer"
                      style={{
                        opacity: hoverInfo.visible ? (isActive ? 1 : 0.4) : 0.8,
                        transition: 'all 0.2s ease',
                        filter: isActive
                          ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                          : 'none',
                      }}
                    />
                  );
                })}

                {/* Hover target - larger invisible circle for easier interaction */}
                <circle
                  cx={xScale(pointIndex)}
                  cy={yScale(point.values[lines[0]?.key] || 0)}
                  r={15}
                  fill="transparent"
                  className="cursor-pointer"
                />
              </g>
            ))}

            {/* Hover line */}
            {hoverInfo.visible && hoverInfo.dataIndex >= 0 && (
              <line
                x1={xScale(hoverInfo.dataIndex)}
                y1={0}
                x2={xScale(hoverInfo.dataIndex)}
                y2={chartHeight}
                stroke="#6b7280"
                strokeWidth={1}
                strokeDasharray="3,3"
                opacity={0.7}
              />
            )}

            {/* Axes */}
            <line
              x1={0}
              y1={chartHeight}
              x2={chartWidth}
              y2={chartHeight}
              stroke="#374151"
              strokeWidth={1}
            />
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={chartHeight}
              stroke="#374151"
              strokeWidth={1}
            />

            {/* Axis labels */}
            <text
              x={chartWidth / 2}
              y={chartHeight + 40}
              textAnchor="middle"
              fontSize="12"
              fill="#374151"
              fontWeight="medium"
            >
              {xAxisLabel}
            </text>

            {yAxisLabel && (
              <text
                x={-(tickLabelSpace + yAxisLabelSpace / 2)}
                y={chartHeight / 2}
                textAnchor="middle"
                fontSize="12"
                fill="#374151"
                fontWeight="medium"
                transform={`rotate(-90, ${-(
                  tickLabelSpace +
                  yAxisLabelSpace / 2
                )}, ${chartHeight / 2})`}
              >
                {yAxisLabel}
              </text>
            )}
          </g>

          {/* Right side legend */}
          <g
            transform={`translate(${padding.left + chartWidth + 15}, ${
              padding.top
            })`}
          >
            <rect
              x={-5}
              y={-5}
              width={legendLineWidth + legendTextGap + maxLegendTextWidth + 10}
              height={Math.max(60, 25 + lines.length * 18)}
              fill="rgba(249, 250, 251, 0.95)"
              stroke="#e5e7eb"
              strokeWidth={1}
              rx={4}
            />
            <text x={5} y={10} fontSize="12" fontWeight="bold" fill="#374151">
              Legend
            </text>

            {lines.map((line, index) => (
              <g key={line.key} transform={`translate(5, ${25 + index * 18})`}>
                <line
                  x1={0}
                  y1={0}
                  x2={15}
                  y2={0}
                  stroke={line.color}
                  strokeWidth={line.strokeWidth || 2}
                  strokeDasharray={line.strokeDasharray}
                  style={{
                    opacity: hoverInfo.visible ? 0.7 : 1,
                    transition: 'opacity 0.2s ease',
                  }}
                />
                <text
                  x={20}
                  y={4}
                  fontSize="11"
                  fill="#374151"
                  style={{
                    opacity: hoverInfo.visible ? 0.7 : 1,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  {line.label}
                </text>
              </g>
            ))}
          </g>
        </svg>

        {/* Hover tooltip */}
        {hoverInfo.visible && hoverInfo.dataIndex >= 0 && (
          <div
            className="absolute text-white p-3 rounded-lg shadow-xl pointer-events-none z-10 min-w-48 backdrop-blur-sm border transition-all duration-200 ease-out"
            style={{
              backgroundColor: 'rgba(17, 24, 39, 0.8)', // Semi-transparent dark background
              borderColor: 'rgba(75, 85, 99, 0.3)', // Subtle border
              backdropFilter: 'blur(2px)',
              left: (() => {
                // Position tooltip away from data points
                const dataPointX = padding.left + xScale(hoverInfo.dataIndex);
                const tooltipWidth = 200;
                const buffer = 40;

                // Compare data point position within the chart area (not full width)
                const chartCenterX = padding.left + chartWidth / 2;

                // If data point is in left half of chart area, show tooltip to the RIGHT
                if (dataPointX < chartCenterX) {
                  return Math.min(
                    dataPointX + buffer,
                    actualSvgWidth - tooltipWidth - 10
                  );
                } else {
                  // If data point is in right half of chart area, show tooltip to the LEFT
                  return Math.max(dataPointX - tooltipWidth - buffer, 10);
                }
              })(),
              top: Math.max(20, Math.min(hoverInfo.y - 60, height - 120)),
            }}
          >
            <div className="font-medium text-sm mb-2">
              {data[hoverInfo.dataIndex].xLabel}
            </div>
            <div className="space-y-1 text-xs">
              {lines.map((line) => {
                const value = data[hoverInfo.dataIndex].values[line.key];
                if (value === undefined) return null;

                return (
                  <div
                    key={line.key}
                    className="flex justify-between items-center p-1 rounded transition-colors hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-0.5 rounded"
                        style={{
                          backgroundColor: line.color,
                          boxShadow: '0 0 4px rgba(0,0,0,0.3)',
                        }}
                      />
                      <span className="font-medium">{line.label}:</span>
                    </div>
                    <span className="font-bold" style={{ color: line.color }}>
                      {formatValue(value, line.unit)}
                    </span>
                  </div>
                );
              })}

              {/* Additional metadata */}
              {data[hoverInfo.dataIndex].metadata && (
                <div className="border-t border-gray-700 pt-1 mt-2">
                  {Object.entries(data[hoverInfo.dataIndex].metadata || {}).map(
                    ([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key}:</span>
                        <span>{String(value)}</span>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {interpretation && (
        <div className="mt-4 text-sm text-gray-600">
          <p>
            <strong>Interpretation:</strong> {interpretation}
          </p>
        </div>
      )}
    </div>
  );
}

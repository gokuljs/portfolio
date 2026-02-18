'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { skillNodes, categoryColors, getNodeColor, type SkillNode } from './graph-config';

interface SkillGraphProps {
  className?: string;
}

const SkillGraph: React.FC<SkillGraphProps> = ({ className = '' }) => {
  const [visibleNodes, setVisibleNodes] = useState<Set<string>>(new Set());
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    const nodeIds = skillNodes.map((n) => n.id);
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < nodeIds.length) {
        setVisibleNodes((prev) => new Set([...prev, nodeIds[currentIndex]]));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const getConnectedNodes = useCallback((nodeId: string): Set<string> => {
    const connected = new Set<string>();
    const node = skillNodes.find((n) => n.id === nodeId);
    if (node) {
      node.connections.forEach((c) => connected.add(c));
      skillNodes.forEach((n) => {
        if (n.connections.includes(nodeId)) {
          connected.add(n.id);
        }
      });
    }
    return connected;
  }, []);

  const activeNode = hoveredNode || selectedNode;
  const connectedNodes = activeNode ? getConnectedNodes(activeNode) : new Set<string>();

  const connections = useMemo(() => {
    const conns: Array<{ from: SkillNode; to: SkillNode; key: string }> = [];
    const seen = new Set<string>();

    skillNodes.forEach((node) => {
      node.connections.forEach((targetId) => {
        const target = skillNodes.find((n) => n.id === targetId);
        if (target) {
          const key = [node.id, targetId].sort().join('-');
          if (!seen.has(key)) {
            seen.add(key);
            conns.push({ from: node, to: target, key });
          }
        }
      });
    });

    return conns;
  }, []);

  const getNodeSize = (size: 'large' | 'medium' | 'small', isActive: boolean, isConnected: boolean): number => {
    const baseSize = size === 'large' ? 2.2 : size === 'medium' ? 1.6 : 1.2;
    if (isActive) return baseSize * 2.5;
    if (isConnected) return baseSize * 1.8;
    return baseSize;
  };

  const isNodeHighlighted = (nodeId: string): boolean => {
    if (!activeNode) return true;
    return nodeId === activeNode || connectedNodes.has(nodeId);
  };

  const isConnectionHighlighted = (fromId: string, toId: string): boolean => {
    if (!activeNode) return false;
    return (
      (fromId === activeNode && connectedNodes.has(toId)) ||
      (toId === activeNode && connectedNodes.has(fromId))
    );
  };

  const shouldShowLabel = (nodeId: string): boolean => {
    if (!activeNode) return false;
    return nodeId === activeNode || connectedNodes.has(nodeId);
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      <svg
        className="w-full h-[calc(100%-32px)]"
        viewBox="0 0 100 95"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {Object.values(categoryColors).map((cat) => (
            <React.Fragment key={cat.id}>
              <filter id={`glow-${cat.id}`} x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="0.6" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id={`glow-${cat.id}-active`} x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </React.Fragment>
          ))}
        </defs>

        <AnimatePresence>
          {connections.map(({ from, to, key }) => {
            const isVisible = visibleNodes.has(from.id) && visibleNodes.has(to.id);
            if (!isVisible) return null;

            const highlighted = isConnectionHighlighted(from.id, to.id);
            const dimmed = activeNode && !highlighted;

            return (
              <motion.line
                key={key}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: 1,
                  opacity: dimmed ? 0.02 : highlighted ? 0.8 : 0.08,
                  strokeWidth: highlighted ? 0.35 : 0.08,
                }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                stroke={highlighted ? getNodeColor(from.category) : 'rgba(255,255,255,0.5)'}
                strokeLinecap="round"
              />
            );
          })}
        </AnimatePresence>

        <AnimatePresence>
          {skillNodes.map((node, index) => {
            if (!visibleNodes.has(node.id)) return null;

            const color = getNodeColor(node.category);
            const highlighted = isNodeHighlighted(node.id);
            const isActive = node.id === activeNode;
            const isConnected = connectedNodes.has(node.id) && !isActive;
            const showLabel = shouldShowLabel(node.id);
            const size = getNodeSize(node.size, isActive, isConnected);

            return (
              <motion.g
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: highlighted ? 1 : 0.2,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 25,
                  delay: index * 0.012,
                }}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
              >
                {(isActive || isConnected) && (
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    fill={color}
                    opacity={0.15}
                    initial={{ r: 0 }}
                    animate={{ r: size * 2.5 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  />
                )}

                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  fill={color}
                  filter={isActive ? `url(#glow-${node.category}-active)` : `url(#glow-${node.category})`}
                  initial={{ r: 0 }}
                  animate={{ r: size }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />

                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  fill="#ffffff"
                  opacity={isActive ? 0.6 : 0.35}
                  initial={{ r: 0 }}
                  animate={{ r: size * 0.35 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />

                <AnimatePresence>
                  {showLabel && (
                    <motion.g
                      initial={{ opacity: 0, y: 2 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 2 }}
                      transition={{ duration: 0.15 }}
                    >
                      <motion.rect
                        x={node.x - (node.label.length * 1.1)}
                        y={node.y + size + 1.5}
                        width={node.label.length * 2.2}
                        height={3.5}
                        rx={0.8}
                        fill="rgba(0,0,0,0.85)"
                      />
                      <motion.text
                        x={node.x}
                        y={node.y + size + 4}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize={isActive ? 2.4 : 2}
                        fontWeight={isActive ? 600 : 500}
                        style={{ fontFamily: 'system-ui, sans-serif' }}
                      >
                        {node.label}
                      </motion.text>
                    </motion.g>
                  )}
                </AnimatePresence>
              </motion.g>
            );
          })}
        </AnimatePresence>
      </svg>

      <div className="absolute bottom-0 left-0 right-0 py-2 px-3 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center">
          {Object.values(categoryColors).map((cat) => (
            <div key={cat.id} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-[10px] md:text-xs text-white/70 whitespace-nowrap">{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.12 }}
            className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/80 backdrop-blur-sm rounded-lg"
          >
            <p className="text-xs text-white font-semibold whitespace-nowrap">
              {skillNodes.find((n) => n.id === activeNode)?.label}
            </p>
            <p className="text-[9px] text-white/50 text-center">
              {connectedNodes.size} connections
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillGraph;

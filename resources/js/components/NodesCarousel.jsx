import { useState, useMemo, useRef, useEffect } from 'react';
import { n8nNodes, nodeCategories, getNodesByCategory, searchNodes } from '../data/n8nNodes.js';

export default function NodesCarousel({ onNodeDragStart }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAutoScrollActive, setIsAutoScrollActive] = useState(true);
  const scrollContainerRef = useRef(null);
  const nodesListRef = useRef(null);
  const animationFrameRef = useRef(null);

  const filteredNodes = useMemo(() => {
    if (searchQuery.trim()) {
      return searchNodes(searchQuery);
    }
    return getNodesByCategory(selectedCategory);
  }, [selectedCategory, searchQuery]);

  const handleDragStart = (event, node) => {
    console.log('🚀 Drag started for node:', node);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(node));
    console.log('📦 Data set in dataTransfer');
    if (onNodeDragStart) {
      onNodeDragStart(node);
    }
  };

  // Infinite loop nodes - triple the array for seamless looping
  const loopedNodes = useMemo(() => {
    if (filteredNodes.length === 0) return [];
    return [...filteredNodes, ...filteredNodes, ...filteredNodes];
  }, [filteredNodes]);

  // Auto-scroll effect - smooth continuous upward scroll
  useEffect(() => {
    const container = nodesListRef.current;
    if (!container) {
      console.log('❌ No container ref');
      return;
    }

    console.log('✅ Auto-scroll effect started', { 
      isActive: isAutoScrollActive, 
      scrollHeight: container.scrollHeight,
      clientHeight: container.clientHeight,
      maxScroll: container.scrollHeight - container.clientHeight
    });

    let lastTime = performance.now();
    const scrollSpeed = 30; // pixels per second (slow and subtle)

    const animate = (currentTime) => {
      if (!container) return;

      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      if (isAutoScrollActive) {
        const maxScroll = container.scrollHeight - container.clientHeight;
        
        if (maxScroll > 0) {
          let newScrollTop = container.scrollTop + (scrollSpeed * deltaTime);
          
          // Reset scroll to create infinite loop effect (using the tripled array)
          const resetPoint = container.scrollHeight * 0.66; // Reset at 2/3 point
          if (newScrollTop >= resetPoint) {
            newScrollTop = container.scrollHeight * 0.33; // Jump back to 1/3 point
          }
          
          container.scrollTop = newScrollTop;
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAutoScrollActive, loopedNodes.length]);

  // Scroll category horizontally
  const scrollToCategory = (dir) => {
    scrollContainerRef.current?.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  return (
    <div className="w-96 flex-shrink-0 bg-yellow-100 border-r-4 border-black flex flex-col h-full relative overflow-hidden" style={{ boxShadow: '4px 0px 0px #000', fontFamily: "'Comic Neue', cursive" }}>
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="relative p-3 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 border-b-4 border-black flex-shrink-0" style={{ boxShadow: '0px 4px 0px #000' }}>
          <div className="relative z-10">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="SEARCH..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 pl-9 text-sm bg-white border-3 border-black rounded-lg text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-black font-bold"
                style={{ boxShadow: '3px 3px 0px #000' }}
              />
              <svg className="absolute left-3 top-2.5 h-4 w-4 text-black stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="relative px-3 py-2 bg-pink-200 border-b-4 border-black flex-shrink-0" style={{ boxShadow: '0px 3px 0px #000' }}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollToCategory('left')}
              className="tactile-button flex-shrink-0 w-7 h-7 bg-cyan-400 rounded-lg border-2 border-black flex items-center justify-center"
              style={{ boxShadow: '2px 2px 0px #000' }}
            >
              <svg className="w-4 h-4 text-black stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div ref={scrollContainerRef} className="flex-1 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 pb-1">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`tactile-button flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-black ${
                    selectedCategory === 'All' ? 'bg-lime-400 text-black' : 'bg-white text-black'
                  }`}
                  style={{ boxShadow: '2px 2px 0px #000' }}
                >
                  ✨ ALL
                </button>
                {nodeCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`tactile-button flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-black ${
                      selectedCategory === category ? 'bg-lime-400 text-black' : 'bg-white text-black'
                    }`}
                    style={{ boxShadow: '2px 2px 0px #000' }}
                  >
                    {category.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => scrollToCategory('right')}
              className="tactile-button flex-shrink-0 w-7 h-7 bg-cyan-400 rounded-lg border-2 border-black flex items-center justify-center"
              style={{ boxShadow: '2px 2px 0px #000' }}
            >
              <svg className="w-4 h-4 text-black stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Nodes List */}
        <div 
          ref={nodesListRef}
          className="flex-1 overflow-y-auto scrollbar-hide px-3 py-3"
          onMouseEnter={() => setIsAutoScrollActive(false)}
          onMouseLeave={() => setIsAutoScrollActive(true)}
        >
          {filteredNodes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-600 mb-1">No nodes found</p>
              <p className="text-xs text-slate-400">Try a different search</p>
            </div>
          ) : (
            <div className="space-y-2">
              {loopedNodes.map((node, idx) => (
                <div
                  key={`${node.id}-${idx}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, node)}
                  className="tactile-button group relative bg-white rounded-lg p-3 border-4 border-black cursor-move"
                  style={{ userSelect: 'none', boxShadow: '3px 3px 0px #000' }}
                >
                  
                  <div className="relative z-10 flex items-center gap-3">
                    <div
                      className="flex items-center justify-center w-12 h-12 rounded-lg text-2xl border-3 border-black"
                      style={{
                        background: node.color,
                        color: '#000',
                        boxShadow: '2px 2px 0px #000'
                      }}
                    >
                      {node.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-black truncate" style={{ fontFamily: "'Comic Neue', cursive" }}>{node.name.toUpperCase()}</div>
                      <div className="text-xs text-black truncate">{node.description}</div>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-yellow-300 rounded-full p-1 border-2 border-black">
                      <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
          scroll-behavior: auto;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .tactile-button {
          transition: transform 0.06s ease-out, box-shadow 0.06s ease-out;
        }
        .tactile-button:active {
          transform: translate(2px, 2px);
          box-shadow: 0px 0px 0px #000 !important;
        }
      `}</style>
    </div>
  );
}

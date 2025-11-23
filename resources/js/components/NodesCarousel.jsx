import { useState, useMemo, useRef, useEffect } from 'react';
import { n8nNodes, nodeCategories, getNodesByCategory, searchNodes } from '../data/n8nNodes.js';
import { useTheme } from '../contexts/ThemeContext.jsx';

export default function NodesCarousel({ onNodeDragStart }) {
  const { theme, isComic, THEMES } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAutoScrollActive, setIsAutoScrollActive] = useState(true);
  const scrollContainerRef = useRef(null);
  const nodesListRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  const styles = useMemo(() => {
    if (isComic) {
      return {
        mainContainer: 'h-full min-h-0 flex flex-col border-r-4 border-black bg-white',
        searchContainer: 'p-3 border-b-4 border-black bg-yellow-100',
        header: 'bg-pink-200 border-b-4 border-black shadow-[0px_3px_0px_#000]',
        navBtn: 'tactile-button bg-cyan-400 border-2 border-black shadow-[2px_2px_0px_#000]',
        catBtn: (active) => `tactile-button border-2 border-black shadow-[2px_2px_0px_#000] ${active ? 'bg-lime-400 text-black' : 'bg-white text-black'}`,
        list: '',
        card: 'tactile-button bg-white rounded-lg p-3 border-4 border-black shadow-[3px_3px_0px_#000]',
        iconWrapper: 'border-3 border-black shadow-[2px_2px_0px_#000]',
        iconColor: (node) => ({ background: node.color, color: '#000' }),
        title: 'font-bold text-black',
        desc: 'text-black',
        font: { fontFamily: "'Comic Neue', cursive" },
        addIcon: 'opacity-0 group-hover:opacity-100 bg-yellow-300 rounded-full p-1 border-2 border-black'
      };
    }

    switch (theme) {
      case THEMES.HACKER:
        return {
          mainContainer: 'h-full min-h-0 flex flex-col border-r border-green-900 bg-black',
          searchContainer: 'p-3 border-b border-green-900 bg-black',
          header: 'bg-black border-b border-green-900',
          navBtn: 'bg-black text-green-500 border border-green-900 hover:bg-green-900/20',
          catBtn: (active) => `border ${active ? 'bg-green-900/50 text-green-400 border-green-500' : 'bg-black text-green-600 border-green-900 hover:border-green-700'}`,
          list: 'bg-black',
          card: 'bg-black border border-green-900 rounded-md p-3 hover:border-green-500 hover:shadow-[0_0_10px_rgba(0,255,0,0.2)] text-green-500',
          iconWrapper: 'rounded-lg',
          iconColor: (node) => ({ background: 'rgba(0, 255, 0, 0.1)', color: '#4ade80' }),
          title: 'font-mono text-green-400 font-bold',
          desc: 'font-mono text-green-700 text-xs',
          font: {},
          addIcon: 'text-green-700 group-hover:text-green-400'
        };
      case THEMES.TERMINAL:
        return {
          mainContainer: 'h-full min-h-0 flex flex-col border-r border-amber-900 bg-slate-950',
          searchContainer: 'p-3 border-b border-amber-900 bg-slate-950',
          header: 'bg-slate-950 border-b border-amber-900',
          navBtn: 'bg-slate-950 text-amber-500 border border-amber-900 hover:bg-amber-900/20',
          catBtn: (active) => `border ${active ? 'bg-amber-900/40 text-amber-400 border-amber-600' : 'bg-slate-950 text-amber-600 border-amber-900 hover:border-amber-700'}`,
          list: 'bg-slate-950',
          card: 'bg-slate-950 border border-amber-900 rounded-md p-3 hover:border-amber-500 text-amber-500',
          iconWrapper: 'rounded-lg',
          iconColor: (node) => ({ background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24' }),
          title: 'font-mono text-amber-500 font-bold',
          desc: 'font-mono text-amber-700 text-xs',
          font: {},
          addIcon: 'text-amber-700 group-hover:text-amber-400'
        };
      case THEMES.DARK:
        return {
          mainContainer: 'h-full min-h-0 flex flex-col border-r border-gray-700 bg-gray-900',
          searchContainer: 'p-3 border-b border-gray-700 bg-gray-900',
          header: 'bg-gray-900 border-b border-gray-800',
          navBtn: 'bg-gray-800 text-gray-400 hover:bg-gray-700',
          catBtn: (active) => (active ? 'bg-blue-900/50 text-blue-400' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'),
          list: 'bg-gray-900',
          card: 'bg-gray-800 border border-gray-700 rounded-md p-3 hover:border-blue-500 hover:bg-gray-750',
          iconWrapper: 'rounded-lg',
          iconColor: (node) => ({ background: `${node.color}20`, color: node.color }),
          title: 'font-semibold text-gray-200',
          desc: 'text-gray-500',
          font: {},
          addIcon: 'text-gray-600 group-hover:text-blue-400'
        };
      default:
        return {
          mainContainer: 'h-full min-h-0 flex flex-col border-r border-slate-200 bg-white',
          searchContainer: 'p-3 border-b border-slate-200 bg-slate-50',
          header: 'bg-slate-50 border-b border-slate-200',
          navBtn: 'bg-slate-100 hover:bg-slate-200 text-slate-600',
          catBtn: (active) => (active ? 'bg-blue-100 text-blue-700' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'),
          list: 'bg-slate-50',
          card: 'bg-white border border-slate-200 rounded-md p-3 hover:border-blue-400 hover:shadow-md',
          iconWrapper: 'rounded-lg',
          iconColor: (node) => ({ background: `${node.color}20`, color: node.color }),
          title: 'font-semibold text-slate-700',
          desc: 'text-slate-500',
          font: {},
          addIcon: 'text-slate-300 group-hover:text-blue-500'
        };
    }
  }, [theme, isComic]);

  const filteredNodes = useMemo(() => {
    if (searchQuery.trim()) {
      return searchNodes(searchQuery);
    }
    return getNodesByCategory(selectedCategory);
  }, [selectedCategory, searchQuery]);

  const loopedNodes = useMemo(() => {
    if (filteredNodes.length === 0) return [];
    return [...filteredNodes, ...filteredNodes];
  }, [filteredNodes]);

  useEffect(() => {
    const container = nodesListRef.current;
    if (!container) return;

    const sh = container.scrollHeight;
    const ch = container.clientHeight;
    const canScroll = sh > ch;

    console.log(
      `Carousel v4.28: scrollHeight=${sh}, clientHeight=${ch}, canScroll=${canScroll}, active=${isAutoScrollActive}`
    );

    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }

    if (!isAutoScrollActive || !canScroll) return;

    scrollIntervalRef.current = window.setInterval(() => {
      const el = nodesListRef.current;
      if (!el) return;

      const halfHeight = el.scrollHeight / 2;
      if (halfHeight <= 0) return;

      if (el.scrollTop >= halfHeight) {
        el.scrollTop = el.scrollTop - halfHeight;
      }

      el.scrollTop += 1;
    }, 30);

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    };
  }, [isAutoScrollActive, loopedNodes.length]);

  const handleMouseEnter = () => {
    setIsAutoScrollActive(false);
  };

  const handleMouseLeave = () => {
    setIsAutoScrollActive(true);
  };

  const handleWheel = () => {
    if (isAutoScrollActive) {
      setIsAutoScrollActive(false);
    }
  };

  const scrollToCategory = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleDragStart = (event, node) => {
    console.log('🚀 Drag started for node:', node);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(node));
    console.log('📦 Data set in dataTransfer');
    if (onNodeDragStart) {
      onNodeDragStart(node);
    }
  };

  return (
    <div className={styles.mainContainer}>
      {/* Header: search + category chips (fixed height) */}
      <div className={`flex-shrink-0 ${styles.searchContainer}`}>
        <div className="relative mb-3">
          <input
            type="text"
            placeholder={isComic ? 'Search nodes...' : 'Search components...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 text-sm outline-none transition ${
              isComic
                ? 'bg-white border-3 border-black rounded-lg shadow-[3px_3px_0px_#000] font-bold'
                : theme === THEMES.HACKER
                ? 'bg-black border border-green-700 text-green-500 placeholder-green-800 focus:border-green-500 focus:ring-1 focus:ring-green-500'
                : theme === THEMES.TERMINAL
                ? 'bg-slate-950 border border-amber-900 text-amber-500 placeholder-amber-800 focus:border-amber-600 focus:ring-1 focus:ring-amber-600'
                : theme === THEMES.DARK
                ? 'bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                : 'bg-white border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            }`}
          />
          <svg
            className={`absolute left-3 top-2.5 w-4 h-4 ${isComic ? 'text-black' : 'text-slate-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className={`rounded-xl p-2 ${styles.header}`}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollToCategory('left')}
              className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition ${styles.navBtn}`}
            >
              <svg
                className={`w-4 h-4 ${isComic ? 'text-black stroke-[3]' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div ref={scrollContainerRef} className="flex-1 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 pb-1">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition ${styles.catBtn(
                    selectedCategory === 'All'
                  )}`}
                >
                  {isComic ? '✨ ALL' : 'All'}
                </button>
                {nodeCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition ${styles.catBtn(
                      selectedCategory === category
                    )}`}
                  >
                    {category.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => scrollToCategory('right')}
              className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition ${styles.navBtn}`}
            >
              <svg
                className={`w-4 h-4 ${isComic ? 'text-black stroke-[3]' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable auto-scrolling carousel list (takes remaining height) */}
      <div
        ref={nodesListRef}
        className={`flex-1 overflow-y-scroll scrollbar-hide auto-scroll-container px-3 py-3 ${styles.list}`}
        style={{ scrollBehavior: 'auto', overflowY: 'scroll', minHeight: 0 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
      >
        {filteredNodes.length === 0 ? (
          <div className="text-center py-12">
            <div
              className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                isComic ? 'bg-gray-100 border-2 border-black' : 'bg-slate-100'
              }`}
            >
              <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold mb-1 text-slate-600">No nodes found</p>
            <p className="text-xs text-slate-400">Try a different search</p>
          </div>
        ) : (
          <div className="space-y-2">
            {loopedNodes.map((node, idx) => (
              <div
                key={`${node.id}-${idx}`}
                draggable
                onDragStart={(e) => handleDragStart(e, node)}
                className={`group relative cursor-move select-none transition-transform ${styles.card}`}
              >
                <div className="relative z-10 flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-10 h-10 text-xl ${styles.iconWrapper}`}
                    style={styles.iconColor(node)}
                  >
                    {node.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className={`text-sm truncate ${styles.title}`} style={styles.font}>
                      {node.name.toUpperCase()}
                    </div>
                    <div className={`text-xs truncate ${styles.desc}`}>{node.description}</div>
                  </div>

                  <div className={`transition-opacity duration-300 ${styles.addIcon}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={isComic ? 3 : 2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
          scroll-behavior: auto !important;
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
        .auto-scroll-container {
          overflow-y: scroll;
          scroll-behavior: auto !important;
          overscroll-behavior: contain;
        }
      `}</style>
    </div>
  );
}

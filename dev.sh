#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# PID file to track processes
PID_FILE=".dev-pids"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Shutting down development servers...${NC}"
    
    if [ -f "$PID_FILE" ]; then
        while IFS= read -r pid; do
            if ps -p "$pid" > /dev/null 2>&1; then
                kill "$pid" 2>/dev/null
                echo -e "${GREEN}✓${NC} Stopped process $pid"
            fi
        done < "$PID_FILE"
        rm "$PID_FILE"
    fi
    
    # Kill any remaining Laravel, Vite, or queue worker processes
    pkill -f "artisan serve" 2>/dev/null
    pkill -f "artisan queue:work" 2>/dev/null
    pkill -f "vite" 2>/dev/null
    
    echo -e "${GREEN}✅ All development servers stopped${NC}"
    exit 0
}

# Trap CTRL+C and other termination signals
trap cleanup SIGINT SIGTERM EXIT

# Clear previous PID file
rm -f "$PID_FILE"

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🚀 Starting Development Environment     ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo -e "${YELLOW}Please create .env file first${NC}"
    exit 1
fi

# Start Laravel server
echo -e "${YELLOW}▶️  Starting Laravel server...${NC}"
php artisan serve > storage/logs/laravel-serve.log 2>&1 &
LARAVEL_PID=$!
echo $LARAVEL_PID >> "$PID_FILE"
sleep 2
if ps -p $LARAVEL_PID > /dev/null; then
    echo -e "${GREEN}✓${NC} Laravel server running on ${BLUE}http://localhost:8000${NC} (PID: $LARAVEL_PID)"
else
    echo -e "${RED}✗ Failed to start Laravel server${NC}"
    cleanup
    exit 1
fi

# Start Vite development server
echo -e "${YELLOW}▶️  Starting Vite dev server...${NC}"
npm run dev > storage/logs/vite.log 2>&1 &
VITE_PID=$!
echo $VITE_PID >> "$PID_FILE"
sleep 3
if ps -p $VITE_PID > /dev/null; then
    echo -e "${GREEN}✓${NC} Vite dev server running on ${BLUE}http://localhost:5173${NC} (PID: $VITE_PID)"
else
    echo -e "${RED}✗ Failed to start Vite${NC}"
    cleanup
    exit 1
fi

# Start Queue worker
echo -e "${YELLOW}▶️  Starting Queue worker...${NC}"
php artisan queue:work --tries=3 > storage/logs/queue-worker.log 2>&1 &
WORKER_PID=$!
echo $WORKER_PID >> "$PID_FILE"
sleep 2
if ps -p $WORKER_PID > /dev/null; then
    echo -e "${GREEN}✓${NC} Queue worker running (PID: $WORKER_PID)"
else
    echo -e "${RED}✗ Failed to start Queue worker${NC}"
    cleanup
    exit 1
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ All services started successfully!    ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}🌐 Application:${NC}  http://localhost:8000"
echo -e "${BLUE}⚡ Vite HMR:${NC}      http://localhost:5173"
echo -e "${BLUE}📋 Logs:${NC}         storage/logs/"
echo ""
echo -e "${YELLOW}Press CTRL+C to stop all servers${NC}"
echo ""

# Keep script running and show logs
tail -f storage/logs/laravel-serve.log storage/logs/vite.log storage/logs/queue-worker.log 2>/dev/null &
TAIL_PID=$!

# Wait for user interrupt
wait $TAIL_PID

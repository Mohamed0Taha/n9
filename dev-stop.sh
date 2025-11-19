#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PID_FILE=".dev-pids"

echo -e "${YELLOW}🛑 Stopping development servers...${NC}"

# Stop processes from PID file
if [ -f "$PID_FILE" ]; then
    while IFS= read -r pid; do
        if ps -p "$pid" > /dev/null 2>&1; then
            kill "$pid" 2>/dev/null
            echo -e "${GREEN}✓${NC} Stopped process $pid"
        fi
    done < "$PID_FILE"
    rm "$PID_FILE"
fi

# Kill any remaining processes
pkill -f "artisan serve" 2>/dev/null && echo -e "${GREEN}✓${NC} Stopped Laravel server"
pkill -f "artisan queue:work" 2>/dev/null && echo -e "${GREEN}✓${NC} Stopped Queue worker"
pkill -f "vite" 2>/dev/null && echo -e "${GREEN}✓${NC} Stopped Vite server"

echo -e "${GREEN}✅ All development servers stopped${NC}"

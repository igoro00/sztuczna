#!/bin/bash

rm -rf stats
rm -rf solutions
mkdir -p stats
mkdir -p solutions

bun src/batch.ts bfs RDUL
bun src/batch.ts bfs RDLU
bun src/batch.ts bfs DRUL
bun src/batch.ts bfs DRLU
bun src/batch.ts bfs LUDR
bun src/batch.ts bfs LURD
bun src/batch.ts bfs ULDR
bun src/batch.ts bfs ULRD
echo "bfs done"

bun src/batch.ts astr

echo "astr done"

bun src/batch.ts dfs RDUL &
bun src/batch.ts dfs RDLU &
bun src/batch.ts dfs DRUL &
bun src/batch.ts dfs DRLU &
bun src/batch.ts dfs LUDR &
bun src/batch.ts dfs LURD &
bun src/batch.ts dfs ULDR &
bun src/batch.ts dfs ULRD &

wait

#!/usr/bin/env bash
set -euo pipefail

# Timed hot reload demo -- run this, then navigate the app on the device.
# Each change lands at a predictable interval so you can be on the right screen.
#
# Usage:
#   1. Start revyl dev (wait for "Hot reload ready")
#   2. Start screen recording
#   3. Run: bash demo/deploy.sh
#   4. Navigate the app on the device while changes land
#
# Timeline:
#   0s  -- Hero banner: orange -> green "Summer Sale"
#   8s  -- Stock data added (no visible change)
#  12s  -- Basic SOLD OUT overlay appears (simple dark + white text)
#  20s  -- Styled SOLD OUT: red stamp, grayed emoji, polished
#  28s  -- Detail page: add-to-cart button disabled
#  36s  -- Cart bug fixed (Orchid Mantis)

cd "$(dirname "$0")/.."

echo "=== Expo Hot Reload Demo ==="
echo "Navigate the app on the device. Changes land at timed intervals."
echo ""

echo "[0s] PASS 1 -- Hero banner: orange -> green summer sale"
cp demo/versions/HeroBanner.tsx components/HeroBanner.tsx
sleep 8

echo "[8s] PASS 2 -- Stock data added (no visible change yet)"
cp demo/versions/products.ts constants/products.ts
sleep 4

echo "[12s] PASS 3 -- Basic SOLD OUT overlay (dark + white text)"
cp demo/versions/ProductCard_v1.tsx components/ProductCard.tsx
sleep 8

echo "[20s] PASS 4 -- Styled SOLD OUT: red stamp, grayed emoji"
cp demo/versions/ProductCard.tsx components/ProductCard.tsx
sleep 8

echo "[28s] PASS 5 -- Detail page: add-to-cart disabled"
cp demo/versions/product_detail.tsx "app/product/[id].tsx"
sleep 8

echo "[36s] PASS 6 -- Cart bug fixed (Orchid Mantis)"
cp demo/versions/CartContext.tsx context/CartContext.tsx

echo ""
echo "=== All 6 passes deployed. ==="

#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "Resetting Bug Bazaar to clean state..."

git checkout -- components/HeroBanner.tsx
git checkout -- constants/products.ts
git checkout -- components/ProductCard.tsx
git checkout -- "app/product/[id].tsx"
git checkout -- context/CartContext.tsx

echo "Done. All 5 demo files restored to original state."
echo ""
echo "To replay the hot reload demo:"
echo "  1. Start revyl dev and wait for Hot reload ready."
echo "  2. Run: bash demo/deploy.sh"
echo "  3. Record or explore the changes as they land."

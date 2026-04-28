import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Fonts } from '../constants/theme';
import { Product } from '../constants/products';
import { useCart } from '../context/CartContext';
import HalftoneOverlay from './HalftoneOverlay';
import Emoji from './Emoji';

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const { addToCart, updateQuantity, items } = useCart();
  const router = useRouter();

  const cartItem = items.find(i => i.id === product.id);
  const qty = cartItem?.quantity ?? 0;
  const isSoldOut = product.stock === 0;

  const badgeStyle =
    product.badge === 'RARE'
      ? styles.badgeRare
      : product.badge === 'NEW'
      ? styles.badgeNew
      : product.badge === 'HOT'
      ? styles.badgeHot
      : null;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => router.push(`/product/${product.id}`)}
    >
      <View style={styles.imageContainer}>
        <HalftoneOverlay />
        {product.badge && badgeStyle && !isSoldOut && (
          <View style={[styles.badge, badgeStyle]}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        )}
        {isSoldOut && (
          <View style={styles.soldOutOverlay}>
            <View style={styles.soldOutBadge}>
              <Text style={styles.soldOutText}>SOLD</Text>
              <Text style={styles.soldOutText}>OUT</Text>
            </View>
          </View>
        )}
        <View style={isSoldOut ? styles.emojiGrayed : undefined}>
          <Emoji emoji={product.emoji} size={48} />
        </View>
      </View>
      <View style={styles.productInfo}>
        <Text style={[styles.productName, isSoldOut && styles.productNameSoldOut]} numberOfLines={1}>
          {product.name}
        </Text>
        <View style={styles.productMeta}>
          <Text style={[styles.productPrice, isSoldOut && styles.productPriceSoldOut]}>
            {isSoldOut ? 'SOLD OUT' : `$${product.price.toFixed(2)}`}
          </Text>
          {!isSoldOut && qty === 0 && (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={(e) => {
                e.stopPropagation?.();
                addToCart(product);
              }}
              activeOpacity={0.6}
            >
              <Text style={styles.addBtnText}>+</Text>
            </TouchableOpacity>
          )}
          {!isSoldOut && qty > 0 && (
            <View style={styles.qtyControl}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={(e) => {
                  e.stopPropagation?.();
                  updateQuantity(product.id, qty - 1);
                }}
                activeOpacity={0.6}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyCount}>{qty}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={(e) => {
                  e.stopPropagation?.();
                  addToCart(product);
                }}
                activeOpacity={0.6}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap: Spacing.s,
  },
  imageContainer: {
    aspectRatio: 1,
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    zIndex: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  badgeRare: {
    backgroundColor: Colors.mangoOrange,
  },
  badgeNew: {
    backgroundColor: Colors.stickerGreen,
  },
  badgeHot: {
    backgroundColor: '#FF4444',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: Fonts.body,
    color: Colors.inkBlack,
  },
  soldOutOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 8, 8, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  soldOutBadge: {
    borderWidth: 3,
    borderColor: '#FF4444',
    paddingVertical: 8,
    paddingHorizontal: 20,
    transform: [{ rotate: '-12deg' }],
    alignItems: 'center',
  },
  soldOutText: {
    color: '#FF4444',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 6,
    lineHeight: 26,
  },
  emojiGrayed: {
    opacity: 0.3,
  },
  bugVisual: {
    fontSize: 48,
    zIndex: 2,
  },
  productInfo: {
    flexDirection: 'column',
  },
  productName: {
    fontFamily: Fonts.display,
    fontSize: 15,
    lineHeight: 18,
    color: Colors.inkBlack,
  },
  productNameSoldOut: {
    color: Colors.gray,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  productPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: Fonts.body,
    color: Colors.priceGray,
  },
  productPriceSoldOut: {
    color: '#FF4444',
    fontSize: 11,
    letterSpacing: 1,
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.inkBlack,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.inkBlack,
    lineHeight: 18,
    marginTop: -1,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inkBlack,
    borderRadius: 14,
    height: 28,
    gap: 2,
  },
  qtyBtn: {
    width: 26,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.stickerGreen,
    lineHeight: 17,
  },
  qtyCount: {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: Fonts.body,
    color: Colors.paperWhite,
    minWidth: 18,
    textAlign: 'center',
  },
});

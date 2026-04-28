import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { getEmojiSource } from '../constants/emoji';

type Props = {
  emoji: string;
  size: number;
};

export default function Emoji({ emoji, size }: Props) {
  return (
    <Image
      source={getEmojiSource(emoji)}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
}

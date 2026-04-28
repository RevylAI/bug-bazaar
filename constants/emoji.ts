import { ImageSourcePropType } from 'react-native';

// Twemoji images bundled locally to work around iOS 26 Fabric text renderer
// not doing Apple Color Emoji font fallback for emoji codepoints.
// License: CC-BY 4.0 (https://github.com/twitter/twemoji)

const emojiImages: Record<string, ImageSourcePropType> = {
  '🪲': require('../assets/emoji/beetle.png'),
  '🦋': require('../assets/emoji/butterfly.png'),
  '🦗': require('../assets/emoji/cricket.png'),
  '🐞': require('../assets/emoji/ladybug.png'),
  '🕷️': require('../assets/emoji/spider.png'),
  '🐜': require('../assets/emoji/ant.png'),
  '🐝': require('../assets/emoji/bee.png'),
  '🐛': require('../assets/emoji/caterpillar.png'),
  '🔍': require('../assets/emoji/magnifying-glass.png'),
  '🛒': require('../assets/emoji/shopping-cart.png'),
  '📦': require('../assets/emoji/package.png'),
  '📍': require('../assets/emoji/pin.png'),
  '💳': require('../assets/emoji/credit-card.png'),
  '🔔': require('../assets/emoji/bell.png'),
  '❓': require('../assets/emoji/question.png'),
  '✏️': require('../assets/emoji/pencil.png'),
  '📧': require('../assets/emoji/email.png'),
};

export function getEmojiSource(emoji: string): ImageSourcePropType {
  return emojiImages[emoji] ?? emojiImages['❓'];
}

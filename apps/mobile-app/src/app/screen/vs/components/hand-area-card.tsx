import { FC, memo } from 'react';
import { CardInfo } from '../../../domains/card';
import { MenuProps, VsScreenCard } from './vs-screen-card';

const HAND_AREA_MENU: MenuProps[] = [
  { label: '登場' },
  { label: '進化' },
  { label: '進化元に追加' },
  { label: '破棄' },
  { label: '山札の下に戻す' },
  { label: '山札の上に戻す' },
  { label: 'セキュリティに追加' },
];

export const HandAreaCard: FC<{ card: CardInfo }> = memo(({ card }) => {
  return <VsScreenCard card={card} menuList={HAND_AREA_MENU} />;
});

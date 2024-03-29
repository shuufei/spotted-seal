import { Ionicons } from '@expo/vector-icons';
import { Button, HStack, Menu, ScrollView, Text, View } from 'native-base';
import { FC, memo, useContext, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as vsStore from '../../../store/vs-store';
import { BoardContext } from '../context/board-context';
import { DeckOpenAreaCard } from './deck-open-area-card';

export const DeckOpenArea: FC = memo(() => {
  const cardList = useSelector(vsStore.selectors.myselfDeckOpenSelector);
  const boardContext = useContext(BoardContext);
  const dispatch = useDispatch();

  const trash = useCallback(() => {
    dispatch(vsStore.actions.trashAllFromDeckOpen());
  }, [dispatch]);

  return cardList.length > 0 ? (
    <View p={1}>
      <HStack justifyContent={'space-between'} alignItems={'center'}>
        <Text fontSize={'xs'}>山札オープン: {cardList.length}</Text>
        {boardContext.side === 'myself' && (
          <Menu
            placement="bottom right"
            trigger={(triggerProps) => {
              return (
                <Button
                  size="xs"
                  variant="ghost"
                  _pressed={{
                    background: '#f0f0f0',
                  }}
                  colorScheme="blue"
                  {...triggerProps}
                >
                  <Ionicons
                    name="ellipsis-horizontal-circle-outline"
                    size={20}
                    color={'#000000'}
                  />
                </Button>
              );
            }}
          >
            <Menu.Item onPress={trash}>全て破棄</Menu.Item>
            <Menu.Item>全て手札に追加</Menu.Item>
            <Menu.Item>全て山札の下に戻す</Menu.Item>
            <Menu.Item>全て山札の上に戻す</Menu.Item>
          </Menu>
        )}
      </HStack>
      <ScrollView horizontal={true} mt={2} overflow={'visible'}>
        <HStack space={1} overflow={'visible'}>
          {cardList.map((card, i) => {
            return (
              <DeckOpenAreaCard
                key={`${card.data.imgFileName}-${i}`}
                card={card.data}
              />
            );
          })}
        </HStack>
      </ScrollView>
    </View>
  ) : null;
});

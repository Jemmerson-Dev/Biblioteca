import { FlatList, ScrollView, View } from 'react-native';

// otimizada=true: FlatList (recicla itens, só desenha o que aparece na tela)
// otimizada=false: ScrollView + map (desenha TODOS os itens). Existe só para o comparativo antes/depois.
export default function Lista({ data, renderItem, keyExtractor, vazio, otimizada }) {
  if (!otimizada) {
    return (
      <ScrollView contentContainerStyle={{ padding: 14 }} keyboardShouldPersistTaps="handled">
        {data.length ? data.map((item, index) => <View key={keyExtractor(item)}>{renderItem({ item, index })}</View>) : vazio}
      </ScrollView>
    );
  }
  return (
    <FlatList data={data} renderItem={renderItem} keyExtractor={keyExtractor} ListEmptyComponent={vazio}
      contentContainerStyle={{ padding: 14 }} keyboardShouldPersistTaps="handled"
      initialNumToRender={10} maxToRenderPerBatch={10} windowSize={7} removeClippedSubviews />
  );
}

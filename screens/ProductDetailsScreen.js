import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button } from 'react-native';
import ProductCard from '../components/ProductCard';
import useProductDetails from '../hooks/useProductDetails';

export default function ProductDetailsScreen({ route, navigation }) {
  const { barcode } = route.params;
  const { product, suggestions, loading, error } = useProductDetails(barcode);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.center}>
        <Text>Produto não encontrado</Text>
        <Button title="Voltar ao scanner" onPress={() => navigation.navigate('Scanner')} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{product.product_name}</Text>
      <Text style={styles.origin}>País de origem: {product.countries || 'Desconhecido'}</Text>
      <Text style={styles.sectionTitle}>Sugestões</Text>
      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.id || item.code}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onPress={() => navigation.push('ProductDetails', { barcode: item.code })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  origin: {
    fontSize: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
});

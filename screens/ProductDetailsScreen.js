import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import ProductCard from '../components/ProductCard';
import useProductDetails from '../hooks/useProductDetails';

export default function ProductDetailsScreen({ route, navigation }) {
  const { barcode } = route.params;
  const { product, suggestions, loading, error } = useProductDetails(barcode);

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

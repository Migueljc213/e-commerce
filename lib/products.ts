import { Product } from '@/types'

export const products: Product[] = [
  {
    id: '1',
    name: 'Smartphone Pro Max',
    description: 'Smartphone de última geração com tela OLED de 6.7 polegadas, câmera tripla de 108MP e bateria de longa duração.',
    price: 2999.99,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop',
    category: 'electronics',
    stock: 15,
    rating: 4.8,
    reviews: 234,
  },
  {
    id: '2',
    name: 'Notebook Ultra Slim',
    description: 'Notebook ultraleve com processador de última geração, 16GB RAM e SSD de 512GB. Perfeito para trabalho e entretenimento.',
    price: 4599.99,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop',
    category: 'electronics',
    stock: 8,
    rating: 4.9,
    reviews: 156,
  },
  {
    id: '3',
    name: 'Fone de Ouvido Wireless',
    description: 'Fone de ouvido com cancelamento de ruído ativo, bateria de 30 horas e qualidade de som premium.',
    price: 799.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    category: 'electronics',
    stock: 25,
    rating: 4.7,
    reviews: 189,
  },
  {
    id: '4',
    name: 'Smartwatch Fitness',
    description: 'Relógio inteligente com monitoramento de saúde, GPS integrado e resistente à água. Acompanhe seus treinos e saúde.',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    category: 'electronics',
    stock: 12,
    rating: 4.6,
    reviews: 98,
  },
  {
    id: '5',
    name: 'Tênis Esportivo Premium',
    description: 'Tênis de corrida com tecnologia de amortecimento avançada, ideal para atletas e corredores.',
    price: 599.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    category: 'clothing',
    stock: 30,
    rating: 4.5,
    reviews: 267,
  },
  {
    id: '6',
    name: 'Camiseta Básica Premium',
    description: 'Camiseta de algodão orgânico, confortável e durável. Disponível em várias cores.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    category: 'clothing',
    stock: 50,
    rating: 4.4,
    reviews: 145,
  },
  {
    id: '7',
    name: 'Mochila Executiva',
    description: 'Mochila resistente à água com compartimentos organizados, ideal para trabalho e viagens.',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
    category: 'accessories',
    stock: 20,
    rating: 4.6,
    reviews: 112,
  },
  {
    id: '8',
    name: 'Óculos de Sol Designer',
    description: 'Óculos de sol com proteção UV 100%, lentes polarizadas e armação leve e resistente.',
    price: 449.99,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop',
    category: 'accessories',
    stock: 18,
    rating: 4.7,
    reviews: 203,
  },
  {
    id: '9',
    name: 'Câmera Digital 4K',
    description: 'Câmera compacta com gravação em 4K, estabilização de imagem e zoom óptico de 10x.',
    price: 1899.99,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop',
    category: 'electronics',
    stock: 10,
    rating: 4.8,
    reviews: 87,
  },
  {
    id: '10',
    name: 'Tablet Pro',
    description: 'Tablet de 10.9 polegadas com tela Retina, caneta stylus incluída e bateria de 12 horas.',
    price: 3299.99,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop',
    category: 'electronics',
    stock: 6,
    rating: 4.9,
    reviews: 134,
  },
  {
    id: '11',
    name: 'Jaqueta Esportiva',
    description: 'Jaqueta corta-vento com tecnologia de respirabilidade, ideal para atividades ao ar livre.',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop',
    category: 'clothing',
    stock: 22,
    rating: 4.5,
    reviews: 91,
  },
  {
    id: '12',
    name: 'Relógio Clássico',
    description: 'Relógio analógico elegante com pulseira de couro genuíno e movimento automático suíço.',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    category: 'accessories',
    stock: 14,
    rating: 4.8,
    reviews: 178,
  },
]

export const categories = [
  { id: 'all', name: 'Todos', slug: 'all' },
  { id: 'electronics', name: 'Eletrônicos', slug: 'electronics' },
  { id: 'clothing', name: 'Roupas', slug: 'clothing' },
  { id: 'accessories', name: 'Acessórios', slug: 'accessories' },
]

export function getProducts(): Product[] {
  return products
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'all') return products
  return products.filter((p) => p.category === category)
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase()
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
  )
}





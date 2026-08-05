import { Builder } from '@builder.io/react';
import type { BuilderContent } from '@builder.io/sdk';

type ProductRef = (BuilderContent & { value?: BuilderContent }) | null | undefined;

interface ProductsCarouselProps {
  products?: { product?: ProductRef }[];
}

export function ProductsCarousel({ products }: ProductsCarouselProps) {
  return (
    <div style={{ display: 'flex', gap: 16, overflowX: 'auto', padding: 16 }}>
      {(products || []).map((item, i) => {
        const resolved = item.product?.value ?? item.product;
        return (
          <div
            key={i}
            style={{ border: '1px solid #333', padding: 12, minWidth: 160, flex: '0 0 auto' }}
          >
            {resolved?.data?.sku ?? 'Unresolved product reference'}
          </div>
        );
      })}
    </div>
  );
}

Builder.registerComponent(ProductsCarousel, {
  name: 'ProductsCarousel',
  inputs: [
    {
      name: 'products',
      type: 'list',
      subFields: [{ name: 'product', type: 'reference', model: 'product' }],
    },
  ],
});

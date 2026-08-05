import type { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { BuilderComponent, useIsPreviewing } from '@builder.io/react';
import { builder } from '../lib/builder';

const ENRICH_OPTIONS = {
  enrichLevel: 1,
  model: { product: { fields: 'data.sku', omit: 'data.blocks' } },
};

function findFirstProductRef(node: any): any {
  if (!node || typeof node !== 'object') return null;

  if (node['@type'] === '@builder.io/core:Reference' && node.model === 'product') {
    return node.value;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      const found = findFirstProductRef(item);
      if (found) return found;
    }
    return null;
  }

  for (const key of Object.keys(node)) {
    const found = findFirstProductRef(node[key]);
    if (found) return found;
  }
  return null;
}

const MODELS_BY_PRIORITY = ['page', 'product'];

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const urlPath = '/' + ((params?.page as string[])?.join('/') || '');

  for (const model of MODELS_BY_PRIORITY) {
    const page = await builder
      .get(model, {
        userAttributes: { urlPath },
        cachebust: true,
        enrich: true,
        enrichOptions: ENRICH_OPTIONS,
      })
      .toPromise();

    if (page) {
      return { props: { page, model }, revalidate: 5 };
    }
  }

  return { notFound: true, revalidate: 5 };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const entriesByModel = await Promise.all(
    MODELS_BY_PRIORITY.map((model) => builder.getAll(model, { fields: 'data.url' }))
  );

  return {
    paths: entriesByModel.flat().map((entry) => `${entry.data?.url}`),
    fallback: true,
  };
};

interface PageProps {
  page: any;
  model: string;
}

export default function Page({ page, model }: PageProps) {
  const router = useRouter();
  const isPreviewing = useIsPreviewing();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <BuilderComponent
        model={model}
        content={page}
        options={{ enrich: true, enrichOptions: ENRICH_OPTIONS }}
      />
      {!page && !isPreviewing && <div>404</div>}
      {/* Debug panel: dumps the raw resolved product reference so the
          production vs. editor shape difference is visible without
          needing devtools */}
      <pre id="debug-dump" style={{ background: '#111', color: '#0f0', padding: 16 }}>
        {JSON.stringify(findFirstProductRef(page?.data?.blocks), null, 2)}
      </pre>
    </>
  );
}

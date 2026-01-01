
import { ShopifyConnection } from '../types';

/**
 * Flattens Shopify GraphQL Connection objects (edges/nodes) into a flat array.
 */
export function flattenConnection<T>(connection: ShopifyConnection<T> | undefined | null): T[] {
  if (!connection) return [];
  if (Array.isArray(connection.nodes)) return connection.nodes;
  if (Array.isArray(connection.edges)) return connection.edges.map((edge) => edge.node);
  return [];
}

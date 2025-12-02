const buildHeaders = (apiKey: string) => ({
  apikey: apiKey,
  Authorization: `Bearer ${apiKey}`,
  'Content-Type': 'application/json',
});

const buildQuery = (filters: Record<string, { op: string; value: unknown }>, order?: { column: string; ascending: boolean }, limit?: number, select?: string, onConflict?: string) => {
  const params = new URLSearchParams();
  if (select) params.set('select', select);
  if (limit !== undefined) params.set('limit', String(limit));
  if (onConflict) params.set('on_conflict', onConflict);
  Object.entries(filters).forEach(([column, { op, value }]) => {
    params.set(column, `${op}.${value}`);
  });
  if (order) {
    params.set('order', `${order.column}.${order.ascending ? 'asc' : 'desc'}`);
  }
  return params.toString();
};

class QueryBuilder<T> {
  private operation: 'select' | 'upsert' | 'update' | 'delete' = 'select';
  private columns = '*';
  private filters: Record<string, { op: string; value: unknown }> = {};
  private orderBy?: { column: string; ascending: boolean };
  private limitCount?: number;
  private payload: unknown;
  private onConflict?: string;
  private expectSingle = false;
  private maybeSingleResult = false;

  constructor(private readonly baseUrl: string, private readonly table: string, private readonly apiKey: string) {}

  select(columns = '*') {
    this.operation = 'select';
    this.columns = columns;
    return this;
  }

  order(column: string, options: { ascending?: boolean } = {}) {
    this.orderBy = { column, ascending: options.ascending !== false };
    return this;
  }

  eq(column: string, value: unknown) {
    this.filters[column] = { op: 'eq', value };
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  maybeSingle() {
    this.maybeSingleResult = true;
    this.limitCount = this.limitCount ?? 1;
    return this.execute();
  }

  single() {
    this.expectSingle = true;
    this.limitCount = this.limitCount ?? 1;
    return this.execute();
  }

  upsert(payload: unknown, options: { onConflict?: string } = {}) {
    this.operation = 'upsert';
    this.payload = payload;
    this.onConflict = options.onConflict;
    return this;
  }

  update(payload: unknown) {
    this.operation = 'update';
    this.payload = payload;
    return this;
  }

  delete() {
    this.operation = 'delete';
    return this;
  }

  async execute(): Promise<{ data: T | null; error: Error | null }> {
    const query = buildQuery(this.filters, this.orderBy, this.limitCount, this.columns, this.onConflict);
    const url = `${this.baseUrl}/rest/v1/${this.table}${query ? `?${query}` : ''}`;
    const headers: Record<string, string> = { ...buildHeaders(this.apiKey) };

    let method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET';
    let body: string | undefined;

    switch (this.operation) {
      case 'upsert':
        method = 'POST';
        headers.Prefer = 'resolution=merge-duplicates,return=representation';
        body = JSON.stringify(this.payload);
        break;
      case 'update':
        method = 'PATCH';
        headers.Prefer = 'return=representation';
        body = JSON.stringify(this.payload);
        break;
      case 'delete':
        method = 'DELETE';
        break;
      default:
        method = 'GET';
    }

    try {
      const response = await fetch(url, { method, headers, body });
      if (!response.ok) {
        const errorText = await response.text();
        return { data: null, error: new Error(`Supabase request failed: ${response.status} ${errorText}`) };
      }

      const json = (await response.json()) as T | T[];
      if (Array.isArray(json)) {
        if (this.expectSingle || this.maybeSingleResult) {
          const first = json[0] ?? null;
          if (this.expectSingle && !first) {
            return { data: null, error: new Error('No rows returned') };
          }
          return { data: (first as T | null) ?? null, error: null };
        }
        return { data: json as T, error: null };
      }

      return { data: json as T, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  then<TResult1 = { data: T | null; error: Error | null }, TResult2 = never>(
    onfulfilled?: ((value: { data: T | null; error: Error | null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ) {
    return this.execute().then(onfulfilled, onrejected);
  }
}

export const createClient = (url: string, apiKey: string) => {
  const baseUrl = url.replace(/\/$/, '');
  return {
    from<T>(table: string) {
      return new QueryBuilder<T>(baseUrl, table, apiKey);
    },
  };
};

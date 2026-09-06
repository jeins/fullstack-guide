export const deliveryAndRetrievalConcepts = [
  {
    id: 'C08',
    title: 'Content Delivery Networks',
    category: 'SYSTEM DESIGN CORE',
    section: 'system-design-core',
    tag: 'cdn',
    shortDesc: 'Mengurangi latency dan origin load melalui edge caching, request routing, dan cache policy yang benar.',
    detail: `CDN menyimpan static atau cacheable content di edge Point of Presence yang dekat dengan user. DNS/anycast mengarahkan client ke edge; edge mengembalikan cached response atau mengambilnya dari origin pada miss. Selain latency, CDN mengurangi bandwidth origin, menyerap traffic spike, membantu TLS termination, dan sering terintegrasi dengan WAF serta DDoS protection.

Static asset dengan content hash dapat diberi TTL panjang dan immutable. HTML/API response memerlukan policy lebih hati-hati: Cache-Control, ETag, Vary, authorization, query string, cookie, dan surrogate key menentukan cacheability. Origin shield atau tiered caching mengurangi miss serentak dari banyak edge. Signed URL/cookie melindungi private content.

Invalidation global tidak instan dan dapat mahal. Strategi yang lebih aman adalah versioned URL untuk asset serta stale-while-revalidate untuk content yang boleh sedikit lama. Principal architect juga memperhatikan cache poisoning, personalized response leakage, data residency, failover origin, dan observability hit/miss per region.`,
    springBoot: `Implementasi praktis:
- Backend menetapkan Cache-Control, ETag, Last-Modified, dan Vary secara konsisten.
- Static build memakai filename fingerprint agar immutable caching aman.
- Jangan melewatkan file besar melalui Spring Boot; gunakan object storage + CDN + signed URL.
- Gunakan CDN logs/metrics untuk hit ratio, origin latency, 4xx/5xx, egress, dan regional skew.
- Uji purge/version rollout serta origin failover.`,
    comparison: `Trade-off utama:
- Long TTL: hit ratio tinggi; perubahan lambat terlihat tanpa versioning.
- Purge/invalidation: URL tetap; propagasi dan biaya tidak selalu predictable.
- Public cache: efisien; tidak boleh mencampur personalized/security context.
- Signed URL: private delivery scalable; key rotation dan expiry perlu dikelola.
- Single CDN: sederhana; multi-CDN menambah resilience tetapi routing/operasi kompleks.`,
    bestPractices: `Best practices:
- Gunakan content-addressed/versioned URL untuk immutable asset.
- Pisahkan public, private, dan personalized cache policy.
- Lindungi origin dari direct access bila memungkinkan.
- Tambahkan origin shield dan request collapsing untuk hot miss.
- Ukur user latency dan origin offload, bukan hanya CDN hit ratio.`,
    pitfalls: `Red flags:
- Cache personalized response tanpa Vary/key yang benar.
- Mengandalkan purge sebagai deployment strategy utama.
- TTL terlalu pendek sehingga CDN hanya menjadi proxy mahal.
- Query parameter tidak dinormalisasi dan memecah cache key.
- CDN dianggap menggantikan origin capacity planning dan disaster recovery.`,
    rule: 'CDN efektif jika cache key, freshness, security, dan origin protection dirancang sebagai satu kontrak.',
    code: `Browser -> nearest CDN edge
           | HIT  -> response
           | MISS -> origin shield -> object storage/origin

Immutable asset:
Cache-Control: public, max-age=31536000, immutable
URL: /assets/app.a8f31c.js

Revalidatable content:
Cache-Control: public, max-age=60, stale-while-revalidate=300`,
  },
  {
    id: 'C09',
    title: 'API Design & Rate Management',
    category: 'SYSTEM DESIGN CORE',
    section: 'system-design-core',
    tag: 'api',
    shortDesc: 'Mendesain contract yang dapat berevolusi, efisien diakses, dan terlindungi oleh quota serta rate policy.',
    detail: `REST cocok untuk resource-oriented API, memanfaatkan HTTP semantics, caching, dan tooling yang matang. GraphQL cocok ketika client membutuhkan graph data dengan shape berbeda-beda, tetapi query cost, N+1, authorization per field, caching, dan schema governance harus dikelola. Pilihan dapat berbeda antara public API, internal API, dan Backend-for-Frontend.

Pagination offset sederhana namun melambat dan tidak stabil pada dataset yang sering berubah. Cursor/keyset pagination menggunakan sort key stabil dan lebih cocok untuk feed atau data besar. Filtering dan sorting harus dibatasi pada field yang di-index serta memiliki maximum page size. Versioning tidak selalu berarti /v2; perubahan additive biasanya backward compatible, sedangkan rename/removal atau semantic change memerlukan deprecation plan, telemetry consumer, dan migration window.

Rate limiting melindungi fairness, security, cost, dan dependency capacity. Token bucket mengizinkan burst dengan average rate; leaky bucket meratakan output; sliding window lebih fair tetapi lebih mahal; fixed window paling sederhana namun punya boundary burst. Policy perlu mempertimbangkan user, tenant, API key, endpoint cost, dan global vs regional limit.`,
    springBoot: `Implementasi praktis:
- Spring MVC/WebFlux untuk REST; Spring for GraphQL + DataLoader untuk GraphQL.
- Cursor harus opaque, signed bila perlu, dan berbasis deterministic ordering.
- Spring Cloud Gateway/Bucket4j/Redis dapat menerapkan distributed rate policy.
- Return 429 dengan Retry-After dan quota headers yang konsisten.
- Observasi top consumer, rejection rate, query cost, payload size, dan deprecated-version traffic.`,
    comparison: `Trade-off utama:
- REST: operasional sederhana dan cache-friendly; beberapa UI dapat over/under-fetch.
- GraphQL: flexible aggregation; cost control serta observability lebih kompleks.
- Offset pagination: mudah; buruk untuk deep page dan concurrent insert.
- Cursor pagination: stabil/efisien; random page jump dan implementation lebih sulit.
- Token bucket: burst-friendly; leaky bucket memberi output lebih halus.
- Version in path: eksplisit; version by header/media type lebih bersih tetapi kurang terlihat.`,
    bestPractices: `Best practices:
- Mulai dari consumer journey, resource/invariant, dan error contract.
- Batasi GraphQL depth, complexity, timeout, dan resolver fan-out.
- Pakai deterministic sort dengan tie-breaker unik untuk cursor pagination.
- Version hanya untuk breaking change dan publikasikan deprecation timeline.
- Rate limit berdasarkan cost/fairness, bukan satu angka global untuk semua endpoint.`,
    pitfalls: `Red flags:
- GraphQL dipilih hanya untuk menghindari mendesain API.
- Offset pagination tanpa maximum limit pada table besar.
- API version lama dihentikan tanpa usage telemetry dan migration support.
- Rate limit hanya per IP sehingga NAT/shared clients dihukum.
- Retry-after dan idempotency tidak dipikirkan bersama throttling.`,
    rule: 'API yang matang menjaga contract, query cost, evolusi, dan fairness sekaligus.',
    code: `Cursor query:
SELECT * FROM orders
WHERE (created_at, id) < (:createdAt, :id)
ORDER BY created_at DESC, id DESC
LIMIT 50;

Token bucket:
- capacity = burst allowance
- refill rate = sustainable rate
- consume weighted tokens per endpoint cost
- reject with 429 + Retry-After when empty`,
  },
  {
    id: 'C10',
    title: 'Search Systems',
    category: 'SYSTEM DESIGN CORE',
    section: 'system-design-core',
    tag: 'search',
    shortDesc: 'Membangun indexing pipeline, full-text retrieval, ranking, dan relevance feedback tanpa membebani source database.',
    detail: `Search engine membuat inverted index yang memetakan term ke document, lalu memakai analyzer untuk tokenization, normalization, stemming, synonym, dan language handling. Elasticsearch/OpenSearch atau Azure AI Search menyediakan distributed indexing, full-text query, filter, aggregation, dan ranking capabilities. Database LIKE query cukup untuk skala kecil, tetapi bukan pengganti search engine saat relevance, typo tolerance, faceting, dan volume meningkat.

Source database tetap authoritative; search index adalah derived read model. Perubahan dikirim lewat CDC/outbox/event pipeline, di-bulk index, lalu menjadi visible setelah refresh. Karena itu search biasanya eventually consistent. Sistem perlu menangani backfill, replay, reindex ke versioned index, alias swap, delete/tombstone, dan mapping evolution tanpa downtime.

Ranking klasik sering memakai BM25: term frequency, inverse document frequency, dan document length. Production ranking menggabungkan textual relevance dengan freshness, popularity, personalization, business rules, dan semantic/vector signal. Quality harus dinilai offline dengan labeled set seperti NDCG/MRR dan online lewat click/conversion experiment, sambil mencegah feedback loop.`,
    springBoot: `Implementasi praktis:
- Spring Boot menjadi query/indexing service; gunakan Elasticsearch/OpenSearch client atau Azure SDK.
- CDC/outbox lebih andal daripada dual write database + search.
- Pisahkan filter exact-match dari full-text scoring.
- Gunakan index alias/version untuk zero-downtime reindex.
- Monitor indexing lag, rejected bulk request, shard size, query p95/p99, zero-result rate, dan relevance metrics.`,
    comparison: `Trade-off utama:
- DB search: sederhana dan transactional; relevance serta scale terbatas.
- Full-text engine: retrieval/ranking kuat; index consistency dan operasi cluster bertambah.
- Lexical/BM25: explainable dan presisi term; semantic intent terbatas.
- Vector search: semantic recall baik; cost, freshness, filtering, dan explainability lebih sulit.
- Sync indexing: freshness tinggi; write path rapuh.
- Async indexing: resilient dan scalable; hasil baru tidak langsung terlihat.`,
    bestPractices: `Best practices:
- Definisikan search intent, fields, filters, freshness, dan quality metric.
- Gunakan versioned schema/index serta reproducible reindex pipeline.
- Buat analyzer sesuai bahasa/domain dan uji synonym dengan data nyata.
- Pisahkan candidate retrieval dari reranking bila kompleksitas bertambah.
- Sediakan fallback saat search cluster degraded dan jangan jadikan index source of truth.`,
    pitfalls: `Red flags:
- Dual write ke DB dan search tanpa recovery/replay.
- Satu giant index dengan shard count arbitrer.
- Ranking dinilai hanya dari latency, bukan relevance.
- Wildcard query bebas pada field besar tanpa guardrail.
- Vector search ditambahkan tanpa baseline lexical, evaluation set, atau cost model.`,
    rule: 'Search index adalah derived model: desain ingestion, freshness, relevance, dan rebuild sebelum memilih engine.',
    code: `Source DB -> Outbox/CDC -> Indexing pipeline -> Search index alias
                                      | failure -> retry/DLQ

Query:
text + filters -> candidate retrieval (BM25/vector)
               -> ranking/reranking
               -> top K + explanation/telemetry

Reindex: build index_v2 -> validate -> alias swap -> retire index_v1`,
  },
  {
    id: 'C16',
    title: 'Probabilistic Data & AI Retrieval',
    category: 'SYSTEM DESIGN CORE',
    section: 'system-design-core',
    tag: 'modern-systems',
    shortDesc: 'Memahami Bloom filter, embeddings, vector search, dan RAG sebagai komponen sistem—termasuk quality dan failure mode.',
    detail: `Bloom filter adalah probabilistic set membership structure. Ia dapat memastikan item tidak ada, atau mengatakan item mungkin ada dengan false-positive rate terukur; tidak menghasilkan false negative selama struktur digunakan sesuai desain. Database dapat menghindari disk lookup untuk key yang pasti tidak ada; crawler dapat menyaring URL yang kemungkinan sudah dilihat. Capacity dan false-positive target harus ditentukan di awal, dan deletion memerlukan counting Bloom filter atau struktur lain.

Embedding merepresentasikan teks, gambar, atau entitas sebagai vector sehingga kedekatan geometris mencerminkan kemiripan semantik. Approximate Nearest Neighbor index seperti HNSW mempercepat pencarian vector dengan trade-off recall, latency, memory, dan build/update cost. Hybrid search menggabungkan lexical/BM25 dan vector retrieval agar exact terms serta semantic intent sama-sama tertangani.

Retrieval-Augmented Generation (RAG) mengambil context eksternal sebelum LLM menjawab. Pipeline ingestion melakukan parsing, chunking, metadata, embedding, dan indexing; query path melakukan retrieval, filtering, optional reranking, prompt construction, lalu generation. RAG mengurangi ketergantungan pada pengetahuan model, tetapi tidak otomatis menghapus hallucination. Ukur retrieval recall, context precision, groundedness, answer correctness, latency, freshness, security filtering, dan cost.`,
    springBoot: `Implementasi praktis:
- Bloom filter cocok sebagai negative-check sebelum cache/database/object lookup mahal.
- Gunakan vector store/engine yang mendukung metadata filter dan lifecycle index.
- Version-kan embedding model, chunking strategy, dan index; perubahan memerlukan re-embedding.
- Terapkan authorization sebelum context diberikan ke model untuk mencegah cross-tenant leakage.
- Simpan provenance internal dan telemetry retrieval tanpa merekam data sensitif sembarangan.`,
    comparison: `Trade-off utama:
- Bloom filter: memory sangat efisien; false positive dan sizing harus diterima.
- Exact set: hasil presisi; memory/storage lookup lebih mahal.
- Lexical search: exact term kuat; semantic mismatch.
- Vector search: semantic recall; explainability, cost, dan freshness lebih sulit.
- RAG: knowledge dapat diperbarui; pipeline quality dan latency bertambah.`,
    bestPractices: `Best practices:
- Hitung Bloom filter dari expected cardinality dan target false-positive rate.
- Bangun evaluation set sebelum memilih embedding, chunk size, top-k, atau reranker.
- Pisahkan retrieval quality dari generation quality saat debugging.
- Filter tenant/permission di retrieval layer, bukan setelah jawaban dibuat.
- Sediakan fallback saat vector store/model unavailable dan kendalikan prompt injection dari dokumen.`,
    pitfalls: `Red flags:
- Menganggap Bloom filter selalu benar ketika menjawab “mungkin ada”.
- Vector database dipilih sebelum access pattern dan evaluation metric jelas.
- RAG disebut menyelesaikan hallucination secara otomatis.
- Re-embedding dilakukan in-place tanpa versioned index dan rollback.
- Dokumen tenant berbeda masuk ke context karena authorization terlambat.`,
    rule: 'Probabilistic structure menghemat resource dengan error terukur; AI retrieval hanya layak jika quality, security, freshness, dan cost dapat dievaluasi.',
    code: `Bloom filter:
key -> h1,h2,h3 -> bit array
any bit = 0  => definitely absent
all bits = 1 => possibly present

RAG ingestion: documents -> parse -> chunk -> embed -> vector index
RAG query: question -> hybrid retrieve -> rerank -> authorized context
                   -> LLM -> grounded answer + evidence`,
  },
];

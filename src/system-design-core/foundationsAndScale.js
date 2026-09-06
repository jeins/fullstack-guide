export const foundationsAndScaleConcepts = [
  {
    id: 'C01',
    title: 'Scalable Data Storage',
    category: 'SYSTEM DESIGN CORE',
    section: 'system-design-core',
    tag: 'data',
    shortDesc: 'Memilih model data, partitioning, index, dan consistency berdasarkan pola akses serta kebutuhan bisnis.',
    detail: `Keputusan storage dimulai dari access pattern, bukan dari merek database. Relational database cocok ketika transaksi multi-row, constraint, join, dan integritas data menjadi pusat masalah. NoSQL cocok ketika model akses sudah jelas, skala horizontal penting, schema perlu fleksibel, atau workload didominasi key lookup dan append. Banyak sistem matang memakai polyglot persistence, tetapi setiap data store tambahan menaikkan biaya operasional dan consistency boundary.

Partitioning vertikal memisahkan tabel atau domain berdasarkan fungsi; horizontal partitioning atau sharding membagi baris berdasarkan shard key. Sharding meningkatkan kapasitas write dan storage, tetapi memperumit cross-shard query, transaction, rebalancing, hot partition, dan uniqueness. Index mempercepat read dengan biaya storage serta write amplification. Primary index menentukan organisasi utama data; secondary index membuka access path lain; covering index memenuhi query dari index tanpa kembali ke table/heap.

Consistency harus dinyatakan per invariant. Strong consistency tepat untuk saldo, inventory kritis, atau uniqueness. Eventual consistency cocok untuk feed, analytics, dan derived view. Causal consistency menjaga hubungan sebab-akibat tanpa memaksa global ordering. Jawaban principal-level menjelaskan data mana yang authoritative, mana yang derived, dan bagaimana sistem melakukan reconciliation saat state berbeda.`,
    springBoot: `Implementasi praktis:
- PostgreSQL/MySQL untuk transaksi dan constraint; DynamoDB/Cassandra/document store untuk access pattern tertentu.
- Gunakan migration tool, query plan, dan metrics sebelum melakukan sharding.
- Spring Data JPA cocok untuk domain relasional; jOOQ membantu query SQL kompleks; client native sering lebih tepat untuk NoSQL.
- Terapkan outbox/CDC saat perubahan transactional perlu diterbitkan ke sistem lain.
- Ukur replication lag, index hit ratio, slow query, hot key, dan skew antar-shard.`,
    comparison: `Trade-off utama:
- SQL: integritas dan query fleksibel kuat; scale write lintas node lebih kompleks.
- NoSQL: scale-out dan pola akses spesifik kuat; join serta constraint sering dipindahkan ke aplikasi.
- Vertical partitioning: ownership lebih jelas; query lintas domain membutuhkan integrasi.
- Horizontal sharding: throughput bertambah; routing, rebalancing, dan cross-shard operation menjadi mahal.
- Strong consistency: invariant lebih mudah dijaga; latency/availability saat partition bisa turun.
- Eventual/causal: availability dan latency lebih baik; UX serta reconciliation harus dirancang.`,
    bestPractices: `Best practices:
- Tulis query dan invariant utama sebelum memilih database.
- Pilih shard key dengan cardinality tinggi, distribusi merata, dan locality yang berguna.
- Buat index dari query nyata; verifikasi dengan execution plan dan production telemetry.
- Pisahkan source of truth dari read model, cache, search index, dan analytics copy.
- Rancang resharding, backup/restore, data retention, dan schema evolution sejak sebelum batas kapasitas tercapai.`,
    pitfalls: `Red flags:
- Memilih NoSQL hanya karena dianggap selalu lebih scalable.
- Sharding sebelum vertical scaling, indexing, query tuning, dan read replica terbukti tidak cukup.
- Membuat banyak secondary index pada write-heavy table tanpa menghitung write amplification.
- Mengatakan eventual consistency dapat diterima tanpa mendefinisikan stale window dan reconciliation.
- Menggunakan tenant ID yang sangat timpang sebagai shard key tanpa strategi untuk hot tenant.`,
    rule: 'Modelkan access pattern dan invariant lebih dulu; pilih storage, partitioning, index, dan consistency sebagai konsekuensinya.',
    code: `Decision path:
1. List invariants and top read/write queries
2. Estimate QPS, data size, growth, and skew
3. Choose source of truth
4. Add only required indexes
5. Add replicas for read scale
6. Shard only when a measured limit requires it

Covering index example:
CREATE INDEX idx_orders_customer_created
ON orders(customer_id, created_at DESC)
INCLUDE (status, total_amount);`,
  },
  {
    id: 'C02',
    title: 'Caching Architecture',
    category: 'SYSTEM DESIGN CORE',
    section: 'system-design-core',
    tag: 'cache',
    shortDesc: 'Menempatkan cache di layer yang tepat dan memilih write strategy, eviction, serta invalidation yang aman.',
    detail: `Caching adalah salinan data untuk mengurangi latency atau load, bukan source of truth. Client/browser cache menghemat network round-trip; CDN menyerap traffic global; reverse proxy cache melindungi origin; application cache mengurangi compute atau database read; database buffer cache bekerja paling dekat ke storage. Letakkan cache sedekat mungkin ke consumer, selama security, freshness, dan invalidation masih dapat dikendalikan.

Write-through memperbarui cache bersama source of truth sehingga read berikutnya konsisten, tetapi write latency naik. Write-back/write-behind menulis ke cache lebih dulu lalu persist asynchronous; throughput tinggi, tetapi kehilangan cache dapat berarti kehilangan data dan ordering menjadi penting. Write-around melewati cache ketika write dan mengisi cache saat read; cocok bila data baru belum tentu segera dibaca, tetapi read pertama akan miss.

Redis menawarkan struktur data, persistence option, replication, dan atomic operations; Memcached lebih sederhana untuk ephemeral key-value cache. LRU membuang item yang lama tidak dipakai, LFU membuang item yang jarang dipakai, TTL memberi batas freshness. Desain yang matang juga menangani cache stampede, penetration, hot key, negative caching, dan invalidation race.`,
    springBoot: `Implementasi praktis:
- Spring Cache + Caffeine untuk cache lokal; Redis untuk cache bersama lintas instance.
- HTTP Cache-Control/ETag untuk browser dan CDN.
- Gunakan request coalescing/single-flight atau distributed lock ringan untuk hot miss.
- Beri TTL dengan jitter agar key populer tidak expire bersamaan.
- Monitor hit ratio bersama latency dan database load; hit ratio tinggi tidak otomatis berarti cache bernilai.`,
    comparison: `Trade-off utama:
- Client cache: latency terbaik, tetapi invalidation dan data sensitif lebih sulit dikontrol.
- Server/distributed cache: policy terpusat; menambah network hop dan dependency.
- Write-through: read-after-write lebih mudah; write lebih lambat.
- Write-back: write cepat; durability dan recovery jauh lebih rumit.
- LRU: baik untuk temporal locality; scan besar dapat mengusir hot set.
- LFU: menjaga item populer; beradaptasi lebih lambat saat traffic pattern berubah.`,
    bestPractices: `Best practices:
- Definisikan freshness budget dan behavior ketika cache down.
- Gunakan cache-aside sebagai baseline yang sederhana, lalu naikkan kompleksitas hanya bila perlu.
- Buat key versioning dan namespace yang konsisten.
- Lindungi origin dengan bounded concurrency, single-flight, stale-while-revalidate, dan TTL jitter.
- Jangan cache hasil authorization lintas tenant tanpa key yang memuat seluruh security context relevan.`,
    pitfalls: `Red flags:
- Cache tanpa owner invalidation yang jelas.
- Cache key tidak menyertakan tenant, locale, permission, atau query variant.
- Menganggap Redis selalu tersedia dan membiarkan cache outage menjatuhkan seluruh layanan.
- TTL seragam menyebabkan mass expiration dan thundering herd.
- Menilai keberhasilan hanya dari hit ratio tanpa melihat correctness, tail latency, dan cost.`,
    rule: 'Cache harus punya freshness contract, failure behavior, dan invalidation owner yang eksplisit.',
    code: `Read path (cache-aside):
Client -> Service -> Cache
                    | hit  -> return
                    | miss -> DB -> populate with TTL+jitter -> return

Write options:
- write-through: Service -> DB + Cache
- write-around:  Service -> DB; invalidate Cache
- write-back:    Service -> Cache -> async persistence`,
  },
  {
    id: 'C03',
    title: 'Load Balancing & Horizontal Scaling',
    category: 'SYSTEM DESIGN CORE',
    section: 'system-design-core',
    tag: 'traffic',
    shortDesc: 'Mendistribusikan traffic ke instance stateless dengan algorithm, health signal, dan proxy layer yang tepat.',
    detail: `Horizontal scaling menambah instance untuk meningkatkan kapasitas dan mengurangi blast radius. Syarat utamanya adalah request path sebisa mungkin stateless: session, file, lock, dan job ownership tidak boleh bergantung pada satu process lokal. Load balancer kemudian mendistribusikan traffic hanya ke target yang sehat.

Round-robin sederhana dan efektif ketika instance homogen serta request cost mirip. Weighted round-robin cocok untuk kapasitas berbeda atau canary. Least-connections membantu workload dengan durasi request bervariasi. Consistent hashing atau rendezvous hashing menjaga affinity berdasarkan key dengan perpindahan minimal saat node berubah, tetapi dapat menciptakan hotspot dan bukan pengganti replication.

Reverse proxy seperti NGINX, HAProxy, Envoy, atau cloud load balancer menangani TLS termination, routing, connection reuse, compression, dan health check. Bedakan L4 load balancing yang cepat berbasis koneksi dengan L7 yang memahami HTTP dan bisa route berdasarkan host/path/header. Pada skala besar, pikirkan global traffic management, regional load balancer, zone evacuation, dan connection draining.`,
    springBoot: `Implementasi praktis:
- Jalankan Spring Boot stateless di belakang NGINX/HAProxy/cloud load balancer.
- Expose readiness dan liveness secara terpisah melalui Actuator.
- Terapkan graceful shutdown dan connection draining saat deploy.
- Externalize session ke secure cookie atau shared store bila session benar-benar diperlukan.
- Autoscaling harus memakai saturation/queue latency selain CPU bila workload tidak CPU-bound.`,
    comparison: `Trade-off utama:
- Round-robin: murah dan predictable; tidak sadar request cost.
- Least-connections: adaptif untuk koneksi panjang; metrics state lebih kompleks.
- Consistent hashing: affinity stabil; distribution tetap perlu virtual nodes dan hotspot mitigation.
- L4: throughput tinggi dan sederhana; routing application-aware terbatas.
- L7: routing dan policy kaya; biaya parsing serta konfigurasi lebih tinggi.`,
    bestPractices: `Best practices:
- Gunakan readiness untuk menghentikan traffic sebelum process dimatikan.
- Batasi queue dan connection pool agar overload terlihat sebagai controlled rejection.
- Sebarkan instance lintas failure domain dan uji kehilangan satu zone.
- Gunakan weighted routing untuk canary dan rollback cepat.
- Pantau request rate, error, duration, saturation, rejected connection, dan imbalance per target.`,
    pitfalls: `Red flags:
- Scale-out aplikasi yang masih menyimpan session atau file di local disk.
- Health check hanya memastikan port terbuka, bukan kemampuan melayani request.
- Sticky session dipakai untuk menutupi state management yang buruk.
- Retry di load balancer tanpa idempotency sehingga write terduplikasi.
- Satu regional load balancer dianggap menyelesaikan disaster recovery.`,
    rule: 'Horizontal scaling berhasil ketika state dieksternalisasi dan load balancer memakai health signal yang benar.',
    code: `Global DNS / Traffic Manager
  -> Regional L7 Load Balancer
      -> Zone A: App instances
      -> Zone B: App instances
      -> Zone C: App instances

Routing choices:
- homogeneous HTTP: round-robin
- uneven request time: least-connections
- cache/shard affinity: consistent or rendezvous hashing`,
  },
  {
    id: 'C12',
    title: 'Performance & Scalability Fundamentals',
    category: 'SYSTEM DESIGN CORE',
    section: 'system-design-core',
    tag: 'foundations',
    shortDesc: 'Membedakan scalability, latency, throughput, saturation, vertical scale, dan horizontal scale secara terukur.',
    detail: `Scalability adalah kemampuan seluruh sistem menyerap pertumbuhan user, data, request, atau wilayah tanpa kehilangan target layanan. Sistem hanya se-scalable bottleneck terlemahnya: menambah application server tidak berguna bila database, connection pool, atau downstream API sudah jenuh. Vertical scaling menambah CPU, memory, atau storage pada satu mesin; sederhana tetapi memiliki ceiling dan failure domain tunggal. Horizontal scaling menambah node; kapasitas dan redundancy meningkat, tetapi menuntut state externalization, routing, coordination, dan observability yang lebih matang.

Latency adalah waktu yang dialami satu request, sedangkan throughput adalah jumlah pekerjaan per satuan waktu. Keduanya tidak identik: parallelism dapat menaikkan throughput sambil memperburuk latency karena queueing. Tail latency p95/p99 lebih representatif daripada average untuk fan-out system.

Principal architect memulai dari SLO dan workload model, lalu mengukur utilization, saturation, queue depth, concurrency, dan arrival rate. Gunakan Little's Law sebagai mental model: concurrency ≈ throughput × latency. Scaling harus mengikuti bottleneck aktual, mempertimbangkan headroom saat node/zone gagal, serta menghitung cost per successful request.`,
    springBoot: `Implementasi praktis:
- Gunakan Micrometer untuk request rate, p50/p95/p99 latency, error, JVM, pool, dan queue metrics.
- Jalankan load test dengan workload realistis, warm-up, serta dependency behavior yang representatif.
- Buat service stateless; externalize session, file, scheduled ownership, dan distributed coordination.
- Autoscale memakai saturation atau queue age bila CPU bukan bottleneck utama.
- Profiling dan query plan lebih bernilai daripada scale-out buta.`,
    comparison: `Trade-off utama:
- Vertical scale: perubahan arsitektur minim; ceiling, downtime, dan blast radius lebih besar.
- Horizontal scale: elasticity dan redundancy; coordination serta operasi lebih kompleks.
- Optimasi latency: pengalaman per request membaik; bisa mengorbankan batching/throughput.
- Optimasi throughput: capacity total naik; queue dan batch dapat menambah latency.
- Average latency: mudah dibaca; menyembunyikan tail yang sering menentukan UX.`,
    bestPractices: `Best practices:
- Tetapkan SLO, traffic profile, peak factor, dan growth horizon sebelum memilih scaling strategy.
- Ukur end-to-end serta per-hop latency; optimalkan critical path dominan.
- Sisakan headroom untuk deployment, retry burst, dan kehilangan satu failure domain.
- Terapkan bounded queue dan admission control agar overload gagal secara terkendali.
- Uji capacity limit dan degradation curve, bukan hanya happy-path benchmark.`,
    pitfalls: `Red flags:
- Mengatakan horizontal scaling tidak punya batas.
- Menggunakan average latency tanpa p95/p99 dan error rate.
- Autoscaling hanya berdasarkan CPU untuk workload I/O-bound.
- Menambah server ketika bottleneck sebenarnya lock, database, atau downstream quota.
- Tidak menghitung capacity setelah satu node atau satu zone gagal.`,
    rule: 'Ukur latency, throughput, dan saturation bersama-sama; scaling harus menghilangkan bottleneck yang terbukti.',
    code: `Capacity reasoning:
arrival rate (RPS) -> queue -> workers -> dependency
Little's Law: concurrency ~= throughput x latency

1. Define SLO and peak workload
2. Measure p95/p99 and saturation
3. Find the limiting resource
4. Optimize or scale that resource
5. Retest with one failure domain unavailable`,
  },
];

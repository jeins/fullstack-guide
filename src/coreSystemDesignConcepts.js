export const coreSystemDesignConcepts = [
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
    id: 'C04',
    title: 'Asynchronous Processing',
    category: 'SYSTEM DESIGN CORE',
    section: 'system-design-core',
    tag: 'messaging',
    shortDesc: 'Memilih queue, stream, event-driven architecture, dan task scheduling untuk memisahkan pekerjaan dari request path.',
    detail: `Asynchronous processing memisahkan acceptance dari completion. Queue cocok ketika setiap task umumnya diproses satu worker group, misalnya email, image resize, delayed job, atau retry. Stream/log seperti Kafka cocok ketika event perlu disimpan, di-replay, dan dikonsumsi banyak consumer group secara independen. RabbitMQ kuat untuk flexible routing dan work queue; Kafka kuat untuk ordered partition log, replay, dan event backbone ber-throughput tinggi.

Event-driven architecture mengurangi temporal coupling: producer tidak harus menunggu consumer aktif. Namun coupling tidak hilang; ia berpindah ke event schema, ordering, delivery semantics, dan operational ownership. Event sourcing lebih spesifik: event menjadi source of truth dan state direkonstruksi dari event history. Ini memberi audit/time travel, tetapi menaikkan kompleksitas versioning, replay, snapshot, dan debugging—jadi jangan disamakan dengan sekadar publish event.

Task queue perlu retry policy, exponential backoff, dead-letter queue, idempotent consumer, visibility timeout/lease, dan poison-message handling. Exactly-once end-to-end biasanya klaim berbahaya; target praktis adalah at-least-once delivery dengan effect yang idempotent atau dideduplicate.`,
    springBoot: `Implementasi praktis:
- Spring Kafka untuk stream/event log; Spring AMQP untuk RabbitMQ work queue.
- Gunakan transactional outbox agar commit database dan publish event tidak menghasilkan dual-write gap.
- Simpan idempotency key/event ID pada consumer untuk side effect kritis.
- Pisahkan retry topic/queue dan DLQ; jangan melakukan retry cepat tanpa batas.
- Monitor consumer lag, oldest message age, retry count, DLQ growth, dan processing latency.`,
    comparison: `Trade-off utama:
- Queue: ownership task sederhana dan ack per message; replay/multi-consumer history terbatas.
- Stream: replay dan banyak consumer group kuat; partitioning serta offset management lebih kompleks.
- Sync call: hasil langsung dan flow mudah dipahami; availability saling terikat.
- Async event: resilience dan buffering lebih baik; consistency serta debugging lebih sulit.
- Event sourcing: audit history sangat kuat; model, migration, dan operasi jauh lebih kompleks.`,
    bestPractices: `Best practices:
- Nyatakan delivery semantics, ordering scope, retention, dan schema compatibility.
- Gunakan outbox/CDC untuk event yang berasal dari transaksi database.
- Buat consumer idempotent dan ukur lag sebagai user-impact signal.
- Pisahkan business retry dari infrastructure retry.
- Sediakan replay procedure, quarantine, dan audit trail sebelum incident terjadi.`,
    pitfalls: `Red flags:
- Mengatakan Kafka adalah queue tanpa membahas partition, offset, retention, atau replay.
- Dual write database lalu broker tanpa outbox atau recovery plan.
- Retry tak terbatas yang menahan partition atau membanjiri dependency.
- Bergantung pada global ordering padahal broker hanya menjamin ordering per partition.
- Memakai event sourcing hanya karena membutuhkan audit log.`,
    rule: 'Pilih queue untuk penyelesaian task dan stream untuk durable event history; desain consumer untuk duplicate serta replay.',
    code: `Reliable publish:
DB transaction -> business row + outbox row
CDC/publisher  -> broker
consumer       -> dedup(eventId) -> side effect -> ack

Failure path:
retry with backoff -> retry queue/topic -> DLQ/quarantine -> operator replay`,
  },
  {
    id: 'C05',
    title: 'Database Read & Write Scaling',
    category: 'SYSTEM DESIGN CORE',
    section: 'system-design-core',
    tag: 'database',
    shortDesc: 'Menskala read dan write secara berbeda sambil menjaga replication lag, ownership, dan CAP trade-off.',
    detail: `Read scaling biasanya dimulai dari query/index tuning, cache, lalu read replica. Replica mengurangi beban primary, tetapi membawa replication lag. Karena itu, read-your-writes mungkin perlu membaca dari leader untuk periode singkat, memakai session token, atau menunggu replication position. Analytics dan reporting sebaiknya dipisahkan agar query berat tidak mengganggu transactional workload.

Write scaling lebih sulit karena beberapa writer harus menyepakati ownership dan ordering. Single-leader replication menyederhanakan conflict, tetapi leader menjadi write bottleneck dan failover membutuhkan election. Multi-leader cocok untuk region terpisah atau offline write, tetapi conflict resolution menjadi bagian domain. Sharding menambah write capacity dengan membagi ownership data; transaksi lintas shard dan rebalance menjadi biaya utamanya.

CAP theorem berlaku ketika network partition terjadi: sistem terdistribusi harus memilih tetap available dengan potensi inconsistency, atau menolak/menunda sebagian operasi untuk menjaga consistency. Partition tolerance bukan opsi yang bisa dimatikan pada jaringan nyata. Jawaban senior menghubungkan pilihan CAP ke operasi tertentu, bukan memberi label tunggal untuk seluruh produk.`,
    springBoot: `Implementasi praktis:
- Routing read/write datasource dapat digunakan, tetapi transaction context harus jelas.
- Jangan kirim read-after-write kritis ke replica yang lag.
- Gunakan optimistic locking/version column untuk concurrent update.
- Leader election sebaiknya diserahkan ke database/coordination system matang, bukan custom lock sederhana.
- Pantau replication lag dalam waktu dan byte/LSN, failover time, write saturation, dan cross-shard request.`,
    comparison: `Trade-off utama:
- Read replica: scale read murah; stale read dan failover routing harus ditangani.
- Sharding: scale write/storage; query serta transaction lintas shard menjadi mahal.
- Single leader: conflict lebih sederhana; write availability bergantung pada election/failover.
- Multi-leader: local write availability tinggi; conflict domain lebih sulit.
- CP behavior: invariant kuat saat partition; sebagian request gagal/menunggu.
- AP behavior: layanan tetap menerima request; reconciliation wajib.`,
    bestPractices: `Best practices:
- Pisahkan kebutuhan read-your-writes, monotonic read, dan globally strong consistency.
- Scale read dan write berdasarkan bottleneck yang terukur.
- Dokumentasikan failover RTO/RPO serta behavior selama election.
- Gunakan shard ownership yang deterministik dan siapkan online resharding.
- Uji stale reads dan split-brain scenario, bukan hanya happy path.`,
    pitfalls: `Red flags:
- Menganggap read replica selalu aman untuk semua endpoint.
- Menyebut CAP sebagai pilihan dua dari tiga saat kondisi normal.
- Membuat leader election sendiri tanpa fencing token.
- Shard key menghasilkan satu hot shard pada waktu puncak.
- Multi-region write ditambahkan tanpa conflict policy yang dimengerti produk.`,
    rule: 'Read scale biasanya soal salinan; write scale soal ownership, ordering, dan conflict.',
    code: `Write: Client -> Leader -> replication log -> Followers
Read options:
- stale-tolerant query -> nearest replica
- read-your-writes     -> leader/session-consistent replica
- analytics            -> isolated replica/warehouse

During partition:
- preserve invariant -> reject or wait (CP behavior)
- preserve acceptance -> reconcile later (AP behavior)`,
  },
  {
    id: 'C06',
    title: 'Consensus & Conflict Resolution',
    category: 'SYSTEM DESIGN CORE',
    section: 'system-design-core',
    tag: 'distributed-systems',
    shortDesc: 'Memahami consensus untuk shared decision dan conflict resolution untuk concurrent state yang sah.',
    detail: `Consensus membuat node menyepakati satu urutan keputusan meski ada failure. Paxos adalah keluarga algoritma fundamental; Raft memisahkan leader election, log replication, dan safety agar lebih mudah dipahami serta diimplementasikan. Dalam interview, yang penting bukan menulis algoritmanya, melainkan memahami quorum, term/epoch, replicated log, leader failure, dan mengapa majority mencegah dua leader membuat keputusan yang sama-sama committed.

Consensus dipakai untuk metadata atau control plane seperti membership, leader, configuration, dan lock dengan fencing—bukan otomatis untuk setiap data byte. Ia tidak menghapus network delay dan tidak membuat system selalu available. Minority partition biasanya berhenti membuat keputusan untuk menjaga safety.

Conflict resolution dibutuhkan ketika concurrent write diizinkan. Last Write Wins sederhana tetapi dapat menghapus update sah dan bergantung pada ordering/clock. Vector clock mendeteksi hubungan happens-before serta concurrent versions, tetapi metadata tumbuh. CRDT dirancang agar update dapat digabung secara deterministik untuk tipe data tertentu seperti counter atau set. Pilihan terbaik sering berupa domain-specific merge, misalnya menyimpan conflict copy daripada diam-diam menimpa file user.`,
    springBoot: `Implementasi praktis:
- Gunakan etcd/Consul/ZooKeeper/database consensus bawaan, bukan membuat Raft sendiri di aplikasi.
- Distributed lock untuk correctness memerlukan lease dan fencing token.
- Optimistic versioning cocok untuk banyak conflict di level aplikasi.
- CRDT hanya dipakai bila semantics tipe datanya cocok dan tim mampu mengoperasikannya.
- Monitor leader change, quorum loss, election duration, conflict rate, dan reconciliation failure.`,
    comparison: `Trade-off utama:
- Raft/Paxos: keputusan tunggal aman; membutuhkan quorum dan menambah latency.
- LWW: murah dan deterministic; update valid dapat hilang.
- Vector clock: mendeteksi concurrency; metadata serta merge UX lebih kompleks.
- CRDT: convergence tanpa coordinator untuk tipe tertentu; semantics dan storage overhead spesifik.
- Domain merge: paling sesuai bisnis; perlu rule eksplisit dan pengujian kuat.`,
    bestPractices: `Best practices:
- Bedakan consensus, replication, distributed lock, dan conflict resolution.
- Gunakan epoch/term/fencing token untuk menolak writer lama setelah failover.
- Tentukan conflict policy bersama product/domain owner.
- Simpan enough metadata untuk audit serta reconciliation.
- Uji clock skew, duplicate, reorder, delayed message, dan long partition.`,
    pitfalls: `Red flags:
- Mengandalkan wall clock untuk distributed ordering tanpa batas skew.
- Menyebut Redis lock sebagai consensus tanpa safety assumptions.
- Menggunakan LWW untuk saldo atau inventory kritis.
- Menganggap CRDT dapat menyelesaikan semua invariant bisnis.
- Consensus cluster dengan dua node sehingga satu failure kehilangan quorum.`,
    rule: 'Consensus memilih satu keputusan; conflict resolution menggabungkan beberapa keputusan yang sama-sama terjadi.',
    code: `Raft mental model:
Follower --election timeout--> Candidate --majority votes--> Leader
Leader appends log -> majority acknowledgement -> commit

Conflict choices:
- overwrite acceptable      -> LWW
- detect concurrent writes  -> vector clock/version
- mergeable data type       -> CRDT
- business invariant        -> domain-specific resolution`,
  },
  {
    id: 'C07',
    title: 'Reliability & Failover',
    category: 'SYSTEM DESIGN CORE',
    section: 'system-design-core',
    tag: 'reliability',
    shortDesc: 'Merancang redundancy, health checks, failover, retries, circuit breaker, dan overload protection sebagai satu sistem.',
    detail: `Reliability dimulai dari target SLO dan failure domain. Active-passive lebih sederhana: standby mengambil alih ketika primary gagal, tetapi capacity standby dan failover readiness harus dibuktikan. Active-active meningkatkan utilization serta regional availability, namun membutuhkan routing, data consistency, conflict handling, dan mekanisme mencegah split brain.

Health check harus berlapis. Liveness menjawab apakah process perlu direstart; readiness apakah instance siap menerima traffic; dependency health membantu diagnosis tetapi jangan selalu membuat satu dependency minor mengeluarkan instance dari seluruh load balancer. Failover harus memakai threshold, hysteresis, dan sufficient evidence agar transient error tidak memicu failover storm.

Retry hanya aman untuk transient failure dan operasi idempotent, memakai exponential backoff, jitter, deadline, serta retry budget. Circuit breaker menghentikan call sementara ketika dependency gagal. Timeout, bulkhead, rate limit, load shedding, dan bounded queue melengkapi perlindungan dari cascading failure. Semua mekanisme harus mengikuti end-to-end latency budget; tumpukan retry per layer dapat melipatgandakan traffic.`,
    springBoot: `Implementasi praktis:
- Spring Boot Actuator untuk liveness/readiness; Resilience4j untuk timeout, retry, circuit breaker, dan bulkhead.
- Atur HTTP client connect/read deadline secara eksplisit.
- Gunakan graceful degradation dan cached/stale fallback hanya jika secara bisnis benar.
- Jalankan game day/chaos test untuk zone loss, dependency slowdown, dan partial outage.
- Monitor SLI user-facing: success rate, tail latency, freshness, dan availability per critical journey.`,
    comparison: `Trade-off utama:
- Active-passive: consistency/operasi lebih sederhana; standby cost dan failover delay.
- Active-active: kapasitas terpakai dan failover cepat; data conflict serta routing jauh lebih kompleks.
- Retry: menyembuhkan transient error; memperparah overload jika tidak dibatasi.
- Circuit breaker: membatasi cascading failure; threshold buruk dapat membuka terlalu cepat/lambat.
- Deep health check: deteksi dependency; dapat mengeluarkan semua instance sekaligus saat shared dependency gagal.`,
    bestPractices: `Best practices:
- Definisikan SLO, RTO, RPO, dan failure domain secara eksplisit.
- Sediakan capacity headroom untuk kehilangan node atau zone.
- Tempatkan retry hanya di layer yang memahami idempotency dan deadline.
- Gunakan jitter serta retry budget; gabungkan dengan circuit breaker dan load shedding.
- Uji failover berkala dan ukur actual recovery, bukan hanya diagram.`,
    pitfalls: `Red flags:
- Active-active diklaim tanpa strategi data conflict atau split-brain prevention.
- Semua exception di-retry tiga kali pada setiap layer.
- Liveness gagal karena database down sehingga seluruh pod restart bersamaan.
- Tidak ada capacity reserve saat satu zone hilang.
- Circuit breaker dipakai sebagai pengganti timeout.`,
    rule: 'Reliability adalah kemampuan gagal secara terkendali, bukan janji bahwa komponen tidak akan gagal.',
    code: `Request protection order:
deadline -> timeout -> bounded concurrency/bulkhead
         -> selective retry with backoff+jitter
         -> circuit breaker -> fallback or controlled failure

Health:
- liveness: should this process restart?
- readiness: should this instance receive traffic?
- dependency telemetry: what is degraded?`,
  },
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
    id: 'C11',
    title: 'Observability & Security',
    category: 'SYSTEM DESIGN CORE',
    section: 'system-design-core',
    tag: 'operations',
    shortDesc: 'Menghubungkan metrics, traces, logs, identity, dan encryption ke SLO serta threat model sistem.',
    detail: `Observability menjawab pertanyaan yang belum diprediksi melalui signals yang saling terhubung. Metrics murah untuk aggregation dan alerting; logs memberi detail event; distributed traces menunjukkan critical path lintas service. OpenTelemetry menstandarkan instrumentation serta context propagation. Prometheus menyimpan time-series metrics dan Grafana memvisualisasikan dashboard; Sentry kuat untuk error/performance context aplikasi. Centralized logging memerlukan structured field, correlation/trace ID, retention, access control, dan redaction.

Mulai dari SLI/SLO user-facing, lalu gunakan golden signals: traffic, error, latency, saturation. Alert harus actionable dan berbasis symptom/burn rate, bukan setiap anomali resource. High-cardinality attribute seperti user ID tidak boleh sembarangan menjadi metric label; simpan sebagai log/trace attribute dengan sampling serta privacy policy.

Security dimulai dari threat model dan least privilege. OAuth 2.0 menangani delegated authorization; OpenID Connect menambahkan identity; JWT hanyalah token format dan harus divalidasi issuer, audience, signature, expiry, serta key rotation. Encryption in transit memakai TLS/mTLS; at rest memakai disk/database/object encryption dengan managed keys. Kunci utama tetap lifecycle: generation, storage, access, rotation, revocation, audit, dan recovery.`,
    springBoot: `Implementasi praktis:
- Micrometer + OpenTelemetry untuk metrics/traces; Prometheus/Grafana untuk monitoring; Sentry/ELK/Loki untuk error dan logs.
- Propagasikan trace ID melalui HTTP dan messaging.
- Spring Security OAuth2 Resource Server untuk JWT/opaque token validation.
- Gunakan secret manager/KMS, TLS end-to-end, dan field-level encryption hanya untuk data yang memang membutuhkannya.
- Terapkan log redaction dan audit akses terhadap data sensitif.`,
    comparison: `Trade-off utama:
- Metrics: murah dan mudah di-alert; detail per event terbatas.
- Logs: detail tinggi; volume, biaya, dan pencarian dapat mahal.
- Traces: causal path lintas service; sampling dan context propagation perlu disiplin.
- JWT: validasi lokal scalable; revocation serta stale claim lebih sulit.
- Opaque token: kontrol/introspection terpusat; menambah dependency network.
- Encryption at rest: melindungi media/backup; tidak melindungi data ketika aplikasi berwenang membacanya.`,
    bestPractices: `Best practices:
- Definisikan SLO dan error budget sebelum dashboard menumpuk.
- Gunakan RED untuk service dan USE untuk resource; hubungkan alert ke runbook.
- Korelasikan metric exemplar, trace, dan structured log.
- Validasi OAuth/JWT secara lengkap dan buat authorization dekat dengan resource/domain.
- Enkripsi data in transit/at rest, rotasi key/secret, serta uji restore dan revocation.`,
    pitfalls: `Red flags:
- Dashboard banyak tetapi tidak ada SLO atau alert yang actionable.
- User ID/URL mentah menjadi Prometheus label dan meledakkan cardinality.
- Log menyimpan token, password, atau personal data.
- JWT dianggap otomatis aman karena signed, tanpa issuer/audience/expiry validation.
- Menyebut encryption tanpa membahas key management dan access control.`,
    rule: 'Observability harus membuktikan reliability; security harus membuktikan siapa dapat melakukan apa terhadap data mana.',
    code: `Request context:
client -> traceparent -> gateway -> service -> DB/broker
                    metrics + sampled spans + structured logs

Operational view:
SLO -> burn-rate alert -> dashboard -> trace -> correlated logs -> runbook

Security view:
authenticate -> authorize resource/action -> encrypt -> audit -> rotate/revoke`,
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
  {
    id: 'C13',
    title: 'Distributed Transactions & Time',
    category: 'SYSTEM DESIGN CORE',
    section: 'system-design-core',
    tag: 'coordination',
    shortDesc: 'Memilih 2PC, Saga, compensation, logical clock, dan ordering tanpa mengandalkan waktu mesin secara naif.',
    detail: `Two-Phase Commit (2PC) mengejar atomic commit lintas participant. Coordinator meminta semua participant prepare, lalu mengirim commit hanya jika semuanya siap. Model ini memberi atomicity kuat, tetapi participant dapat menahan lock dan menjadi blocked saat coordinator gagal. Karena latency, coupling, dan failure recovery-nya, 2PC biasanya cocok pada boundary terbatas dengan infrastructure support kuat—bukan default untuk microservices lintas region.

Saga memecah business transaction menjadi transaksi lokal. Jika langkah berikutnya gagal, sistem menjalankan compensating action seperti refund atau release inventory. Saga tidak benar-benar rollback waktu; kompensasi adalah operasi bisnis baru yang juga bisa gagal, harus idempotent, observable, dan bisa ditangani manual. Orchestration memusatkan state machine; choreography mengurangi coordinator tetapi alurnya lebih sulit dipahami.

Clock skew membuat timestamp antar mesin tidak aman sebagai urutan absolut. Gunakan monotonic clock untuk duration, database sequence/log position untuk ordering lokal, serta logical/vector clock ketika causal relationship dibutuhkan. Untuk distributed lock atau leader, gunakan epoch/fencing token agar writer lama tidak dapat menimpa state setelah lease-nya habis.`,
    springBoot: `Implementasi praktis:
- Gunakan local transaction + transactional outbox sebagai baseline lintas service.
- State machine Saga menyimpan step, attempt, compensation, dan correlation ID secara durable.
- Buat command serta compensation idempotent dan aman di-retry.
- Hindari wall clock untuk mengukur duration; gunakan monotonic time abstraction.
- Distributed lock harus menyertakan fencing token yang diverifikasi resource tujuan.`,
    comparison: `Trade-off utama:
- 2PC: atomicity kuat; blocking, lock duration, dan availability cost tinggi.
- Saga orchestration: flow dan recovery terlihat jelas; coordinator menjadi komponen penting.
- Saga choreography: coupling langsung berkurang; event chain dan debugging mudah menjadi kabur.
- Wall clock: sederhana; tidak membuktikan causal order antar node.
- Vector/logical clock: causal order lebih aman; metadata dan mental model bertambah.`,
    bestPractices: `Best practices:
- Mulai dari business invariant: apakah benar perlu atomicity lintas service?
- Nyatakan point of no return dan manual recovery path.
- Simpan Saga state, timeout, retry, compensation, serta audit trail.
- Gunakan correlation/causation ID untuk menelusuri satu transaksi end-to-end.
- Uji crash di antara setiap step, duplicate event, late event, dan failed compensation.`,
    pitfalls: `Red flags:
- Menyebut compensation sama dengan database rollback.
- Menggunakan 2PC lintas banyak service tanpa membahas blocking dan coordinator failure.
- Choreography puluhan event tanpa pemilik business flow.
- Mengurutkan event lintas node hanya dari timestamp.
- Distributed lock tanpa fencing sehingga stale owner masih dapat menulis.`,
    rule: 'Gunakan transaksi lokal dan compensation untuk workflow panjang; gunakan atomic commit hanya untuk invariant yang benar-benar memerlukannya.',
    code: `Saga:
Create order -> Reserve inventory -> Charge payment -> Shipment
                   | fail              | fail
                   v                   v
             Cancel order       Release + refund

2PC: coordinator -> PREPARE all -> COMMIT all | ABORT all
Fencing: storage rejects write tokens older than current epoch`,
  },
  {
    id: 'C14',
    title: 'Messaging, Pub/Sub & Backpressure',
    category: 'SYSTEM DESIGN CORE',
    section: 'system-design-core',
    tag: 'messaging',
    shortDesc: 'Mengendalikan fan-out, retry, poison message, consumer lag, dan overload dalam pipeline asynchronous.',
    detail: `Message queue mendistribusikan task sehingga satu message biasanya diselesaikan oleh satu consumer dalam sebuah worker group. Publish-subscribe mengirim salinan event ke beberapa subscriber independen. Durable stream mempertahankan log agar consumer group dapat membaca sesuai offset dan replay. Pemilihan bukan sekadar RabbitMQ versus Kafka, melainkan semantics: work distribution, fan-out, ordering scope, retention, replay, delivery guarantee, dan throughput.

Dead-letter queue (DLQ) memisahkan message yang terus gagal agar poison message tidak menghentikan aliran utama. DLQ bukan tempat sampah: harus ada alert, reason metadata, ownership, retention, inspection, dan controlled replay. Retry perlu exponential backoff, jitter, maximum attempt, serta klasifikasi transient versus permanent failure.

Backpressure mencegah producer yang cepat menenggelamkan consumer. Mekanismenya dapat berupa bounded queue, credit/flow control, pause consumption, concurrency limit, rate limit, atau load shedding. Queue yang terus membesar hanya memindahkan outage ke masa depan; pantau oldest-message age dan time-to-drain, bukan hanya jumlah message.`,
    springBoot: `Implementasi praktis:
- Spring Kafka untuk retained stream; Spring AMQP untuk work queue dan routing fleksibel.
- Pisahkan retry topic/queue per delay tier agar main partition tidak terblokir.
- Gunakan consumer concurrency terbatas dan pause/resume ketika dependency jenuh.
- Persist event ID untuk dedup side effect penting.
- Alert pada consumer lag, oldest age, retry rate, DLQ growth, dan projected drain time.`,
    comparison: `Trade-off utama:
- Queue: distribusi kerja sederhana; history/replay terbatas.
- Pub/sub: fan-out independen; setiap subscriber menambah operational surface.
- Stream: retention dan replay kuat; partition/offset/rebalance lebih kompleks.
- Buffer besar: menyerap burst; menyembunyikan overload dan memperbesar stale work.
- Reject/throttle producer: menjaga sistem; caller harus memiliki backoff/fallback.`,
    bestPractices: `Best practices:
- Definisikan ownership message, ordering key, dedup key, retention, dan replay policy.
- Buat producer menerima sinyal overload, bukan selalu berhasil enqueue.
- Sediakan poison-message quarantine beserta tooling inspeksi dan replay.
- Turunkan concurrency saat downstream saturation, bukan menambah retry.
- Ukur end-to-end event latency dari created-at hingga business effect selesai.`,
    pitfalls: `Red flags:
- DLQ ada tetapi tidak dimonitor atau tidak bisa direplay aman.
- Unbounded queue dianggap solusi scalability.
- Global ordering diminta pada broker berpartition.
- Semua error di-retry, termasuk validation atau authorization failure.
- Consumer ack sebelum side effect durable tanpa recovery mechanism.`,
    rule: 'Buffer menyerap burst, bukan kapasitas tanpa batas; backpressure harus muncul sebelum queue menjadi outage tertunda.',
    code: `Producer -> bounded broker -> consumer group -> dependency
              | retry tiers             | saturation
              v                         v
          DLQ/quarantine          pause / reduce concurrency

Watch: oldest age, lag, retry rate, DLQ growth, time to drain`,
  },
  {
    id: 'C15',
    title: 'Realtime Communication',
    category: 'SYSTEM DESIGN CORE',
    section: 'system-design-core',
    tag: 'realtime',
    shortDesc: 'Memilih polling, long polling, Server-Sent Events, atau WebSocket dan menskalakan koneksi panjang.',
    detail: `Polling sederhana dan cocok bila update jarang atau toleransi latency besar, tetapi banyak request menghasilkan no-change response. Long polling menahan request sampai ada update atau timeout. Server-Sent Events (SSE) menyediakan stream satu arah server-ke-browser di atas HTTP, memiliki reconnection semantics, dan cocok untuk notification, dashboard, serta streaming respons AI.

WebSocket menyediakan koneksi bidirectional persistent untuk chat, collaboration, multiplayer, dan trading. Tantangan produksinya bukan handshake, melainkan connection lifecycle: authentication refresh, heartbeat, reconnect, presence, per-connection memory, fan-out, slow consumer, ordering, dan delivery semantics. Koneksi yang stateful harus dipetakan ke gateway tertentu; message untuk user kemudian diroute melalui connection registry dan pub/sub backplane.

Realtime bukan berarti zero latency atau exactly-once. Definisikan freshness target, ordering scope, missed-event recovery, resume cursor, dan fallback saat client offline. Untuk update yang tidak memerlukan bidirectional channel, SSE sering lebih sederhana serta lebih mudah melewati proxy/firewall.`,
    springBoot: `Implementasi praktis:
- Spring WebFlux/SSE untuk one-way event stream; Spring WebSocket untuk bidirectional session.
- Simpan durable event di broker/store; gateway koneksi bukan source of truth.
- Gunakan heartbeat, idle timeout, exponential reconnect, dan resume token/last-event-id.
- Batasi outbound buffer per connection dan putuskan slow consumer secara terkendali.
- Pantau active connections, reconnect rate, fan-out latency, dropped messages, dan buffer pressure.`,
    comparison: `Trade-off utama:
- Polling: sangat sederhana; latency dan wasted requests.
- Long polling: kompatibel HTTP; banyak koneksi/request lifecycle.
- SSE: one-way, reconnect built-in, HTTP-friendly; tidak bidirectional.
- WebSocket: full duplex dan low overhead; stateful operation serta routing lebih kompleks.
- Durable log + cursor: recovery kuat; storage dan dedup bertambah.`,
    bestPractices: `Best practices:
- Pilih protocol dari arah data, update frequency, dan delivery requirement.
- Pisahkan connection gateway dari durable messaging backbone.
- Sediakan snapshot + incremental events agar reconnect tidak memerlukan seluruh history.
- Terapkan per-user/device quota dan slow-consumer policy.
- Uji reconnect storm, gateway loss, duplicate, reorder, dan offline client.`,
    pitfalls: `Red flags:
- Memilih WebSocket untuk semua hal yang disebut realtime.
- Menyimpan chat/history hanya di memory gateway.
- Tidak punya resume mechanism setelah reconnect.
- Broadcast fan-out dilakukan satu per satu dari application thread.
- Tidak menghitung memory/file descriptor per connection.`,
    rule: 'Gunakan SSE untuk push satu arah dan WebSocket untuk interaksi dua arah; selalu desain reconnect serta missed-event recovery.',
    code: `One-way: Browser <- SSE gateway <- event broker

Bidirectional:
Client <-> WebSocket gateway
             | registry: user -> gateway
             v
          pub/sub backplane -> other gateways

Reconnect: snapshot(version=120) + events(after=120)`,
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

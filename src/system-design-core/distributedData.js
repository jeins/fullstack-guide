export const distributedDataConcepts = [
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
];

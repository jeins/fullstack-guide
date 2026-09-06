export const messagingAndRealtimeConcepts = [
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
];

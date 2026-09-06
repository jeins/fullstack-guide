export const reliabilityAndOperationsConcepts = [
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
];

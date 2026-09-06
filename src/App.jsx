import React, { useEffect, useMemo, useState } from 'react';
import {
  Lightbulb,
  Copy,
  Check,
  Menu,
  X,
  Code2,
  Search,
  Layers3,
  ShieldCheck,
  ServerCog,
  Rocket,
  BrainCircuit,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { coreSystemDesignConcepts } from './coreSystemDesignConcepts';
import { coreSystemDesignDiagrams } from './coreSystemDesignDiagrams';

const learningSections = [
  {
    id: 'api-core',
    title: 'API Fundamentals',
    description: 'Konsep inti REST/API contract yang wajib solid sebelum masuk ke scaling dan architecture.',
    icon: Layers3,
    accent: 'blue',
  },
  {
    id: 'security',
    title: 'Security & Access',
    description: 'Authentication, authorization, token, dan delegated access untuk sistem modern.',
    icon: ShieldCheck,
    accent: 'violet',
  },
  {
    id: 'reliability',
    title: 'Reliability & Performance',
    description: 'Bagaimana API tetap waras saat traffic naik, request di-retry, dan data makin besar.',
    icon: Rocket,
    accent: 'emerald',
  },
  {
    id: 'architecture',
    title: 'API Architecture',
    description: 'Versioning, gateway, documentation, integration style, dan service boundaries.',
    icon: ServerCog,
    accent: 'amber',
  },
  {
    id: 'system-design-core',
    title: 'System Design Core',
    description: 'Enam belas fondasi terstruktur: traffic, data, distributed systems, reliability, realtime, dan AI retrieval.',
    icon: BrainCircuit,
    accent: 'cyan',
  },
  {
    id: 'system-design',
    title: 'System Design',
    description: 'Materi baru untuk menjawab diskusi desain level senior secara lebih terstruktur dan end-to-end.',
    icon: BrainCircuit,
    accent: 'pink',
  },
  {
    id: 'interview-kit',
    title: 'Interview Kit',
    description: 'Best practices, senior thinking, dan pola jawaban interview backend + frontend.',
    icon: Lightbulb,
    accent: 'cyan',
  },
];

const apiConcepts = [
  {
    id: '01',
    title: 'Endpoint',
    category: 'FOUNDATIONS',
    section: 'api-core',
    tag: 'core',
    shortDesc: 'URL spesifik di mana API Anda dapat diakses — alamat sebuah sumber daya.',
    code: `// Spring Boot REST endpoint\n@RestController\n@RequestMapping("/api/v1/users")\nclass UserController {\n\n  @GetMapping\n  List<UserResponse> findAll() { ... }\n\n  @GetMapping("/{id}")\n  UserResponse findById(@PathVariable Long id) { ... }\n\n  @PostMapping\n  ResponseEntity<UserResponse> create(@Valid @RequestBody CreateUserRequest req) { ... }\n\n  @PatchMapping("/{id}")\n  UserResponse patch(@PathVariable Long id, @RequestBody PatchUserRequest req) { ... }\n\n  @DeleteMapping("/{id}")\n  ResponseEntity<Void> delete(@PathVariable Long id) { ... }\n}`,
    detail: `Endpoint adalah pintu masuk resmi ke kapabilitas API. Secara praktis, endpoint = kombinasi URL path + HTTP method + kontrak request/response. Dalam interview senior Java, Anda biasanya diharapkan tidak hanya tahu cara membuat endpoint, tetapi juga alasan desainnya: resource naming, consistency, discoverability, dan maintainability.\n\nPrinsip REST yang sehat adalah memakai kata benda untuk resource: /users, /orders, /payments. Method HTTP membawa aksi. Ini membuat API lebih mudah dipahami lintas tim. Endpoint yang baik juga stabil: perubahan internal service, repository, atau orchestration tidak boleh memaksa client mengganti path terus-menerus.\n\nDalam Spring Boot, endpoint biasanya dibangun dengan @RestController, @RequestMapping, @GetMapping, @PostMapping, dan kawan-kawan. Untuk API enterprise, penting juga memikirkan versioning sejak awal, path hierarchy, validation boundary, dan DTO terpisah dari entity JPA agar model persistence tidak bocor ke contract publik.`,
    rule: 'Gunakan noun-based resource path, konsisten plural, dan pisahkan API contract dari entity internal.',
    springBoot: `Tools/Framework Java yang umum:\n- Spring Boot Web / Spring MVC: standar utama untuk REST API sinkron.\n- Spring WebFlux: untuk reactive endpoint berbasis non-blocking.\n- Jakarta Validation / Hibernate Validator: validasi request DTO.\n- springdoc-openapi: generate dokumentasi endpoint otomatis.\n- MapStruct: mapping DTO <-> domain/entity.\n\nImplementasi yang lazim di Spring Boot:\n- Controller hanya menangani HTTP boundary.\n- Service berisi business logic.\n- Repository menangani persistence.\n- DTO request/response dipisah dari entity JPA.\n\nHal interview yang sering dibahas:\n- Kapan memakai nested resource seperti /users/{id}/orders?\n- Kapan endpoint terlalu chatty dan perlu agregasi?\n- Kapan pakai WebFlux vs MVC?`,
    comparison: `Perbandingan pendekatan:\n- Spring MVC vs WebFlux\n  - MVC: lebih sederhana, matang, cocok untuk mayoritas CRUD & enterprise apps.\n  - WebFlux: cocok untuk I/O heavy, streaming, high concurrency, tetapi debugging dan mental model lebih kompleks.\n\n- Flat endpoint vs nested endpoint\n  - Flat (/orders?userId=1): lebih fleksibel untuk query/filtering.\n  - Nested (/users/1/orders): lebih ekspresif untuk relasi parent-child yang jelas.\n\n- Expose entity langsung vs DTO\n  - Entity langsung: cepat di awal, tapi berisiko bocor field sensitif dan coupling tinggi.\n  - DTO: lebih aman, stabil, dan interview-wise dianggap desain yang lebih matang.`,
  },
  {
    id: '02',
    title: 'HTTP Methods',
    category: 'FOUNDATIONS',
    section: 'api-core',
    tag: 'core',
    shortDesc: 'Tindakan standar yang dilakukan pada sumber daya.',
    code: `@PostMapping("/articles")\nResponseEntity<ArticleResponse> create(@RequestBody CreateArticleRequest req) { ... }\n\n@GetMapping("/articles")\nList<ArticleResponse> findAll() { ... }\n\n@PutMapping("/articles/{id}")\nArticleResponse replace(@PathVariable Long id, @RequestBody ReplaceArticleRequest req) { ... }\n\n@PatchMapping("/articles/{id}")\nArticleResponse patch(@PathVariable Long id, @RequestBody PatchArticleRequest req) { ... }\n\n@DeleteMapping("/articles/{id}")\nResponseEntity<Void> delete(@PathVariable Long id) { ... }`,
    detail: `HTTP methods adalah semantik dasar kontrak API. GET untuk membaca, POST untuk membuat atau men-trigger proses non-idempotent, PUT untuk replace keseluruhan representasi resource, PATCH untuk perubahan parsial, dan DELETE untuk penghapusan.\n\nDi interview senior, pembeda level bukan sekadar hafal CRUD mapping, tetapi memahami sifat method: idempotency, cacheability, safety, dan retry behavior. Misalnya, GET harus aman dari side effect; PUT secara teori idempotent; POST tidak otomatis idempotent kecuali ditambah mekanisme seperti Idempotency-Key.\n\nDalam Spring Boot, anotasi method mapping langsung mencerminkan semantik ini. Tetapi yang penting bukan anotasinya, melainkan apakah contract Anda sesuai dengan ekspektasi client dan infrastruktur seperti proxy, CDN, retry policy, dan observability tool.`,
    rule: 'Pilih HTTP method berdasarkan semantik, bukan sekadar supaya endpoint “jalan”.',
    springBoot: `Tools/Framework Java yang umum:\n- Spring MVC annotations: @GetMapping, @PostMapping, @PutMapping, @PatchMapping, @DeleteMapping.\n- JsonMergePatch / JSON Patch library: untuk partial update yang lebih formal.\n- Jackson: serialisasi/deserialisasi body JSON.\n\nPraktik Spring Boot:\n- PUT biasanya memakai payload lengkap representasi resource.\n- PATCH cocok untuk update parsial dan field opsional.\n- DELETE idealnya return 204 bila sukses tanpa body.\n\nPertanyaan interview umum:\n- Bedanya PUT dan PATCH secara semantik?\n- Kapan POST dipakai untuk command/process, bukan create resource biasa?\n- Apa risiko memakai GET untuk operasi mutasi?`,
    comparison: `Perbandingan penting:\n- PUT vs PATCH\n  - PUT: replace penuh, idempotent, contract lebih tegas.\n  - PATCH: hemat payload, cocok untuk partial update, tapi validasi dan merge logic lebih rumit.\n\n- POST create vs POST action\n  - POST /orders: create resource baru.\n  - POST /payments/{id}/capture: trigger aksi/command.\n  - Action-style POST sah jika memang tidak natural dimodelkan sebagai resource CRUD.\n\n- Soft delete vs hard delete\n  - Soft delete: aman audit/history, tapi query harus disiplin filter deleted flag.\n  - Hard delete: sederhana, tapi data recovery/audit lebih sulit.`,
  },
  {
    id: '03',
    title: 'Request-Response',
    category: 'FOUNDATIONS',
    section: 'api-core',
    tag: 'core',
    shortDesc: 'Siklus komunikasi dasar API yang terdiri dari headers, body, dan parameters.',
    code: `POST /api/v1/payments HTTP/1.1\nAuthorization: Bearer <token>\nContent-Type: application/json\nX-Request-Id: req-123\n\n{\n  "amount": 100000,\n  "currency": "IDR",\n  "method": "VA"\n}\n\nHTTP/1.1 201 Created\nLocation: /api/v1/payments/pay_123\nContent-Type: application/json\n\n{\n  "id": "pay_123",\n  "status": "PENDING",\n  "amount": 100000\n}`,
    detail: `Model request-response terlihat sederhana, tetapi di sistem nyata banyak aspek penting hidup di sini: validation, correlation-id, authentication header, content negotiation, compression, timeout, retry, dan error contract.\n\nRequest berisi line awal (method + URL), headers, query/path params, dan mungkin body. Response berisi status code, headers, dan body. Dalam sistem enterprise Java, Anda juga perlu memikirkan traceability: request id, user id, tenant id, locale, serta error schema yang konsisten.\n\nDi Spring Boot, ini biasanya diterjemahkan menjadi @RequestHeader, @RequestParam, @PathVariable, @RequestBody, ResponseEntity, dan exception handler global. Senior engineer biasanya ditanya bagaimana men-design API agar request-response contract tidak rapuh, mudah diobservasi, dan aman berubah.`,
    rule: 'Pisahkan metadata di header, data utama di body, dan identitas resource di path/query secara konsisten.',
    springBoot: `Tools/Framework Java yang umum:\n- Spring MVC / ResponseEntity.\n- Jackson untuk JSON mapping.\n- Bean Validation untuk validasi request.\n- OncePerRequestFilter / HandlerInterceptor untuk correlation id dan logging.\n- Micrometer + OpenTelemetry untuk tracing/metrics.\n\nImplementasi Java yang lazim:\n- Gunakan DTO request/response yang eksplisit.\n- Tambahkan X-Request-Id atau trace id untuk observability.\n- Pakai @ControllerAdvice untuk error response yang seragam.\n- Gunakan ResponseEntity bila perlu mengontrol status code + headers dengan jelas.`,
    comparison: `Perbandingan pilihan desain:\n- Query param vs path variable\n  - Path variable: identitas resource utama (/users/42).\n  - Query param: filtering, sorting, pagination (/users?status=ACTIVE).\n\n- ResponseEntity vs return object langsung\n  - Return object langsung: singkat, cocok untuk kasus sederhana.\n  - ResponseEntity: lebih eksplisit untuk headers, status, caching, location.\n\n- Synchronous HTTP vs async/event-driven follow-up\n  - Sync: mudah dipahami untuk CRUD.\n  - Async: lebih cocok untuk proses lama seperti export, settlement, email batch.`,
  },
  {
    id: '04',
    title: 'Status Codes',
    category: 'FOUNDATIONS',
    section: 'api-core',
    tag: 'core',
    shortDesc: 'Indikator numerik standar yang menjelaskan hasil dari permintaan ke server.',
    code: `200 OK\n201 Created\n202 Accepted\n204 No Content\n400 Bad Request\n401 Unauthorized\n403 Forbidden\n404 Not Found\n409 Conflict\n422 Unprocessable Entity\n500 Internal Server Error\n503 Service Unavailable`,
    detail: `Status code adalah bahasa universal antara server, client, proxy, gateway, retry mechanism, dan observability platform. Pemakaian yang benar membuat sistem lebih mudah di-debug dan diintegrasikan.\n\nBanyak API buruk mengembalikan 200 untuk semua hal lalu menaruh status sukses/gagal di body. Itu antipattern. Client harus bisa mengambil keputusan dari status code tanpa harus mem-parsing body dulu.\n\nDi level senior Java, Anda perlu paham kapan memakai 400 vs 422, 401 vs 403, 409 vs 422, 500 vs 503, dan kapan 202 Accepted lebih tepat untuk proses asynchronous.`,
    rule: 'Jangan samarkan error sebagai 200 OK. Biarkan layer HTTP bekerja sebagaimana mestinya.',
    springBoot: `Tools/Framework Java yang umum:\n- ResponseEntity untuk set status code eksplisit.\n- @ResponseStatus untuk mapping sederhana.\n- @ControllerAdvice + @ExceptionHandler untuk central error-to-status mapping.\n- ProblemDetail (Spring 6 / Boot 3) untuk standar error modern.\n\nImplementasi lazim di Spring Boot:\n- Validasi gagal -> 400 atau 422 sesuai standar internal tim.\n- Resource tidak ditemukan -> 404.\n- Konflik bisnis seperti duplicate unique field -> 409.\n- Error tak terduga -> 500.\n- Service dependency down -> bisa dipetakan ke 503 jika relevan.`,
    comparison: `Perbandingan yang sering ditanya:\n- 400 vs 422\n  - 400: request malformed / format salah.\n  - 422: format valid tapi isi melanggar aturan bisnis/validasi domain.\n\n- 401 vs 403\n  - 401: belum autentik atau token invalid.\n  - 403: sudah dikenal tapi tidak punya izin.\n\n- 409 vs 422\n  - 409: konflik state/resource, misalnya optimistic locking atau duplicate constraint.\n  - 422: domain validation gagal tanpa konflik resource state yang khas.`,
  },
  {
    id: '05',
    title: 'Authentication',
    category: 'SECURITY',
    section: 'security',
    tag: 'security',
    shortDesc: 'Verifikasi identitas pengguna atau sistem yang mengakses API.',
    code: `http\nAuthorization: Basic base64(user:pass)\nX-API-Key: my-secret-key\nAuthorization: Bearer eyJhbGciOi...\n\n// Spring Security config biasanya memvalidasi credential sebelum controller dipanggil`,
    detail: `Authentication menjawab pertanyaan “siapa Anda?”. Di sistem Java modern, ini hampir selalu berada di lapisan filter/security chain sebelum request mencapai controller.\n\nBentuk autentikasi bisa berbeda tergantung konteks: Basic Auth untuk integrasi internal sederhana, API key untuk machine-to-machine tertentu, Bearer token/JWT untuk web/mobile API modern, dan mutual TLS untuk sistem dengan keamanan tinggi.\n\nDalam interview senior, yang diuji bukan hanya istilahnya, tetapi trade-off-nya: bagaimana rotasi secret dilakukan, bagaimana token divalidasi, bagaimana stateless auth memengaruhi scaling, dan bagaimana audit trail dibangun.`,
    rule: 'Jangan pernah mengirim secret lewat query param atau menyimpan plaintext credential sembarangan di config/log.',
    springBoot: `Tools/Framework Java yang umum:\n- Spring Security: fondasi utama autentikasi dan filter chain.\n- OAuth2 Resource Server: validasi Bearer/JWT.\n- Nimbus JOSE JWT: parsing/verification JWT.\n- Keycloak / Auth0 / Okta / Cognito: identity provider eksternal.\n- mTLS via reverse proxy / ingress / service mesh untuk internal system.\n\nImplementasi di Spring Boot:\n- Tambahkan spring-boot-starter-security.\n- Untuk JWT: spring-boot-starter-oauth2-resource-server.\n- Gunakan SecurityFilterChain untuk mendefinisikan endpoint mana yang open/protected.\n- Simpan principal/claims di SecurityContext.`,
    comparison: `Perbandingan metode:\n- Session-based vs stateless token\n  - Session-based: mudah untuk aplikasi web tradisional, tapi scaling horizontal butuh shared session store.\n  - Stateless token: cocok untuk API modern dan microservices, tapi revocation lebih kompleks.\n\n- API Key vs JWT\n  - API Key: simpel, cocok machine-to-machine dasar, tapi claim/context minim.\n  - JWT: kaya claim, scalable, tapi perlu disiplin soal expiry, size, dan signature validation.\n\n- Basic Auth vs OAuth2/JWT\n  - Basic Auth: mudah, tapi lemah untuk skenario modern/public API.\n  - OAuth2/JWT: lebih aman dan fleksibel, tapi setup lebih kompleks.`,
  },
  {
    id: '06',
    title: 'Authorization',
    category: 'SECURITY',
    section: 'security',
    tag: 'security',
    shortDesc: 'Menentukan hak akses setelah pengguna diautentikasi.',
    code: `@PreAuthorize("hasRole('ADMIN') or @postSecurity.isOwner(#postId, authentication)")\n@DeleteMapping("/posts/{postId}")\npublic ResponseEntity<Void> delete(@PathVariable Long postId) {\n    service.delete(postId);\n    return ResponseEntity.noContent().build();\n}`,
    detail: `Authorization menjawab “apa yang boleh Anda lakukan?”. Setelah identitas diketahui, sistem masih harus memutuskan hak akses terhadap resource, aksi, tenant, atau data tertentu.\n\nDi sistem enterprise Java, authorization bisa terjadi di beberapa level: URL-level security, method-level security, domain-level access control, bahkan row-level filtering. Senior engineer biasanya perlu membedakan coarse-grained authorization (role) dan fine-grained authorization (ownership, attribute, tenant, scope).\n\nKesalahan umum adalah merasa aman hanya dengan role ADMIN/USER. Sistem nyata sering butuh kebijakan lebih detail: user boleh lihat datanya sendiri, manager boleh lihat timnya, finance boleh approve sampai nominal tertentu, dsb.`,
    rule: 'Role saja jarang cukup. Untuk sistem serius, kombinasikan role, ownership, scope, dan context bisnis.',
    springBoot: `Tools/Framework Java yang umum:\n- Spring Security method security: @PreAuthorize, @PostAuthorize.\n- AccessDecisionVoter / AuthorizationManager.\n- SpEL untuk rule sederhana.\n- Policy engine eksternal seperti OPA atau custom ABAC service untuk rule kompleks.\n\nPraktik Spring Boot:\n- URL security untuk coarse rule.\n- Method/domain security untuk rule yang dekat ke business logic.\n- Hindari hardcode rule kompleks di controller.\n- Simpan scope/role/tenant info di token claims bila cocok.`,
    comparison: `Perbandingan model authorization:\n- RBAC (Role-Based Access Control)\n  - Mudah dipahami dan implementasi cepat.\n  - Bisa meledak jumlah role jika kebutuhan makin kompleks.\n\n- ABAC (Attribute-Based Access Control)\n  - Fleksibel untuk rule kaya konteks.\n  - Lebih sulit di-debug dan di-maintain.\n\n- ACL / ownership-based\n  - Bagus untuk resource-specific permission.\n  - Perlu desain storage dan query yang rapi.\n\nInterview sering suka pertanyaan: kapan RBAC tidak cukup? Jawaban matangnya: saat rule tergantung tenant, region, resource ownership, nominal transaksi, atau jam operasional.`,
  },
  {
    id: '07',
    title: 'Access Tokens',
    category: 'SECURITY',
    section: 'security',
    tag: 'security',
    shortDesc: 'Kredensial berumur pendek yang mewakili hak akses.',
    code: `{"sub":"user_123","scope":"payments:read payments:write","role":"ADMIN","exp":1735689600,"iss":"https://auth.example.com"}`,
    detail: `Access token adalah representasi hak akses yang dipakai client setelah login/authorization selesai. Ia biasanya bersifat short-lived agar risiko kebocoran tidak berlangsung lama.\n\nJWT populer karena self-contained: token membawa claims yang cukup untuk authorization ringan tanpa selalu call database. Tetapi self-contained token juga punya konsekuensi: sulit revoke instan, ukuran membesar jika claims berlebihan, dan perubahan hak akses user tidak langsung tercermin sampai token baru diterbitkan.\n\nDalam interview senior, bahas juga opaque token vs JWT, introspection endpoint, refresh token rotation, dan bagaimana membatasi blast radius jika token bocor.`,
    rule: 'Buat access token singkat umur hidupnya, minimalkan claim, dan jangan menaruh data sensitif berlebihan di dalamnya.',
    springBoot: `Tools/Framework Java yang umum:\n- Spring Security OAuth2 Resource Server.\n- NimbusJwtDecoder / JWK Set URI.\n- Keycloak / Auth Server lain untuk token issuance.\n- Redis/token store jika memakai opaque token atau revocation list.\n\nPraktik di Spring Boot:\n- Validasi issuer, audience, signature, expiry.\n- Mapping claim ke GrantedAuthority.\n- Gunakan refresh token di authorization server, bukan di resource server.\n- Audit akses penting berdasarkan subject/token id/request id.`,
    comparison: `Perbandingan token:\n- JWT vs opaque token\n  - JWT: cepat divalidasi lokal, cocok untuk scale-out, tapi revocation lebih sulit.\n  - Opaque token: lebih mudah revoke/introspect terpusat, tapi menambah network hop ke auth server.\n\n- Short-lived token vs long-lived token\n  - Short-lived: lebih aman.\n  - Long-lived: lebih praktis tapi blast radius besar jika bocor.\n\n- Rich claims vs minimal claims\n  - Rich claims: mengurangi lookup tambahan.\n  - Minimal claims: token kecil, risiko kebocoran data lebih rendah.`,
  },
  {
    id: '08',
    title: 'OAuth 2.0',
    category: 'SECURITY',
    section: 'security',
    tag: 'security',
    shortDesc: 'Standar industri untuk otorisasi terdelegasi yang aman.',
    code: `// Authorization Code Flow with PKCE (modern best practice)\n1. Client redirect user to Authorization Server\n2. User login + consent\n3. Client receives authorization code\n4. Client exchanges code + code_verifier for access token\n5. Client calls Resource Server with Bearer token`,
    detail: `OAuth 2.0 adalah framework otorisasi terdelegasi, bukan login protocol murni. Ia memungkinkan aplikasi mendapatkan akses terbatas ke resource milik user di sistem lain tanpa mengetahui password user.\n\nDalam praktik modern, Authorization Code Flow + PKCE adalah standar terbaik untuk aplikasi web SPA dan mobile. Client Credentials cocok untuk service-to-service. Resource Owner Password flow dianggap legacy dan sebaiknya dihindari.\n\nDi interview senior Java, sering muncul topik perbedaan OAuth2 dengan OpenID Connect, pembagian role Authorization Server vs Resource Server, scope design, consent, dan token lifecycle.`,
    rule: 'Pilih flow sesuai tipe client. Untuk aplikasi modern, prioritaskan Authorization Code + PKCE.',
    springBoot: `Tools/Framework Java yang umum:\n- Spring Security OAuth2 Client.\n- Spring Security OAuth2 Resource Server.\n- Spring Authorization Server untuk membangun auth server sendiri.\n- Keycloak sebagai solusi identity + authorization server yang populer.\n\nImplementasi umum:\n- Resource server memvalidasi access token.\n- Authorization server menerbitkan token.\n- Scope dipakai untuk coarse-grained permission.\n- OIDC ditambahkan jika perlu identitas user standar (id_token, userinfo).`,
    comparison: `Perbandingan flow:\n- Authorization Code + PKCE\n  - Paling aman untuk user-facing app modern.\n  - Sedikit lebih kompleks tapi best practice.\n\n- Client Credentials\n  - Cocok untuk service-to-service tanpa user.\n  - Tidak mewakili identitas end-user.\n\n- Device Code\n  - Bagus untuk TV/CLI/device tanpa browser nyaman.\n\n- OAuth2 vs OpenID Connect\n  - OAuth2: authorization/delegated access.\n  - OIDC: authentication identity layer di atas OAuth2.`,
  },
  {
    id: '09',
    title: 'Rate Limiting',
    category: 'RELIABILITY',
    section: 'reliability',
    tag: 'perf',
    shortDesc: 'Membatasi frekuensi request agar API tetap fair, stabil, dan tahan abuse saat traffic naik.',
    code: `HTTP/1.1 429 Too Many Requests\nX-RateLimit-Limit: 100\nX-RateLimit-Remaining: 0\nX-RateLimit-Reset: 1710000000\nRetry-After: 60`,
    detail: `Rate limiting melindungi API dari abuse, brute force, retry storm, accidental infinite loop, dan noisy client yang menghabiskan shared capacity. Di sistem nyata, tujuannya bukan cuma security, tetapi juga fairness dan reliability: satu partner atau tenant tidak boleh merusak pengalaman user lain.\n\nDesain rate limit yang matang selalu dimulai dari policy. Siapa yang dibatasi: IP, API key, user, tenant, atau kombinasi? Endpoint mana yang mahal dan butuh limit lebih ketat? Apakah client boleh burst sebentar lalu melambat, atau harus benar-benar rata? Pertanyaan ini penting karena rate limit adalah keputusan produk sekaligus keputusan infrastruktur.\n\nDi distributed system, tantangan utamanya adalah enforcement yang konsisten. Counter lokal per instance mungkin cukup untuk app kecil, tetapi akan bias saat request tersebar ke banyak node. Karena itu, implementasi produksi sering diletakkan di gateway atau memakai Redis/shared store. Dalam interview senior, bagus jika Anda bisa menjelaskan trade-off fixed window, sliding window, dan token bucket, lalu mengaitkannya ke fairness, memory cost, dan burst tolerance.`,
    rule: 'Rate limit yang baik dimulai dari policy dan fairness, lalu dipilih algoritma serta lokasi enforcement yang paling cocok.',
    springBoot: `Tools/Framework Java yang umum:\n- Bucket4j: populer dan praktis untuk rate limiting di ekosistem Java.\n- Resilience4j RateLimiter: lebih umum untuk outbound call, tetapi tetap berguna untuk pola tertentu.\n- Redis sebagai shared counter/token store pada deployment multi-instance.\n- Spring Cloud Gateway untuk proteksi global di edge.\n\nPraktik Spring Boot:\n- Untuk service kecil/monolith: filter atau interceptor + Bucket4j sering sudah cukup.\n- Untuk cluster besar: pindahkan enforcement ke gateway atau shared store agar limit konsisten.\n- Return 429 lengkap dengan Retry-After dan header limit agar client bisa backoff dengan benar.\n- Track reject rate dan key yang paling sering kena limit untuk tuning policy.`,
    comparison: `Perbandingan algoritma:\n- Fixed Window\n  - Mudah, murah, gampang dioperasikan.\n  - Kurang fair karena burst bisa menumpuk di batas window.\n\n- Sliding Window\n  - Lebih presisi dan fair.\n  - Lebih mahal dari sisi state/compute.\n\n- Token Bucket\n  - Bagus untuk burst terkontrol sambil menjaga average rate.\n  - Sangat umum untuk produksi karena komprominya enak.\n\nPerbandingan lokasi enforcement:\n- Di gateway\n  - Terpusat, konsisten, cocok untuk proteksi global dan partner/public API.\n- Di app service\n  - Lebih dekat ke context bisnis, tapi rawan tersebar dan ganda jika tidak disiplin.`,
  },
  {
    id: '10',
    title: 'Throttling',
    category: 'RELIABILITY',
    section: 'reliability',
    tag: 'perf',
    shortDesc: 'Mengatur laju pemrosesan request secara dinamis agar server tidak kewalahan.',
    code: `Client -> API Gateway -> Queue -> Worker Pool\n\n// Spring example ideas:\n- @Async for background tasks\n- Kafka/RabbitMQ for buffering\n- ThreadPoolTaskExecutor for bounded concurrency`,
    detail: `Throttling berbeda dari rate limiting. Rate limiting biasanya memutuskan apakah request boleh diterima atau ditolak. Throttling lebih fokus ke mengendalikan throughput pemrosesan agar backend tetap stabil di bawah beban.\n\nDalam praktik Java enterprise, throttling sering muncul pada operasi mahal: report generation, batch export, downstream third-party integration, atau resource-intensive computation. Daripada semua request diproses sekaligus dan menyebabkan collapse, sistem menjaga concurrency/throughput tetap sehat.\n\nSenior engineer perlu paham di mana throttling ditempatkan: ingress layer, worker pool, queue consumer, database connection pool, atau downstream client.`,
    rule: 'Gunakan throttling untuk menjaga sistem tetap waras saat traffic spike, bukan hanya untuk menolak request.',
    springBoot: `Tools/Framework Java yang umum:\n- ThreadPoolTaskExecutor / TaskExecutor.\n- @Async untuk background processing sederhana.\n- Kafka / RabbitMQ / ActiveMQ untuk buffering.\n- Resilience4j Bulkhead dan RateLimiter untuk outbound/downstream protection.\n- Reactor backpressure jika memakai WebFlux.\n\nPraktik di Spring Boot:\n- Batasi ukuran thread pool dan queue secara sadar.\n- Pisahkan pool untuk workload berbeda.\n- Gunakan async processing untuk pekerjaan lama.\n- Lindungi downstream dependency dengan bulkhead + timeout + circuit breaker.`,
    comparison: `Perbandingan konsep:\n- Rate Limiting vs Throttling\n  - Rate limiting: membatasi berapa banyak request boleh masuk.\n  - Throttling: mengatur seberapa cepat request diproses.\n\n- Queue-based throttling vs direct processing\n  - Queue: lebih tahan spike, tapi ada latency tambahan.\n  - Direct: latency rendah, tapi lebih mudah collapse saat lonjakan.\n\n- Fixed thread pool vs reactive backpressure\n  - Thread pool: mudah dipahami.\n  - Reactive backpressure: kuat untuk stream/non-blocking, tapi lebih sulit operasionalnya.`,
  },
  {
    id: '11',
    title: 'Pagination',
    category: 'RELIABILITY',
    section: 'reliability',
    tag: 'perf',
    shortDesc: 'Membagi data besar menjadi potongan kecil yang mudah diproses.',
    code: `GET /users?page=0&size=20&sort=createdAt,desc\nGET /users?cursor=eyJpZCI6MTIzLCJjcmVhdGVkQXQiOiIyMDI2LTAxLTAxIn0=&limit=20\n\n// Spring Data\nPage<UserEntity> findAll(Pageable pageable);`,
    detail: `Pagination adalah pertahanan dasar terhadap query liar dan response yang terlalu besar. Tanpa pagination, endpoint list cepat menjadi bottleneck database, memory, network, dan client rendering.\n\nOffset pagination mudah dipahami dan didukung rapi oleh Spring Data Pageable. Tetapi pada dataset besar atau feed yang terus berubah, offset makin lambat dan rentan inconsistency. Cursor/keyset pagination lebih efisien dan stabil untuk infinite scroll atau data append-heavy.\n\nDi interview senior, biasanya Anda ditanya kapan Page, Slice, atau keyset lebih tepat; apa dampak ORDER BY terhadap index; dan bagaimana menjaga sort stability.`,
    rule: 'Selalu tetapkan limit default dan max limit. Jangan izinkan query list tanpa pagar pembatas.',
    springBoot: `Tools/Framework Java yang umum:\n- Spring Data JPA Pageable / Page / Slice.\n- Querydsl atau jOOQ untuk query dinamis yang lebih kompleks.\n- Custom cursor pagination logic untuk high-scale feed.\n\nPraktik Spring Boot:\n- CRUD admin panel sering cukup dengan Pageable.\n- Feed/time-series besar lebih cocok cursor/keyset.\n- Pastikan kolom sort diindeks.\n- Hindari count query mahal jika tidak perlu; Slice bisa lebih hemat dari Page.`,
    comparison: `Perbandingan pendekatan:\n- Page vs Slice\n  - Page: ada total count, nyaman untuk UI pagination klasik.\n  - Slice: lebih ringan karena tidak perlu total count penuh.\n\n- Offset vs cursor/keyset\n  - Offset: simpel, cocok dataset kecil-menengah.\n  - Cursor/keyset: performa lebih baik dan stabil pada dataset besar.\n\n- Sort by non-indexed column vs indexed column\n  - Non-indexed: berisiko lambat.\n  - Indexed: jauh lebih scalable.`,
  },
  {
    id: '12',
    title: 'Caching',
    category: 'RELIABILITY',
    section: 'reliability',
    tag: 'perf',
    shortDesc: 'Menyimpan salinan response agar tidak perlu hit database terus-menerus.',
    code: `Cache-Control: public, max-age=300\nETag: "v1-user-42-hash"\nIf-None-Match: "v1-user-42-hash"\nHTTP/1.1 304 Not Modified\n\n@Cacheable(cacheNames = "users", key = "#id")\npublic UserDto findById(Long id) { ... }`,
    detail: `Caching adalah salah satu cara paling efektif meningkatkan throughput dan latency. Tetapi cache yang salah desain bisa menjadi sumber bug subtil: stale data, cache stampede, invalidation race, dan memory blow-up.\n\nAda banyak lapisan cache: browser/client cache via HTTP headers, reverse proxy/CDN cache, application cache (misalnya Caffeine/Redis), dan ORM-level cache. Senior engineer harus paham bahwa tiap lapisan punya use case berbeda.\n\nPrinsip terkenalnya benar: there are only two hard things in computer science: cache invalidation and naming things. Dalam interview, pembicaraan sering bergeser ke TTL vs event-based invalidation, local vs distributed cache, dan read-through vs cache-aside.`,
    rule: 'Cache apa yang sering dibaca, jarang berubah, dan mahal dihitung. Jangan cache membabi buta.',
    springBoot: `Tools/Framework Java yang umum:\n- Spring Cache abstraction.\n- Caffeine untuk in-memory local cache.\n- Redis untuk distributed cache.\n- Hazelcast / Infinispan untuk clustered cache tertentu.\n- HTTP caching lewat ETag/Cache-Control di layer web/proxy.\n\nPraktik Spring Boot:\n- @Cacheable untuk read-heavy query.\n- @CacheEvict / @CachePut untuk invalidation/update.\n- Redis untuk multi-instance app.\n- Caffeine cocok untuk single instance atau hot local cache.`,
    comparison: `Perbandingan cache:\n- Caffeine vs Redis\n  - Caffeine: sangat cepat, local memory, simpel.\n  - Redis: shared across instances, bagus untuk distributed system, tapi ada network hop.\n\n- TTL invalidation vs explicit invalidation\n  - TTL: sederhana tapi bisa stale.\n  - Explicit invalidation: lebih akurat tapi logic lebih kompleks.\n\n- HTTP cache vs application cache\n  - HTTP cache: hemat bandwidth dan latency dari sisi klien/CDN.\n  - App cache: mengurangi load database/service internal.`,
  },
  {
    id: '13',
    title: 'Idempotency',
    category: 'RELIABILITY',
    section: 'reliability',
    tag: 'perf',
    shortDesc: 'Pengulangan request memberi efek sama seperti request pertama.',
    code: `POST /payments\nIdempotency-Key: 7d3a8a7c-4e0d-4b4b-9f21-123abc\n\n{\n  "orderId": "ORD-1001",\n  "amount": 500000\n}\n\n// Server stores key + request fingerprint + response snapshot`,
    detail: `Idempotency sangat penting untuk sistem finansial, order management, booking, dan semua operasi create/command yang tidak boleh dieksekusi ganda karena retry network. Tanpa idempotency, timeout kecil bisa berubah menjadi double charge atau duplicate order.\n\nUntuk POST, pola umum adalah client mengirim Idempotency-Key unik. Server menyimpan key itu bersama fingerprint request dan hasil response. Jika request identik datang lagi dengan key yang sama, server mengembalikan hasil yang sama, bukan mengeksekusi ulang.\n\nInterview senior biasanya mengejar detail implementasi: di mana menyimpan key, berapa lama TTL-nya, bagaimana kalau payload berbeda tapi key sama, dan bagaimana menjaga atomicity dengan transaksi database.`,
    rule: 'Untuk operasi kritis, idempotency bukan fitur bonus — itu pagar keselamatan.',
    springBoot: `Tools/Framework Java yang umum:\n- Spring MVC filter/interceptor untuk membaca Idempotency-Key.\n- Redis untuk penyimpanan cepat.\n- Database table dengan unique constraint untuk jaminan kuat.\n- Transaction management Spring + outbox pattern bila ada side effect lintas sistem.\n\nPraktik Spring Boot:\n- Validasi header Idempotency-Key.\n- Simpan hash request + status processing.\n- Tangani concurrent duplicate request dengan locking/unique constraint.\n- Kembalikan response lama jika request sama diulang.`,
    comparison: `Perbandingan implementasi:\n- Redis vs database\n  - Redis: cepat, cocok TTL-based dedup.\n  - Database: lebih kuat untuk konsistensi dan audit, tapi lebih berat.\n\n- Fingerprint request vs key only\n  - Key only: simpel, tapi bisa berbahaya jika client reuse key untuk payload beda.\n  - Fingerprint + key: lebih aman.\n\n- Natural idempotency vs explicit idempotency key\n  - PUT/DELETE sering natural idempotent.\n  - POST kritis hampir selalu perlu explicit key.`,
  },
  {
    id: '14',
    title: 'Webhooks',
    category: 'ARCHITECTURE',
    section: 'architecture',
    tag: 'arch',
    shortDesc: 'Server mendorong event ke klien secara real-time saat sesuatu terjadi.',
    code: `@PostMapping("/webhooks/payment")\npublic ResponseEntity<Void> receive(\n    @RequestHeader("X-Signature") String signature,\n    @RequestBody String rawBody\n) {\n    webhookVerifier.verify(rawBody, signature);\n    service.process(rawBody);\n    return ResponseEntity.ok().build();\n}`,
    detail: `Webhook adalah mekanisme push dari satu sistem ke sistem lain berbasis HTTP callback. Ini jauh lebih efisien daripada polling terus-menerus untuk mengecek perubahan status.\n\nTantangan webhook bukan pada membuat endpoint POST, melainkan pada reliability dan security: signature verification, retry tolerance, deduplication, ordering, idempotent consumer, dan observability. Provider webhook biasanya akan retry jika endpoint Anda lambat atau gagal.\n\nDalam interview senior, Anda sebaiknya menekankan bahwa webhook consumer harus cepat acknowledge, memverifikasi signature, menyimpan event mentah bila perlu, lalu memproses secara asynchronous agar tahan spike dan retry.`,
    rule: 'Terima cepat, verifikasi, persist jika perlu, lalu proses async. Jangan lakukan kerja berat langsung di request thread.',
    springBoot: `Tools/Framework Java yang umum:\n- Spring MVC untuk webhook endpoint.\n- Jackson untuk parsing payload.\n- HMAC/crypto library Java untuk signature verification.\n- Kafka/RabbitMQ untuk async downstream processing.\n- ShedLock / dedup store jika perlu anti-duplikasi.\n\nPraktik Spring Boot:\n- Baca raw body untuk signature verification.\n- Return 2xx cepat setelah basic validation/persistence.\n- Gunakan queue untuk proses berat.\n- Simpan event id provider untuk dedup.`,
    comparison: `Perbandingan pola integrasi:\n- Polling vs webhook\n  - Polling: lebih mudah dikontrol client, tapi boros.\n  - Webhook: real-time dan efisien, tapi lebih kompleks di reliability/security.\n\n- Sync processing vs async processing\n  - Sync: sederhana, tapi rentan timeout.\n  - Async: lebih tahan beban dan retry storm.\n\n- Signature verification vs IP allowlist only\n  - Signature: lebih kuat dan portable.\n  - IP allowlist: tambahan bagus, tapi jangan satu-satunya lapisan keamanan.`,
  },
  {
    id: '15',
    title: 'API Versioning',
    category: 'ARCHITECTURE',
    section: 'architecture',
    tag: 'arch',
    shortDesc: 'Cara mengelola perubahan API tanpa merusak klien lama.',
    code: `// URI versioning\n@RequestMapping("/api/v1/users")\nclass UserV1Controller { ... }\n\n@RequestMapping("/api/v2/users")\nclass UserV2Controller { ... }`,
    detail: `Versioning menjaga backward compatibility. Begitu API dipakai client lain, perubahan field, rename property, atau perubahan behavior bisa menjadi breaking change yang mahal.\n\nPendekatan paling umum dan pragmatis adalah version di URI path (/v1, /v2). Ada juga header-based versioning atau media type versioning, tetapi secara operasional lebih sulit dilihat dan diuji. Dalam banyak organisasi, kesederhanaan path versioning lebih menang.\n\nSenior interview biasanya menilai apakah Anda paham kapan benar-benar butuh versi baru, kapan perubahan masih backward compatible, dan bagaimana strategi deprecation/migration dilakukan.`,
    rule: 'Versi bukan alasan malas desain. Tetap usahakan contract stabil dan perubahan breaking seminimal mungkin.',
    springBoot: `Tools/Framework Java yang umum:\n- Spring MVC controller mapping dengan prefix /v1, /v2.\n- OpenAPI grouping per versi.\n- API gateway untuk routing versi berbeda.\n\nPraktik Spring Boot:\n- Pisahkan DTO per versi bila memang contract berbeda.\n- Hindari logic berantakan dengan banyak if(version).\n- Dokumentasikan deprecation timeline.\n- Gunakan automated contract tests untuk menjaga kompatibilitas.`,
    comparison: `Perbandingan strategi:\n- URI versioning\n  - Jelas, mudah diuji, mudah dipahami.\n  - URL jadi berubah saat versi baru.\n\n- Header/media type versioning\n  - Lebih “RESTful” secara teori.\n  - Lebih sulit di-debug, di-cache, dan dioperasikan.\n\n- No versioning\n  - Kelihatan simpel di awal.\n  - Biasanya menyulitkan saat API sudah dipakai luas.`,
  },
  {
    id: '16',
    title: 'OpenAPI',
    category: 'ARCHITECTURE',
    section: 'architecture',
    tag: 'arch',
    shortDesc: 'Format standar yang dapat dibaca mesin untuk mendeskripsikan API REST.',
    code: `openapi: 3.0.3\ninfo:\n  title: Payment API\n  version: 1.0.0\npaths:\n  /payments:\n    post:\n      summary: Create payment\n      responses:\n        '201':\n          description: Payment created`,
    detail: `OpenAPI adalah kontrak formal yang mendeskripsikan endpoint, request schema, response schema, auth, error, dan metadata API. Untuk tim yang matang, OpenAPI bukan sekadar dokumentasi, tetapi artefak engineering yang bisa dipakai untuk mock server, SDK generation, contract testing, governance, dan API review.\n\nPendekatan design-first sering disukai karena memaksa tim menyepakati contract sebelum coding. Code-first juga populer karena lebih cepat sinkron dengan implementasi. Senior engineer sebaiknya paham kapan masing-masing pendekatan cocok.\n\nDalam ekosistem Java, OpenAPI sangat membantu standardisasi lintas service dan memperjelas boundary antar tim backend, frontend, QA, dan partner integrasi.`,
    rule: 'Pastikan dokumentasi API dihasilkan dari sumber yang bisa dipercaya, bukan wiki manual yang cepat basi.',
    springBoot: `Tools/Framework Java yang umum:\n- springdoc-openapi untuk generate docs dari anotasi/controller Spring Boot.\n- Swagger UI untuk dokumentasi interaktif.\n- OpenAPI Generator untuk generate client/server stub.\n- Contract testing tools seperti Spring Cloud Contract / Pact sebagai pelengkap.\n\nPraktik Spring Boot:\n- Dokumentasikan schema request/response penting.\n- Tambahkan contoh payload dan error case.\n- Group API per domain/versi.\n- Sinkronkan security scheme di dokumentasi.`,
    comparison: `Perbandingan pendekatan:\n- Design-first vs code-first\n  - Design-first: bagus untuk alignment antar tim dan governance.\n  - Code-first: lebih cepat untuk tim kecil/iterasi cepat.\n\n- Swagger UI vs static docs\n  - Swagger UI: interaktif dan sangat membantu eksplorasi.\n  - Static docs: bisa lebih naratif, tapi rawan tidak sinkron.\n\n- OpenAPI vs ad-hoc docs\n  - OpenAPI: machine-readable, reusable.\n  - Ad-hoc docs: cepat ditulis, tapi sulit diotomasi.`,
  },
  {
    id: '17',
    title: 'REST vs GraphQL',
    category: 'ARCHITECTURE',
    section: 'architecture',
    tag: 'arch',
    shortDesc: 'Perbandingan dua paradigma utama pengambilan data.',
    code: `// REST\nGET /users/1\nGET /users/1/posts\n\n// GraphQL\nquery {\n  user(id: 1) {\n    name\n    email\n    posts(limit: 5) {\n      title\n    }\n  }\n}`,
    detail: `REST mengorganisasi sistem sebagai resource dan endpoint. GraphQL mengorganisasi sistem sebagai schema graph yang bisa di-query fleksibel oleh client. Keduanya valid; pilihan tergantung kebutuhan produk, tim, dan operasional.\n\nREST unggul pada kesederhanaan, kesesuaian dengan HTTP, cacheability alami, dan tooling luas. GraphQL unggul pada fleksibilitas data fetching untuk frontend kompleks, terutama bila banyak layar membutuhkan potongan field yang berbeda-beda.\n\nDi interview senior, jawaban matang bukan memilih salah satu secara dogmatis, tetapi menjelaskan trade-off: overfetching/underfetching, schema governance, query complexity, caching, observability, dan ownership model antar tim.`,
    rule: 'Pilih paradigma berdasarkan kebutuhan nyata, bukan tren.',
    springBoot: `Tools/Framework Java yang umum:\n- Spring MVC / Spring Web untuk REST.\n- Spring for GraphQL untuk GraphQL server.\n- DataLoader pattern untuk mencegah N+1 query di GraphQL.\n- Querydsl/jOOQ/JPA untuk data fetching sesuai kebutuhan.\n\nPraktik Java:\n- REST sering jadi default enterprise API.\n- GraphQL cocok untuk BFF atau frontend-heavy use case.\n- Batasi query depth/complexity pada GraphQL untuk keamanan/performa.`,
    comparison: `Perbandingan utama:\n- REST\n  - Mudah dipahami, mudah cache, observability sederhana.\n  - Bisa overfetch/underfetch pada UI kompleks.\n\n- GraphQL\n  - Client bisa minta field tepat yang dibutuhkan.\n  - Caching, auth, rate limiting, dan query complexity lebih rumit.\n\n- REST + BFF\n  - Sering jadi kompromi bagus: backend tetap REST, lalu BFF mengagregasi sesuai kebutuhan frontend.`,
  },
  {
    id: '18',
    title: 'API Gateway',
    category: 'ARCHITECTURE',
    section: 'architecture',
    tag: 'arch',
    shortDesc: 'Gerbang pusat untuk routing, security, dan observability di depan layanan backend.',
    code: `Client -> API Gateway -> auth-service\n                     -> order-service\n                     -> catalog-service\n\n// Gateway concerns:\n// - auth\n// - routing\n// - rate limiting\n// - logging\n// - TLS termination`,
    detail: `API Gateway adalah edge component yang menerima request dari client lalu merutekannya ke service internal yang tepat. Ia juga tempat ideal untuk concern lintas layanan: authentication, TLS termination, rate limiting, request logging, correlation id, dan kadang response transformation.\n\nNamun gateway bukan tempat business logic domain yang kompleks. Jika gateway terlalu pintar, ia menjadi bottleneck dan single point of pain. Prinsip yang baik: gateway menangani cross-cutting concerns, sedangkan domain logic tetap hidup di service masing-masing.\n\nDalam interview senior, sering dibahas perbedaan gateway dengan load balancer, reverse proxy, service mesh ingress, dan backend-for-frontend.`,
    rule: 'Biarkan gateway mengurus cross-cutting concerns, bukan aturan bisnis inti.',
    springBoot: `Tools/Framework Java yang umum:\n- Spring Cloud Gateway.\n- Netflix Zuul (legacy, makin jarang untuk proyek baru).\n- NGINX / Kong / Apigee / Envoy sebagai alternatif edge/gateway non-Java.\n- Resilience4j untuk retry/circuit-breaker di integration layer tertentu.\n\nPraktik umum:\n- Routing + auth + observability di gateway.\n- Propagasi trace id ke downstream.\n- Global rate limiting di edge.\n- Minimalkan custom business logic di gateway.`,
    comparison: `Perbandingan teknologi:\n- Spring Cloud Gateway vs NGINX/Kong\n  - Spring Cloud Gateway: fleksibel untuk ekosistem Java/Spring.\n  - NGINX/Kong: sangat populer, performa tinggi, operasional matang.\n\n- Gateway vs service mesh\n  - Gateway: entry point dari luar ke sistem.\n  - Service mesh: lebih fokus komunikasi east-west antar service internal.\n\n- Gateway vs BFF\n  - Gateway: concern generik lintas client.\n  - BFF: disesuaikan kebutuhan satu tipe frontend tertentu.`,
  },
  {
    id: '19',
    title: 'Microservices',
    category: 'ARCHITECTURE',
    section: 'architecture',
    tag: 'arch',
    shortDesc: 'Memecah aplikasi besar menjadi layanan kecil yang independen.',
    code: `user-service     -> Java Spring Boot\norder-service    -> Java Spring Boot\npayment-service  -> Java Spring Boot\nnotification-svc -> Java/Kotlin\n\n// each service owns its data + deploys independently`,
    detail: `Microservices memecah sistem menjadi bounded context kecil yang dapat dikembangkan, di-deploy, dan di-scale secara independen. Keuntungan utamanya muncul ketika domain sudah besar, tim sudah banyak, dan monolith mulai memperlambat delivery.\n\nNamun microservices menukar kompleksitas coding lokal dengan kompleksitas sistem terdistribusi: network failure, distributed tracing, eventual consistency, schema evolution, service discovery, deployment orchestration, dan observability yang jauh lebih menuntut.\n\nJawaban senior yang matang biasanya tidak mengglorifikasi microservices. Mulai dari modular monolith sering lebih bijak. Pecah ke microservices ketika ada alasan organisasi dan teknis yang nyata.`,
    rule: 'Jangan memilih microservices untuk terlihat canggih. Pilih jika kompleksitas bisnis dan organisasi memang membutuhkannya.',
    springBoot: `Tools/Framework Java yang umum:\n- Spring Boot sebagai basis service.\n- Spring Cloud ecosystem (config, discovery, gateway) bila memang diperlukan.\n- Kafka/RabbitMQ untuk komunikasi async.\n- OpenFeign / WebClient / RestClient untuk komunikasi sync.\n- Micrometer + OpenTelemetry + Prometheus/Grafana untuk observability.\n- Testcontainers untuk integration test yang realistis.\n\nPraktik Java yang baik:\n- Satu service memiliki data store sendiri.\n- Gunakan async event untuk loose coupling bila cocok.\n- Terapkan circuit breaker/timeout/retry secara disiplin.\n- Jangan berbagi entity/database antar service.`,
    comparison: `Perbandingan arsitektur:\n- Monolith vs microservices\n  - Monolith: sederhana, cepat dikembangkan awal, mudah debug lokal.\n  - Microservices: skalabilitas organisasi dan deployment lebih baik, tapi operasional jauh lebih kompleks.\n\n- Modular monolith vs microservices\n  - Modular monolith: sering jadi langkah tengah terbaik.\n  - Microservices: cocok saat boundary dan ownership tim sudah jelas.\n\n- Sync HTTP vs async messaging antar service\n  - Sync: sederhana tapi coupling lebih ketat.\n  - Async: lebih resilient dan decoupled, tapi lebih kompleks dalam consistency/debugging.`,
  },
  {
    id: '20',
    title: 'Error Handling',
    category: 'ARCHITECTURE',
    section: 'architecture',
    tag: 'dx',
    shortDesc: 'Standarisasi pelaporan error agar mudah diproses oleh developer dan kode klien.',
    code: `@RestControllerAdvice\nclass GlobalExceptionHandler {\n\n  @ExceptionHandler(MethodArgumentNotValidException.class)\n  ResponseEntity<ProblemDetail> handleValidation(...) { ... }\n\n  @ExceptionHandler(ResourceNotFoundException.class)\n  ResponseEntity<ProblemDetail> handleNotFound(...) { ... }\n}\n\n// RFC 7807 style\n{\n  "type": "https://api.example.com/errors/validation-error",\n  "title": "Validation failed",\n  "status": 400,\n  "detail": "Request body is invalid"\n}`,
    detail: `Error handling yang baik adalah salah satu penanda kematangan API. Client tidak butuh stack trace mentah; mereka butuh struktur error yang konsisten, bisa diparse mesin, tapi tetap cukup informatif untuk developer.\n\nError contract idealnya memuat status, kode/error type, human-readable detail, dan informasi field-level validation jika relevan. Di sistem besar, correlation/request id juga penting agar client bisa memberi referensi ke tim support/ops.\n\nDalam interview senior Java, topik yang sering muncul: exception translation, global exception handling, domain error vs technical error, RFC 7807 Problem Details, dan cara menjaga agar informasi sensitif tidak bocor ke production response.`,
    rule: 'Error response harus konsisten, bisa diproses program, dan aman untuk dipublikasikan ke client.',
    springBoot: `Tools/Framework Java yang umum:\n- @RestControllerAdvice / @ExceptionHandler.\n- ProblemDetail (Spring Boot 3 / Spring 6).\n- Bean Validation error mapping.\n- Structured logging + correlation id.\n- Sentry / ELK / Grafana Loki untuk observability error.\n\nPraktik Spring Boot:\n- Map exception domain ke status code yang tepat.\n- Validasi error dikembalikan dalam format konsisten.\n- Jangan expose stack trace/internal class names ke client.\n- Catat detail teknis di log, bukan di response publik.`,
    comparison: `Perbandingan pendekatan:\n- Generic error string vs structured error object\n  - Generic string: cepat tapi miskin informasi.\n  - Structured object: jauh lebih baik untuk client automation dan DX.\n\n- Local try-catch di controller vs global exception handler\n  - Local try-catch: berantakan dan tidak konsisten.\n  - Global handler: lebih bersih, konsisten, mudah dirawat.\n\n- Custom error format vs RFC 7807\n  - Custom: fleksibel, tapi bisa liar/tidak konsisten.\n  - RFC 7807: standar bagus, mudah dipahami lintas tim.`,
  },
];

const topicSpecificGuidance = {
  '01': {
    bestPractices: `Best practices untuk Endpoint:
- Desain path berbasis resource, misalnya /users/{id}/orders, bukan /getUserOrders, agar HTTP method tetap membawa arti.
- Simpan boundary controller tetap tipis; mapping request, validation, dan response shaping boleh di sini, tapi orchestration bisnis pindah ke service.
- Buat endpoint stabil untuk konsumsi frontend: hindari rename field/path tanpa versioning atau migration plan.
- Gunakan DTO berbeda untuk list vs detail bila kebutuhan payload memang berbeda; jangan kirim object gemuk ke semua screen.
- Untuk nested resource, pastikan relasi parent-child benar-benar kuat. Jika order sering dicari lintas user, /orders?userId=42 biasanya lebih fleksibel daripada memaksa nesting.`,
    pitfalls: `Pitfalls / red flags pada Endpoint:
- Endpoint bercampur antara resource dan verb, misalnya /createUser, /updateUserStatus, /deleteUser, yang biasanya menandakan desain API belum rapi.
- Controller langsung expose entity JPA sehingga field internal, lazy relation, atau kolom sensitif ikut bocor ke client.
- Path tidak konsisten antar tim: ada /user, /users, /user-list, /get-users sekaligus. Ini kecil di awal, kacau di skala besar.
- Satu endpoint dijadikan “serba bisa” dengan parameter boolean yang mengubah behavior secara drastis. Itu sulit dites dan sulit dipahami frontend.
- Tidak memikirkan evolusi endpoint; path hari ini bagus untuk demo, tapi buntu saat butuh versioning atau agregasi nanti.`,
  },
  '02': {
    bestPractices: `Best practices untuk HTTP Methods:
- Jagakan semantik method tetap jujur: GET hanya baca, POST untuk create/command non-idempotent, PUT replace penuh, PATCH untuk partial update yang jelas.
- Saat mendesain retry policy, selalu pasangkan dengan sifat method. Contohnya, retry GET aman; retry POST pembayaran perlu idempotency key.
- Gunakan PUT bila memang client mengirim representasi final resource, misalnya settings profile lengkap. Gunakan PATCH bila update parsial dan null/absent field perlu dibedakan.
- Jika ada action bisnis yang bukan CRUD murni, buat command endpoint yang eksplisit seperti POST /payments/{id}/capture, bukan memaksa lewat PATCH status seenaknya.
- Dokumentasikan contract method di OpenAPI agar frontend tahu mana operation yang aman di-refetch dan mana yang harus ekstra hati-hati.`,
    pitfalls: `Pitfalls / red flags pada HTTP Methods:
- GET dipakai untuk mutasi seperti /orders/123/cancel karena “lebih gampang dites di browser”. Ini merusak cache, proxy behavior, dan ekspektasi dasar HTTP.
- PUT dipakai padahal payload hanya patch sebagian field, sehingga perilakunya ambigu: field lain dihapus atau dipertahankan?
- Semua action ditumpuk ke POST tanpa alasan, sampai client tidak bisa membedakan create, update, dan command.
- DELETE dianggap selalu aman padahal masih punya side effect besar seperti revoke license, trigger billing reversal, atau cascade delete yang tidak dijelaskan.
- Tim bicara CRUD, tapi tidak pernah membahas idempotency, cacheability, atau safety. Untuk level senior, itu biasanya kelihatan dangkal.`,
  },
  '03': {
    bestPractices: `Best practices untuk Request-Response:
- Pisahkan concern dengan disiplin: auth/correlation/meta di header, resource identity di path/query, domain data di body.
- Standarkan header penting seperti X-Request-Id, Authorization, dan content type supaya tracing lintas service lebih mudah.
- Buat response shape konsisten. Jika list endpoint selalu punya items, pageInfo, dan links misalnya, frontend akan jauh lebih mudah mengonsumsi.
- Kembalikan header yang bermakna: Location untuk create, ETag untuk caching, Retry-After untuk throttling, bukan hanya body JSON.
- Untuk operation lambat, pertimbangkan 202 Accepted + polling/webhook daripada menahan koneksi sampai timeout.`,
    pitfalls: `Pitfalls / red flags pada Request-Response:
- Semua metadata ditaruh di body, termasuk error code atau trace id, sehingga layer HTTP tidak dimanfaatkan dengan baik.
- Request body terlalu fleksibel tanpa schema jelas; backend “mencoba menebak” field apa yang dikirim client.
- Response antar endpoint tidak konsisten: satu pakai data, satu pakai result, satu langsung array mentah. Frontend jadi penuh adapter kecil.
- Tidak ada correlation id atau request id, sehingga incident sulit ditelusuri dari report user ke log backend.
- Endpoint sync dipakai untuk proses lama seperti export/report generation sampai user mengalami timeout dan retry ganda.`,
  },
  '04': {
    bestPractices: `Best practices untuk Status Codes:
- Map status code ke outcome nyata sistem. 201 untuk resource baru, 202 untuk accepted async job, 204 saat sukses tanpa body, 409 untuk conflict state yang nyata.
- Pasangkan status code dengan payload error yang konsisten agar client bisa mengambil keputusan otomatis.
- Bedakan auth failure dengan jelas: 401 saat token tidak valid/absen, 403 saat user valid tapi tak berhak.
- Gunakan 429 saat membatasi traffic, lengkap dengan Retry-After, agar client bisa backoff dengan benar.
- Saat dependency utama bermasalah, pertimbangkan 503 untuk memberi sinyal bahwa masalah ada di availability, bukan kesalahan input client.`,
    pitfalls: `Pitfalls / red flags pada Status Codes:
- Semua error dibungkus dalam 200 dengan { success: false }. Itu mematahkan monitoring, retry, dan behavior SDK/client.
- 500 dipakai untuk semua kasus, termasuk validasi user salah atau resource tidak ditemukan. Ini tanda error mapping belum matang.
- 404 dikembalikan untuk authorization failure demi “menyembunyikan” resource, padahal policy itu tidak dijelaskan dan diterapkan tidak konsisten.
- 422, 400, dan 409 dipakai secara acak tanpa definisi internal tim. Frontend akhirnya menebak-nebak.
- Tidak ada pembeda antara temporary failure dan permanent failure, sehingga client tidak tahu kapan boleh retry.`,
  },
  '05': {
    bestPractices: `Best practices untuk Authentication:
- Letakkan autentikasi di edge/filter chain, bukan di tiap controller, agar kebijakan konsisten dan sulit terlewat.
- Pilih mekanisme sesuai konteks: JWT/OAuth2 untuk user-facing API modern, API key untuk integrasi server sederhana, mTLS untuk jalur internal yang sensitif.
- Validasi issuer, audience, expiry, dan signature token secara eksplisit. “Bisa decode JWT” bukan berarti autentikasi aman.
- Terapkan secret rotation dan pisahkan credential per environment/integration supaya blast radius kebocoran kecil.
- Mask token dan credential di log; audit butuh identitas principal, bukan isi token mentah.`,
    pitfalls: `Pitfalls / red flags pada Authentication:
- Mengirim API key atau token lewat query string sehingga mudah bocor ke log, browser history, atau analytics.
- Menganggap JWT otomatis aman tanpa memeriksa signature, issuer, atau clock skew.
- Satu shared credential dipakai banyak partner/service sehingga audit dan revocation jadi mimpi buruk.
- Menyimpan secret plaintext di application.yml atau repo alih-alih lewat secret manager/env yang aman.
- Controller masih melakukan “if token == ...” manual di business code. Itu tanda boundary security berantakan.`,
  },
  '06': {
    bestPractices: `Best practices untuk Authorization:
- Mulai dari coarse-grained rule di gateway/security layer, lalu turunkan ke resource-level check di service/domain untuk rule ownership atau tenant.
- Modelkan permission sesuai bahasa bisnis: approve-refund, manage-team, read-billing, bukan hanya ADMIN/USER.
- Untuk multi-tenant app, pastikan tenant context ikut diverifikasi di setiap akses data, bukan hanya di login awal.
- Simpan keputusan access control yang penting di audit log, terutama untuk operasi sensitif seperti approval dan delete.
- Jaga rule tetap dapat dites: method security + service-level tests biasanya lebih sehat daripada rule acak di controller dan repository.`,
    pitfalls: `Pitfalls / red flags pada Authorization:
- Semua izin disederhanakan menjadi role ADMIN, lalu akun admin dipakai untuk “mempermudah” operasi sehari-hari.
- Hanya mengecek UI permission, sementara API backend tetap bisa diakses langsung oleh user yang tak berhak.
- Ownership check dilakukan setelah data sensitif sudah di-load penuh dan sempat terlog.
- Rule access tersebar di controller, frontend, dan SQL filter secara tak sinkron sehingga mudah muncul privilege bug.
- Tidak ada strategi ketika kebutuhan berkembang dari RBAC sederhana ke tenant-, region-, atau amount-based rule.`,
  },
  '07': {
    bestPractices: `Best practices untuk Access Tokens:
- Buat access token pendek umur hidupnya dan pakai refresh token/reauth flow untuk sesi lebih panjang.
- Simpan claims seperlunya saja: subject, scope, tenant, dan metadata minimum untuk authorization.
- Validasi token dekat dengan resource server dan propagasikan principal yang sudah tervalidasi, bukan token mentah, ke layer lain.
- Jika revoke cepat penting, pertimbangkan opaque token + introspection atau strategy revocation list yang realistis.
- Pasangkan token dengan audience yang spesifik agar token untuk satu API tidak bebas dipakai ke semua service.`,
    pitfalls: `Pitfalls / red flags pada Access Tokens:
- Token diisi terlalu banyak data profil/sensitif sampai ukurannya besar dan riskan bocor.
- Expiry terlalu panjang demi “nyaman”, lalu kebocoran token jadi insiden besar.
- Frontend menyimpan token di tempat yang terlalu mudah diakses script tanpa mitigasi XSS yang memadai.
- Backend hanya decode base64 payload JWT lalu percaya isinya tanpa verifikasi kriptografi.
- Scope/role di token tidak pernah direview, sehingga privilege creep terjadi diam-diam.`,
  },
  '08': {
    bestPractices: `Best practices untuk OAuth 2.0:
- Pilih flow berdasarkan tipe client: Authorization Code + PKCE untuk SPA/mobile, Client Credentials untuk service-to-service, Device Code untuk device terbatas.
- Bedakan jelas peran authorization server, resource server, dan client agar troubleshooting lebih mudah.
- Desain scope secukupnya; scope yang terlalu kasar seperti full_access biasanya menghilangkan manfaat delegasi.
- Tambahkan OIDC jika Anda butuh identitas user standar, bukan sekadar delegated access token.
- Saat interview, contohkan flow konkret: user login via auth server, app tukar code, backend validasi bearer token, lalu cek scope/resource ownership.`,
    pitfalls: `Pitfalls / red flags pada OAuth 2.0:
- Menyebut OAuth sebagai “cara login” tanpa membedakannya dari OIDC.
- Memilih implicit flow untuk aplikasi modern padahal Authorization Code + PKCE lebih tepat.
- Scope terlalu luas atau tak konsisten antar API sehingga delegated access sulit dipahami.
- Resource server bergantung pada asumsi token valid karena “datang dari gateway” tanpa validasi mandiri yang memadai.
- Tidak membahas expiry, refresh, consent, atau revocation sama sekali.`,
  },
  '09': {
    bestPractices: `Best practices untuk Rate Limiting:
- Terapkan limit berdasarkan identitas yang masuk akal: API key, user, tenant, atau IP, sesuai model abuse sistem.
- Kembalikan 429 dengan header limit dan Retry-After agar client bisa membangun backoff yang benar.
- Pisahkan policy per endpoint/kelas traffic; login, search, dan admin export jarang butuh limit yang sama.
- Letakkan global protection di gateway/edge, lalu tambahkan local guard untuk endpoint yang sangat mahal bila perlu.
- Pantau reject rate dan false positive; rate limit yang terlalu agresif bisa merusak UX partner/client sehat.`,
    pitfalls: `Pitfalls / red flags pada Rate Limiting:
- Hanya rate limit per IP pada sistem mobile/corporate NAT, lalu banyak user sah ikut terblokir.
- Tidak ada header atau error body yang menjelaskan kapan client boleh mencoba lagi.
- Limit diterapkan sama rata ke semua endpoint, termasuk health check dan callback internal.
- State limit lokal per instance dipakai pada cluster besar tanpa store bersama, sehingga enforcement tidak konsisten.
- Rate limiting dianggap selesai setelah menolak request, padahal product fairness dan abuse pattern tidak pernah dievaluasi.`,
  },
  '10': {
    bestPractices: `Best practices untuk Throttling:
- Gunakan bounded concurrency: thread pool, worker limit, queue size, atau bulkhead agar lonjakan traffic tidak merobohkan semua dependency.
- Pisahkan workload cepat dan mahal ke jalur berbeda; report generation jangan berebut thread dengan endpoint checkout.
- Untuk kerja berat, terima request cepat lalu teruskan ke queue/async worker sehingga API tetap responsif.
- Tetapkan backpressure atau rejection policy yang eksplisit; lebih baik menolak sebagian request daripada collapse total.
- Pantau queue depth, worker saturation, dan downstream latency untuk tahu kapan throttling mulai bekerja terlalu keras.`,
    pitfalls: `Pitfalls / red flags pada Throttling:
- Mengandalkan autoscaling saja tanpa membatasi concurrency lokal; scale out tidak selalu cukup cepat saat spike tajam.
- Satu thread pool dipakai untuk semua jenis kerja, sehingga satu workload berat melumpuhkan endpoint lain.
- Queue dianggap solusi ajaib padahal tidak ada batas, retry policy, atau DLQ. Akhirnya backlog diam-diam menumpuk.
- Men-throttle inbound request tapi membiarkan outbound call ke dependency tetap meledak tanpa bulkhead/timeout.
- Tidak memberi sinyal ke client apakah request ditolak, ditunda, atau masih diproses.`,
  },
  '11': {
    bestPractices: `Best practices untuk Pagination:
- Tetapkan default size dan max size yang ketat; jangan beri client kebebasan meminta 10.000 row “karena butuh export cepat”.
- Pilih offset pagination untuk admin CRUD sederhana, dan cursor/keyset untuk feed besar atau data yang terus berubah.
- Pastikan sort order stabil dan didukung index. Cursor tanpa sort deterministik akan menimbulkan duplikasi atau item loncat.
- Pisahkan kebutuhan UI biasa dan export besar; export sebaiknya job async, bukan pagination limit yang dibesarkan terus.
- Dokumentasikan apakah total count tersedia, karena count mahal di dataset besar bisa mengubah desain endpoint.`,
    pitfalls: `Pitfalls / red flags pada Pagination:
- Endpoint list tanpa limit default, lalu secara tak sengaja menarik jutaan row ke memory.
- Mengurutkan berdasarkan kolom non-indexed pada tabel besar sehingga page 1 tampak normal, page 500 mulai membunuh DB.
- Cursor dibangun dari offset tersembunyi, bukan dari keyset nyata, jadi performanya tetap buruk.
- Sort order bisa berubah antar request karena tie-breaker tidak jelas. Infinite scroll jadi lompat-lompat.
- UI membutuhkan total pages, tapi backend memakai strategi yang tak bisa memberikannya dan itu tidak dikomunikasikan.`,
  },
  '12': {
    bestPractices: `Best practices untuk Caching:
- Mulai dari hotspot yang jelas: data mahal dihitung, sering dibaca, dan toleran terhadap sedikit staleness.
- Tentukan ownership invalidation dari awal. Jika product detail berubah, siapa yang evict key terkait, kapan, dan bagaimana fallback saat gagal?
- Gunakan HTTP caching untuk response publik/stabil, dan app/distributed cache untuk data internal yang sering diakses.
- Lindungi dari cache stampede dengan request coalescing, soft TTL, lock ringan, atau preload untuk key populer.
- Ukur hit rate, eviction, dan stale impact; cache tanpa observability hanya menutupi masalah sampai hari buruk datang.`,
    pitfalls: `Pitfalls / red flags pada Caching:
- Menambahkan Redis “biar cepat” tanpa tahu key design, TTL, atau invalidation path.
- Meng-cache data personal/sensitif tanpa mempertimbangkan key scoping per user/tenant.
- Cache lokal dipakai di banyak instance lalu tim heran kenapa data tidak konsisten.
- TTL terlalu panjang sehingga bisnis melihat data basi, atau terlalu pendek sehingga manfaat cache nyaris tidak ada.
- Tidak ada strategi saat cache down; aplikasi mendadak menyerbu DB dan menimbulkan thundering herd.`,
  },
  '13': {
    bestPractices: `Best practices untuk Idempotency:
- Wajibkan idempotency key pada operasi create yang berdampak finansial atau punya side effect mahal, seperti payment, booking, atau shipment creation.
- Simpan fingerprint request bersama key agar reuse key dengan payload berbeda bisa ditolak secara aman.
- Tangani race condition dengan unique constraint atau locking yang jelas; dua request identik bisa datang hampir bersamaan.
- Kembalikan response yang sama untuk retry identik agar client tidak perlu menebak status akhir.
- Tentukan TTL penyimpanan key sesuai karakter bisnis: pembayaran mungkin perlu lebih lama daripada submit form biasa.`,
    pitfalls: `Pitfalls / red flags pada Idempotency:
- Mengandalkan frontend untuk “tidak klik dua kali” sebagai satu-satunya proteksi duplicate charge/order.
- Retry POST dipasang di client/gateway tanpa backend idempotent.
- Key sama diterima untuk payload berbeda dan backend tetap memprosesnya. Itu membuka bug dan potensi abuse.
- Status processing tidak jelas; request kedua datang saat request pertama belum selesai dan sistem menghasilkan dua side effect.
- Mengira PUT/DELETE selalu cukup, padahal banyak workflow bisnis kritis tetap terjadi lewat POST command.`,
  },
  '14': {
    bestPractices: `Best practices untuk Webhooks:
- Verifikasi signature terhadap raw body sebelum parsing payload lebih jauh. Banyak bug webhook berasal dari body yang sudah termodifikasi middleware.
- Acknowledge cepat dengan 2xx setelah verifikasi dasar/persist minimal, lalu proses berat di async worker.
- Gunakan event id provider untuk dedup, karena retry webhook itu normal, bukan edge case.
- Simpan payload mentah dan metadata penting untuk audit/debugging, terutama pada pembayaran dan settlement.
- Rancang consumer idempotent dan tahan out-of-order delivery; provider tidak selalu menjamin urutan sempurna.`,
    pitfalls: `Pitfalls / red flags pada Webhooks:
- Endpoint webhook memproses semua logic sinkron dan menahan provider sampai timeout.
- Hanya mengandalkan IP allowlist tanpa signature verification. Bagus sebagai lapisan tambahan, buruk sebagai satu-satunya kontrol.
- Tidak ada dedup, jadi retry provider memicu order update atau email berkali-kali.
- Payload langsung dipercaya tanpa cek event type/version/provider account yang benar.
- Tidak ada replay/debug trail ketika user bertanya kenapa status payment berubah.`,
  },
  '15': {
    bestPractices: `Best practices untuk API Versioning:
- Anggap breaking change sebagai biaya mahal; usahakan additive change dulu sebelum membuat versi baru.
- Saat perlu versi baru, pisahkan contract dan migration path dengan jelas, misalnya /v1 tetap hidup sementara /v2 diperkenalkan dengan deprecation window.
- Ukur pemakaian client per versi supaya keputusan sunset berbasis data, bukan tebakan.
- Versioning bukan cuma path; pikirkan juga schema event, SDK, docs, dan test coverage lintas versi.
- Minimalkan logic if(version) bercampur di satu controller/service; lebih baik boundary per versi jelas.`,
    pitfalls: `Pitfalls / red flags pada API Versioning:
- Membuat versi baru untuk tiap perubahan kecil karena contract awal berantakan. Itu menandakan desain belum disiplin.
- Tidak ada deprecation timeline, changelog, atau observability terhadap client lama.
- Mengubah behavior v1 diam-diam sambil mengklaim “tidak breaking”.
- V1 dan V2 berbagi DTO/entity mentah yang sama sehingga perubahan internal mudah bocor ke kedua versi.
- Versioning dibahas hanya di URL, tanpa membahas compatibility test dan rencana migrasi consumer.`,
  },
  '16': {
    bestPractices: `Best practices untuk OpenAPI:
- Perlakukan spesifikasi sebagai contract engineering, bukan dokumen marketing. Jika docs dan implementasi beda, kepercayaan tim runtuh.
- Sertakan contoh request/response dan error case nyata, terutama untuk auth, pagination, dan validation failure.
- Gunakan schema yang cukup ketat: required fields, enum, format, nullable behavior, bukan deskripsi longgar saja.
- Integrasikan spec ke pipeline: linting, SDK generation, mock server, atau contract review sebelum release.
- Untuk tim frontend/backend, jadikan OpenAPI bahan diskusi desain supaya perubahan field tidak mengejutkan di akhir sprint.`,
    pitfalls: `Pitfalls / red flags pada OpenAPI:
- Swagger UI ada, tapi banyak schema kosong/generic object dan tidak benar-benar membantu consumer.
- Documentation hanya meng-cover happy path; error, rate limit, dan auth edge case tidak dijelaskan.
- Spec dihasilkan otomatis dari kode tapi tidak pernah direview, jadi kualitas contract tetap buruk.
- Field optional vs required tidak jelas, membuat frontend harus trial and error.
- Tim menganggap OpenAPI cukup untuk semua hal, padahal narasi business flow dan examples tetap perlu di luar schema.`,
  },
  '17': {
    bestPractices: `Best practices untuk REST vs GraphQL:
- Mulai dari kebutuhan client dan operasional. REST biasanya default aman; GraphQL masuk akal jika banyak layar butuh komposisi data berbeda dan tim siap mengelola kompleksitasnya.
- Jika memakai GraphQL, terapkan query depth/complexity limit, persisted query bila perlu, dan DataLoader untuk menghindari N+1.
- Jika tetap di REST tapi kebutuhan UI kompleks, pertimbangkan BFF/agregation layer daripada memaksa frontend memanggil 8 endpoint berantai.
- Evaluasi caching, observability, dan auth model sejak awal; perbedaan utama dua pendekatan ini sering muncul di area operasional, bukan sekadar syntax query.
- Saat interview, jawaban matang biasanya membandingkan trade-off, bukan mengangkat salah satu sebagai “lebih modern”.`,
    pitfalls: `Pitfalls / red flags pada REST vs GraphQL:
- Memilih GraphQL hanya untuk mengikuti tren tanpa kesiapan schema governance dan ops.
- Menganggap GraphQL otomatis menyelesaikan overfetching, padahal backend resolver bisa tetap lambat dan boros.
- REST API sangat granular dan chatty, tetapi tim menolak BFF/agregasi padahal itu akar masalah nyata frontend.
- Tidak ada pembatas query di GraphQL sehingga satu client bisa membuat query mahal sekali.
- Membandingkan REST vs GraphQL hanya di level “jumlah endpoint”, tanpa membahas caching, auth, dan debugging.`,
  },
  '18': {
    bestPractices: `Best practices untuk API Gateway:
- Letakkan concern lintas layanan di gateway: auth awal, rate limiting global, TLS termination, routing, request correlation, dan observability dasar.
- Jaga gateway tetap tipis dari sisi domain. Business rule approval, pricing, atau eligibility biasanya tidak boleh tinggal di sini.
- Propagasikan trace/request id ke downstream sejak gateway agar incident lintas service lebih mudah diikuti.
- Gunakan gateway untuk policy yang konsisten antar client, sementara kebutuhan khusus UI tertentu lebih cocok di BFF.
- Uji failure behavior gateway: timeout ke downstream, retry policy, header forwarding, dan fallback jangan dibiarkan asumtif.`,
    pitfalls: `Pitfalls / red flags pada API Gateway:
- Gateway berubah menjadi “super service” yang berisi business logic, transformasi berat, dan branching per product line.
- Retry atau timeout di gateway dikonfigurasi tanpa memahami idempotency downstream, sehingga incident malah membesar.
- Header auth/tenant/trace tidak diteruskan atau malah tertimpa secara diam-diam.
- Semua problem performa downstream disembunyikan di gateway, jadi root cause sulit terlihat.
- Tim tidak bisa membedakan peran gateway, reverse proxy, load balancer, dan BFF.`,
  },
  '19': {
    bestPractices: `Best practices untuk Microservices:
- Pecah service berdasarkan bounded context dan ownership tim, bukan berdasarkan layer teknis seperti user-service, util-service, common-service sembarangan.
- Mulai dari modular monolith jika domain masih berkembang; pecah setelah batas service terlihat stabil dan ada kebutuhan deployment/scale yang nyata.
- Pastikan tiap service punya data ownership jelas. Shared database biasanya menunda rasa sakit, bukan menghilangkannya.
- Invest di observability, contract testing, dan platform automation sebelum memecah terlalu banyak service.
- Gunakan komunikasi async untuk decoupling bila cocok, tapi tetap sadar bahwa eventual consistency perlu desain status dan reconciliation.`,
    pitfalls: `Pitfalls / red flags pada Microservices:
- Memecah layanan terlalu dini saat tim kecil, domain belum jelas, dan pipeline observability masih minim.
- Banyak service kecil tapi semuanya tergantung synchronous chain panjang; satu service lambat, seluruh request ambruk.
- Shared database dan shared entity lintas service membuat “microservices” hanya nama, coupling-nya tetap monolith.
- Terlalu banyak common library/domain shared package sehingga perubahan kecil memicu ripple ke semua service.
- Tidak ada jawaban untuk tracing, schema evolution, local development, dan incident response.`,
  },
  '20': {
    bestPractices: `Best practices untuk Error Handling:
- Definisikan error schema konsisten lintas service, misalnya Problem Details + field code + requestId bila relevan.
- Pisahkan validation error, domain/business conflict, dan technical failure agar client tahu tindakan selanjutnya.
- Simpan detail sensitif di log/trace internal, sementara response publik tetap aman dan cukup informatif.
- Gunakan error code yang stabil untuk client automation; pesan manusia boleh diperbaiki, code jangan sering berubah.
- Tambahkan correlation id ke response atau error payload supaya support dan engineering bisa menelusuri kasus nyata dengan cepat.`,
    pitfalls: `Pitfalls / red flags pada Error Handling:
- Stack trace, nama tabel, atau exception class internal bocor langsung ke response production.
- Semua error jadi pesan generic “something went wrong” tanpa code atau konteks, sehingga frontend sulit bertindak.
- Try-catch ditebar di setiap controller dan menghasilkan format error berbeda-beda.
- Domain conflict seperti duplicate email diperlakukan sama dengan outage database.
- Logging error tidak terstruktur atau tanpa request id, jadi reproduksi incident sangat lambat.`,
  },
  '21': {
    bestPractices: `Best practices untuk Backend Senior Best Practices:
- Tunjukkan boundary yang jelas: controller untuk HTTP, service untuk orchestration/use case, repository/integration untuk akses data dan dependency.
- Saat membahas reliability, selalu kaitkan timeout, retry, circuit breaker, idempotency, dan transaction boundary ke skenario konkret produksi.
- Gunakan observability sebagai bagian desain, bukan bonus akhir: metric p95, tracing, request id, structured log, dan alert yang relevan.
- Jelaskan bagaimana Anda menguji hal penting: unit test untuk domain logic, integration test untuk persistence/API, contract test untuk dependency eksternal.
- Bawa diskusi ke operability: rollback, feature flag, migration plan, dan bagaimana incident dibedah setelah release.`,
    pitfalls: `Pitfalls / red flags untuk Backend Senior Best Practices:
- Jawaban hanya daftar framework tanpa alasan desain atau trade-off.
- Menganggap layered architecture selesai di diagram, padahal business logic masih bocor ke controller atau entity.
- Membahas retry/fallback seolah selalu baik tanpa menyinggung duplicate side effect atau data inconsistency.
- Tidak bisa menjelaskan bagaimana sistem dipantau dan di-debug saat production issue terjadi.
- Terlalu fokus ke clean code lokal, tetapi mengabaikan kontrak API, migrations, dan operasional nyata.`,
  },
  '22': {
    bestPractices: `Best practices untuk Frontend Senior Best Practices:
- Pisahkan server state dari UI state. Data API, cache, refetch, dan invalidation idealnya dikelola dengan pola/tool yang memang dibuat untuk itu.
- Bangun UI state eksplisit: loading, empty, partial error, permission denied, stale data, optimistic update rollback. Ini yang sering membedakan senior dari sekadar “komponen jalan”.
- Desain komponen berdasarkan tanggung jawab: page/container mengurus data flow, komponen presentasional fokus rendering dan interaction.
- Sinkronkan frontend dengan kontrak backend: error code, pagination model, auth refresh, versioning, dan caching header jangan diperlakukan sebagai detail belakang layar.
- Pertimbangkan accessibility, performance, dan observability bersamaan; bukan hanya pixel-perfect happy path.`,
    pitfalls: `Pitfalls / red flags untuk Frontend Senior Best Practices:
- Semua fetching dilakukan manual di useEffect tanpa strategi caching, dedup, atau cancellation.
- Komponen halaman menjadi “god component” yang memegang fetch, transform, modal logic, form, dan styling sekaligus.
- Error state hanya console.log atau toast generik, tanpa UX yang membantu user pulih.
- Optimistic update dipakai tanpa rollback/reconciliation, sehingga UI tampak sukses padahal backend gagal.
- Fokus ke library/state management favorit, tetapi tidak bisa menjelaskan bagaimana menjaga UI tetap stabil saat API lambat atau berubah.`,
  },
  '23': {
    bestPractices: `Best practices untuk Senior Interview Questions:
- Jawab dengan struktur: konteks, opsi, keputusan, trade-off, failure mode, mitigasi. Ini membuat jawaban terdengar seperti engineer senior, bukan hafalan definisi.
- Ambil satu contoh produksi atau proyek nyata bila ada; interviewer biasanya lebih percaya pada narasi konkret daripada teori murni.
- Jika belum pernah mengalami kasusnya, nyatakan asumsi dengan jujur lalu desain solusi bertahap yang masuk akal.
- Hubungkan backend dan frontend bila relevan: misalnya eventual consistency di backend berarti UI butuh processing state dan retry UX.
- Tutup jawaban dengan observability atau rollback plan; itu sering jadi pembeda senior-level thinking.`,
    pitfalls: `Pitfalls / red flags untuk Senior Interview Questions:
- Jawaban loncat ke teknologi populer tanpa memahami problem statement dulu.
- Terlalu normatif: “tergantung use case” tapi tidak pernah benar-benar memilih satu pendekatan.
- Tidak membahas risiko dan failure mode dari pilihan yang diambil.
- Menjawab terlalu generik tanpa contoh, angka kasar, atau skenario implementasi.
- Berbicara seolah semua sistem harus microservices, event-driven, atau realtime. Senior biasanya justru selektif.`,
  },
};

const enrichConcept = (concept) => ({
  ...concept,
  ...(topicSpecificGuidance[concept.id] ?? {}),
});

const systemDesignSections = [
  {
    id: '24',
    title: 'Scale From Zero to Millions',
    category: 'SYSTEM DESIGN',
    section: 'system-design',
    tag: 'scale',
    shortDesc: 'Peta evolusi arsitektur dari satu server sederhana sampai sistem internet-scale yang tetap masuk akal dioperasikan.',
    detail: `Topik ini sangat sering muncul karena menguji kedewasaan desain. Interviewer tidak butuh kandidat yang langsung membangun arsitektur super rumit. Yang dicari justru kemampuan memulai dari baseline sederhana, lalu menjelaskan kapan dan mengapa sistem harus berevolusi. Pola umumnya: satu server untuk semuanya, lalu pisahkan web/app/database, tambah load balancer, cache, CDN, stateless app tier, database replication, queue, shard, sampai komponen spesialis ketika bottleneck sudah nyata.\n\nCara menjawab yang kuat adalah menceritakan perjalanan skalanya. Misalnya: tahap awal cukup satu app + satu DB. Saat traffic naik, static asset dipindah ke CDN, session dibuat stateless atau externalized, read-heavy workload dibantu cache dan replica, file upload dipindah ke object storage, dan proses mahal dipindah ke async worker. Dengan alur ini, desain terasa pragmatis, bukan sekadar daftar komponen cloud.\n\nSenior engineer juga akan menambahkan sudut pandang operasional. Scaling bukan cuma menambah server. Ada isu deployment, observability, hot partition, cache invalidation, schema migration, blast radius, dan cost. Jadi ketika bicara “millions”, yang dinilai bukan seberapa banyak teknologi yang Anda sebut, tetapi seberapa disiplin Anda mengidentifikasi bottleneck per fase pertumbuhan.`,
    springBoot: `Cara membumikan ke implementasi nyata:\n- Mulai dari Spring Boot monolith stateless di belakang load balancer; ini baseline yang sangat realistis.\n- Simpan file/gambar di object storage + CDN, jangan lewat local disk instance.\n- Gunakan Redis untuk session/cache saat mulai scale horizontal.\n- Pisahkan read-heavy concern dengan pagination, selective projection, dan read replica.\n- Tambahkan queue/worker untuk email, report, webhook, image processing, atau job mahal lain.\n- React/frontend bisa dibahas sebagai consumer yang sensitif ke latency, payload size, dan cache policy.`,
    comparison: `Evolusi yang sering dibahas:\n- Single server vs tier terpisah\n  - Single server: cepat dibangun, murah, cocok untuk awal.\n  - Tier terpisah: lebih scalable dan mudah di-tune, tapi operasional naik.\n\n- Vertical scaling vs horizontal scaling\n  - Vertical: sederhana, bagus sebagai langkah awal.\n  - Horizontal: lebih tahan lonjakan dan failure, tapi butuh statelessness dan koordinasi state.\n\n- DB replica vs sharding\n  - Replica: langkah umum pertama untuk scale read.\n  - Sharding: jauh lebih kompleks dan biasanya dipilih saat bottleneck data sudah jelas.\n\n- Sync request path vs async background work\n  - Sync: simpel untuk user flow pendek.\n  - Async: penting saat ada proses berat atau dependency lambat.`,
    bestPractices: `Best practices yang terdengar senior:\n- Jelaskan growth path bertahap, bukan arsitektur final dari hari pertama.\n- Bedakan bottleneck read, write, storage, dan network.\n- Jadikan app stateless lebih dulu sebelum membahas scale-out agresif.\n- Gunakan cache/CDN untuk workload populer sebelum memikirkan shard terlalu cepat.\n- Bahas operability: metrics, rollout, rollback, dan failure isolation per layer.`,
    pitfalls: `Pitfalls / red flags:\n- Langsung menyebut microservices, Kafka, dan sharding tanpa tahu traffic pattern.\n- Menganggap scale selalu soal request per second, padahal bisa jadi bottleneck ada di file storage, DB write, atau search.\n- Membiarkan session/file tinggal di local instance lalu berharap autoscaling berjalan mulus.\n- Tidak membahas data consistency dan cache invalidation saat layer cache ditambah.\n- Over-focus ke komponen, tapi tidak menjelaskan kapan tiap komponen benar-benar dibutuhkan.`,
    rule: 'Skalakan berdasarkan bottleneck nyata. Evolusi yang masuk akal biasanya lebih meyakinkan daripada desain “sempurna” sejak hari pertama.',
    code: `Stage 1: Client -> App Server -> DB
Stage 2: Client -> Load Balancer -> App Servers -> DB
Stage 3: + CDN + Redis Cache + Object Storage
Stage 4: + Read Replicas + Queue/Workers
Stage 5: + Sharding / Search / Specialized services (only if justified)

Thinking path:
1. Start simple
2. Identify bottleneck
3. Isolate hot path
4. Add targeted component
5. Re-check trade-offs + ops cost`,
  },
  {
    id: '25',
    title: 'Back-of-the-Envelope Estimation',
    category: 'SYSTEM DESIGN',
    section: 'system-design',
    tag: 'estimation',
    shortDesc: 'Estimasi kasar traffic, storage, bandwidth, dan kapasitas agar desain tidak melayang tanpa angka.',
    detail: `Banyak kandidat terlihat meyakinkan sampai interviewer bertanya, “berapa request per detik?”, “berapa storage per tahun?”, atau “berapa banyak machine yang kira-kira dibutuhkan?” Di sinilah back-of-the-envelope estimation penting. Tujuannya bukan akurasi sempurna, tetapi membuat keputusan arsitektur lebih grounded. Dengan angka kasar, Anda bisa membedakan apakah masalahnya masih cukup ditangani satu database kuat, atau sudah butuh cache agresif, partitioning, dan asynchronous processing.\n\nPendekatan yang sehat adalah memilih beberapa asumsi sederhana: daily active users, request per user per hari, rasio read vs write, ukuran object, retention, dan peak multiplier. Dari situ Anda turunkan QPS rata-rata, peak QPS, data growth per hari, bandwidth, dan kebutuhan cache/storage kasar. Interviewer biasanya senang jika Anda transparan terhadap asumsi dan mampu mengoreksi hitungan di tengah diskusi.\n\nEngineer senior memakai estimasi untuk memandu prioritas. Jika hasil hitungan menunjukkan read jauh lebih dominan daripada write, maka cache/CDN dan query optimization menjadi fokus utama. Jika storage tumbuh sangat cepat, lifecycle policy dan cold storage jadi relevan. Jika peak traffic 10x rata-rata, kapasitas dan autoscaling perlu dibahas. Jadi estimation bukan ritual matematika; ia alat untuk memilih trade-off yang tepat.`,
    springBoot: `Cara menghubungkan dengan implementasi:\n- Gunakan estimasi QPS untuk menjelaskan kebutuhan thread pool, connection pool, cache, dan replica di service Spring Boot.\n- Estimasi payload size membantu membahas compression, pagination, dan selective fields.\n- Estimasi write volume membantu menentukan apakah single Postgres instance masih cukup atau perlu partisi/queue.\n- Di frontend, angka bandwidth/payload ikut memengaruhi keputusan lazy loading, skeleton UI, dan caching client.`,
    comparison: `Apa yang biasanya diestimasi:\n- Average QPS vs peak QPS\n  - Average memberi baseline biaya.\n  - Peak penting untuk capacity planning.\n\n- Raw storage vs usable storage\n  - Raw data belum termasuk replica, index, metadata, dan backup.\n  - Usable planning harus memasukkan overhead nyata.\n\n- Read-heavy vs write-heavy system\n  - Read-heavy cenderung mendorong cache/CDN/replica.\n  - Write-heavy cenderung menekan DB write path, queue, batching, dan partitioning.\n\n- Exact math vs justified approximation\n  - Exact math tidak diharapkan.\n  - Approximation yang konsisten dan masuk akal justru paling membantu interview.`,
    bestPractices: `Best practices saat melakukan estimasi:\n- Nyatakan asumsi di depan dan sebutkan mana yang paling sensitif.\n- Pakai pembulatan yang mudah dihitung cepat, misalnya 1M user, 10 request/hari, peak 5x.\n- Bedakan average dan peak; interviewer sering peduli keduanya.\n- Sertakan overhead realistis: replication, index, metadata, cache miss, retry.\n- Hubungkan angka ke keputusan desain, jangan berhenti di matematika.`,
    pitfalls: `Pitfalls / red flags:\n- Takut memberi angka lalu sama sekali tidak mengestimasi apa pun.\n- Menghasilkan hitungan, tetapi tidak dipakai untuk memengaruhi desain.\n- Lupa peak traffic dan hanya menghitung rata-rata.\n- Lupa overhead seperti replica, backup, atau ukuran index.\n- Terlalu detail aritmetika sampai waktu interview habis sebelum desain dibahas.`,
    rule: 'Estimasi kasar yang transparan jauh lebih berguna daripada precision palsu tanpa implikasi desain.',
    code: `Example quick math:
- 10M DAU
- 20 requests/user/day
=> 200M requests/day
=> ~2.3K requests/sec average
- Peak factor 5x
=> ~11.5K requests/sec peak

Storage example:
- 5M new objects/day
- 200 KB/object
=> ~1 TB/day raw
=> ~365 TB/year raw (before replica/backups)

Use the numbers to ask:
- Need CDN/cache?
- Need read replicas?
- Need async processing?
- Need lifecycle / archive policy?`,
  },
  {
    id: '26',
    title: 'A Framework for System Design Interviews',
    category: 'SYSTEM DESIGN',
    section: 'system-design',
    tag: 'interview',
    shortDesc: 'Kerangka jawaban yang membuat diskusi desain tetap runtut, senior, dan mudah diikuti interviewer.',
    detail: `Framework ini penting karena banyak kandidat sebenarnya cukup paham teknis, tetapi kalah rapi saat menjawab. Di interview system design, struktur jawaban sering sama pentingnya dengan isi. Kerangka yang kuat biasanya dimulai dari requirement clarification, lalu non-functional requirement, estimasi kasar, high-level design, data model, API, scale/reliability bottleneck, kemudian trade-off dan evolusi lanjutan.\n\nYang membuat jawaban terasa senior adalah ritmenya. Anda tidak langsung menyelam ke tabel, queue, atau cache. Anda lebih dulu menyamakan problem, lalu mengusulkan baseline solution, baru menambahkan kompleksitas ketika interviewer memberi skala atau constraint tambahan. Ini menunjukkan bahwa Anda tidak over-engineer, tetapi juga tidak naïf terhadap bottleneck nyata.\n\nFramework yang baik juga membantu saat interviewer melempar perubahan di tengah jalan. Misalnya tiba-tiba ada requirement multi-region, strong consistency, atau read spike besar. Anda tinggal kembali ke kerangka: bagian mana yang terpengaruh? API? write path? storage? cache? UX? Dengan begitu, Anda terlihat tenang dan punya model berpikir yang reusable.`,
    springBoot: `Cara mengaitkan ke implementasi nyata:\n- Setelah high-level design, terjemahkan komponen ke stack konkret: Spring Boot service, Postgres, Redis, Kafka, object storage, React client.\n- Saat membahas reliability, kaitkan dengan timeout, retry, idempotency, queue, DLQ, dan observability.\n- Saat membahas client impact, sebutkan loading model, eventual consistency state, pagination, atau realtime sync di frontend.`,
    comparison: `Jawaban lemah vs matang:\n- Lemah: langsung listing teknologi favorit.\n- Matang: mulai dari requirement dan evolusi desain.\n\n- Lemah: semua komponen tampak wajib.\n- Matang: komponen ditambahkan hanya saat ada alasan kapasitas, reliability, atau product need.\n\n- Lemah: hanya bahas happy path.\n- Matang: bahas failure path, operability, dan trade-off.`,
    bestPractices: `Framework praktis yang aman dipakai:\n- Clarify functional requirements
- Clarify non-functional requirements
- Do quick estimation
- Outline core entities and APIs
- Draw high-level architecture
- Walk through read path and write path
- Identify bottlenecks and scale tactics
- Cover reliability, security, and observability
- Close with trade-offs and next evolution`,
    pitfalls: `Pitfalls / red flags:\n- Terlalu lama di requirement sampai tidak pernah mendesain.\n- Langsung masuk detail implementasi tanpa gambar besar.\n- Tidak pernah menyebut asumsi.\n- Tidak menghubungkan pilihan backend dengan UX/client impact.\n- Menutup jawaban tanpa trade-off, seolah desainnya bebas konsekuensi.`,
    rule: 'Framework yang bagus membuat Anda terdengar seperti engineer yang mengambil keputusan, bukan seperti orang yang sedang menghafal komponen.',
    code: `Interview flow template:
1. Clarify scope and assumptions
2. Define scale + SLA/latency goals
3. Estimate traffic/data quickly
4. Propose high-level architecture
5. Detail data model + API
6. Explain read/write path
7. Address bottlenecks and failures
8. Add security + observability
9. Summarize trade-offs and future scaling`,
  },
  {
    id: '27',
    title: 'Rate Limiter as a System Design Problem',
    category: 'SYSTEM DESIGN',
    section: 'system-design',
    tag: 'reliability',
    shortDesc: 'Cara mendesain rate limiter yang fair, distributed, dan operasionalnya masuk akal untuk edge maupun service layer.',
    detail: `Rate limiter sering terlihat kecil, tetapi sebenarnya topik system design yang sangat kaya. Anda perlu menjawab siapa yang dibatasi, di mana enforcement dilakukan, state disimpan di mana, algoritma apa yang dipakai, dan bagaimana memberi feedback ke client. Tujuannya bukan sekadar menolak request, melainkan melindungi resource, menjaga fairness, menahan abuse, dan memastikan satu tenant atau client tidak menghabiskan kapasitas bersama.\n\nDalam interview, desain yang kuat biasanya dimulai dengan policy. Apakah limit berbasis IP, user, API key, tenant, atau kombinasi? Apakah semua endpoint punya limit sama? Bagaimana dengan login, search, payment, atau admin export? Setelah policy jelas, baru bahas lokasi enforcement: di gateway untuk proteksi global, di service untuk context bisnis yang lebih detail, atau kombinasi keduanya.\n\nBagian menarik berikutnya adalah algoritma dan distributed state. Fixed window sederhana tapi bursty. Sliding window lebih fair tapi lebih mahal. Token bucket sangat populer karena mendukung burst terkontrol sambil menjaga rata-rata rate. Di sistem multi-instance, counter lokal tidak cukup; biasanya dibutuhkan Redis atau store terpusat lain agar limit konsisten. Engineer senior juga akan menyinggung response 429, Retry-After, observability reject rate, dan false positive yang bisa merusak user sehat.`,
    springBoot: `Implementasi konkret yang relevan:\n- Spring Cloud Gateway untuk edge rate limiting.\n- Bucket4j untuk library rate limiting yang matang di Java.\n- Redis untuk distributed counter/token bucket state.\n- Filter/interceptor untuk service-level policy tambahan yang dekat ke domain.\n- Metrics untuk rate-limit hit, reject %, top offending key, dan latency store Redis.`,
    comparison: `Trade-off desain rate limiter:\n- Gateway vs service layer\n  - Gateway: konsisten, efisien, bagus untuk proteksi global.\n  - Service layer: tahu konteks bisnis lebih detail, tapi bisa tersebar.\n\n- Fixed window vs sliding window vs token bucket\n  - Fixed window: paling simpel dan murah, tapi burst di batas window.\n  - Sliding window: lebih fair/presisi, tapi state dan compute lebih mahal.\n  - Token bucket: sangat praktis untuk produksi karena mendukung burst terkontrol.\n\n- Per-IP vs per-user/per-tenant\n  - Per-IP: mudah, tapi rawan false positive di NAT/proxy.\n  - Per-user/tenant: lebih fair, tapi butuh identitas yang andal.`,
    bestPractices: `Best practices yang memberi kesan senior:\n- Mulai dari kebijakan produk dan abuse model, bukan dari algoritma dulu.\n- Kembalikan 429 + Retry-After + header limit yang informatif.\n- Bedakan limit untuk endpoint murah vs mahal.\n- Gunakan distributed state jika app berjalan di banyak instance.\n- Pantau dampak rate limit ke user sehat, bukan hanya attacker/noisy client.`,
    pitfalls: `Pitfalls / red flags:\n- Menaruh counter di memory lokal pada cluster besar lalu mengira enforcement sudah konsisten.\n- Hanya limit per IP pada environment NAT besar dan memblokir banyak user sah.\n- Tidak ada respons yang memberi tahu kapan client boleh retry.\n- Menganggap rate limiter selesai setelah algoritma dipilih, tanpa observability dan tuning policy.\n- Tidak membedakan edge protection dan business-aware throttling.`,
    rule: 'Rate limiter yang matang bukan cuma algoritma; ia gabungan policy, storage state, UX error, dan operational tuning.',
    code: `Client -> API Gateway -> Rate Limiter -> App Service
                    |
                    -> Redis (shared counters / token state)

Flow:
1. Derive identity key (tenant:user:route)
2. Check token/counter in Redis
3. Allow if within policy
4. Reject with 429 + Retry-After if exceeded
5. Emit metrics/logs for tuning and abuse analysis`,
  },
  {
    id: '28',
    title: 'Consistent Hashing',
    category: 'SYSTEM DESIGN',
    section: 'system-design',
    tag: 'distributed-data',
    shortDesc: 'Teknik membagi key ke node dengan perpindahan data minimal saat server ditambah atau dihapus.',
    detail: `Consistent hashing muncul ketika sistem tidak lagi nyaman memakai pembagian data sederhana seperti hash(key) % N. Rumus modulo kelihatan mudah, tetapi begitu jumlah node berubah, hampir semua key akan pindah. Itu berarti cache miss massal, rebalance besar, dan latency spike. Consistent hashing dirancang untuk mengurangi dampak itu: saat node bertambah atau hilang, hanya sebagian kecil key yang perlu berpindah.\n\nGambaran mental yang aman untuk interview adalah hash ring. Node dan key sama-sama dipetakan ke lingkaran hash. Sebuah key disimpan di node pertama yang ditemui searah jarum jam. Saat sebuah node mati atau node baru masuk, hanya rentang key di sekitar node itu yang terdampak. Ini alasan mengapa teknik ini populer pada distributed cache, key-value store, dan beberapa storage cluster.\n\nJawaban senior tidak berhenti di definisi ring. Anda juga perlu menyinggung virtual nodes. Tanpa virtual nodes, distribusi bisa timpang jika posisi node di ring kebetulan jelek. Dengan virtual nodes, setiap physical node memiliki banyak titik pada ring sehingga distribusi key lebih merata dan rebalancing lebih halus. Bahas juga replication, failure detection, dan hotspot: consistent hashing mengurangi data movement, tetapi tidak otomatis menyelesaikan key panas atau skew workload.`,
    springBoot: `Sudut implementasi yang relevan:
- Di backend Java, konsep ini sering hadir lewat Redis Cluster client, Cassandra/Dynamo-style thinking, atau custom partition router untuk cache/shard lookup.
- Spring Boot service biasanya tidak mengimplementasikan ring dari nol, tetapi engineer senior tetap perlu paham implikasinya saat memakai clustered Redis, distributed cache, atau storage gateway.
- Untuk service internal, consistent hashing juga kadang dipakai untuk sticky routing ke worker tertentu agar cache lokal atau state processing lebih efektif.
- Di frontend/React hampir tidak terlihat langsung, tetapi efeknya terasa pada latency stability dan cache-hit behavior API saat cluster berubah ukuran.`,
    comparison: `Perbandingan yang sering dibahas:
- Modulo hashing vs consistent hashing
  - Modulo: sederhana, tetapi remap besar saat N berubah.
  - Consistent hashing: lebih stabil saat membership berubah, namun implementasi lebih kompleks.

- Tanpa virtual nodes vs dengan virtual nodes
  - Tanpa virtual nodes: lebih sederhana, tapi distribusi bisa berat sebelah.
  - Dengan virtual nodes: lebih seimbang, namun state/routing table bertambah.

- Random load balancing vs key-based routing
  - Random/round-robin: bagus untuk request stateless umum.
  - Key-based routing: penting jika locality data/cache mattered atau shard ownership harus stabil.`,
    bestPractices: `Best practices yang terdengar matang:
- Jelaskan dulu problem data movement saat node count berubah; itu inti mengapa consistent hashing dibutuhkan.
- Sebut virtual nodes hampir selalu, karena ini pembeda antara jawaban hafalan dan jawaban produksi.
- Pisahkan isu distribution fairness, replication, dan hotspot; jangan seolah satu teknik menyelesaikan semuanya.
- Pastikan ada mekanisme health check dan rebalancing yang tidak memicu thundering herd.
- Untuk cache cluster, diskusikan dampak rebalance ke cache warm-up dan latency.`,
    pitfalls: `Pitfalls / red flags:
- Menjelaskan consistent hashing hanya sebagai “hashing untuk banyak server” tanpa menyebut minimisasi remap.
- Lupa virtual nodes sehingga distribusi tampak terlalu ideal.
- Mengira consistent hashing otomatis menyeimbangkan workload panas; hot key tetap bisa menghancurkan satu node.
- Tidak membahas replication/failover, padahal single owner saja rawan saat node hilang.
- Memakai istilah shard, partition, dan replica secara campur aduk tanpa jelas.`,
    rule: 'Kalau jumlah node bisa berubah, pikirkan dulu biaya remap key; di situlah consistent hashing jadi masuk akal.',
    code: `Hash ring (0 ... 2^m-1)

Nodes:
- cache-A -> h(A)
- cache-B -> h(B)
- cache-C -> h(C)

Lookup:
1. hash(userId)
2. Walk clockwise on the ring
3. Pick first node encountered
4. Optionally pick next N nodes for replicas

With virtual nodes:
- cache-A#1, cache-A#2, cache-A#3 ...
- cache-B#1, cache-B#2, cache-B#3 ...`,
  },
  {
    id: '29',
    title: 'Key-Value Store',
    category: 'SYSTEM DESIGN',
    section: 'system-design',
    tag: 'storage',
    shortDesc: 'Desain penyimpanan sederhana secara interface, tetapi menuntut keputusan serius soal partitioning, replication, consistency, dan latency.',
    detail: `Key-value store tampak sederhana: put(key, value), get(key), delete(key). Justru karena antarmukanya sederhana, topik ini bagus untuk menguji kedalaman desain distributed systems. Begitu skala membesar, pertanyaannya berubah dari “bagaimana menyimpan pasangan key-value?” menjadi “bagaimana memastikan read/write tetap cepat, data tersebar merata, node bisa gagal, dan consistency model masih sesuai kebutuhan produk?”.\n\nDalam interview, jawaban yang rapi biasanya dimulai dari requirement: apakah sistem lebih read-heavy atau write-heavy, ukuran value, target latency, apakah key harus unik global, apakah TTL dibutuhkan, apakah scan/range query penting, dan seberapa kuat consistency yang dibutuhkan. Kalau kebutuhan utamanya adalah point lookup cepat dan skala horizontal, key-value store sangat cocok. Kalau butuh join kompleks atau ad-hoc query, maka relational database bisa lebih pas.\n\nArsitektur tingkat tingginya sering mencakup request router, partitioning (sering memakai consistent hashing), replication untuk durability/availability, write path, read repair atau quorum bila perlu, dan compaction/storage engine di belakang layar. Engineer senior sebaiknya juga menyinggung CAP trade-off secara praktis: banyak key-value store memilih availability dan partition tolerance, lalu memberi eventual consistency untuk sebagian operasi. Namun ada juga konfigurasi quorum atau leader-based replication untuk menaikkan consistency dengan biaya latency dan availability write.`,
    springBoot: `Cara mengaitkan ke stack nyata:
- Redis sering dipakai sebagai key-value store in-memory untuk cache, session, rate limit, atau leaderboard; cepat sekali tetapi durability/configuration perlu dipahami.
- DynamoDB, Cassandra, atau Riak adalah contoh distributed key-value / wide-column style yang cocok untuk skala besar dan high availability.
- Di Spring Boot, engineer biasanya berinteraksi lewat Spring Data Redis, RedisTemplate, Lettuce/Jedis, atau SDK vendor cloud.
- Penting membedakan use case cache vs source of truth. Banyak tim keliru menganggap Redis cache dan persistent distributed store sebagai hal yang sama.`,
    comparison: `Perbandingan penting:
- Key-value store vs relational database
  - KV store: lookup cepat, scale horizontal lebih natural, schema sederhana.
  - RDBMS: query kaya, transaksi kuat, join dan integrity lebih nyaman.

- In-memory vs disk-backed
  - In-memory: latency sangat rendah, tetapi memory mahal dan durability perlu strategi ekstra.
  - Disk-backed: lebih murah untuk data besar, tetapi latency dan engine complexity naik.

- Eventual consistency vs stronger consistency
  - Eventual: availability/latency lebih baik saat partition, cocok banyak use case internet-scale.
  - Stronger/quorum: hasil baca lebih dapat diprediksi, tetapi write/read bisa lebih mahal.`,
    bestPractices: `Best practices untuk jawaban senior:
- Mulai dari access pattern: point read, write rate, TTL, object size, hot key, dan consistency need.
- Jelaskan partitioning + replication sebagai dua keputusan terpisah yang sama-sama penting.
- Sebutkan bahwa data model sederhana tidak berarti operasional sederhana; anti-entropy, repair, dan monitoring tetap berat.
- Jika membahas Redis, bedakan clearly cache semantics dengan persistent store semantics.
- Bahas observability: p99 latency, hit/miss, replication lag, rebalance status, hot partition.`,
    pitfalls: `Pitfalls / red flags:
- Menyamakan semua key-value store seolah perilakunya identik.
- Tidak membahas replication atau failure node sama sekali.
- Mengabaikan hot key / hot partition yang bisa membuat distribusi teoritis runtuh di praktik.
- Mengklaim “eventual consistency tidak masalah” tanpa menghubungkannya ke kebutuhan produk.
- Menggunakan key-value store untuk query kompleks yang sebenarnya tidak cocok.`,
    rule: 'Sebelum memilih key-value store, pastikan access pattern memang didominasi lookup by key dan trade-off consistency-nya bisa diterima.',
    code: `High-level KV store flow:
Client
  -> Router / Coordinator
      -> Partition function (often consistent hashing)
          -> Primary replica
          -> Secondary replicas

Basic API:
PUT /kv/{key}
GET /kv/{key}
DELETE /kv/{key}

Design questions:
- How many replicas?
- Read from leader or follower?
- Quorum reads/writes?
- TTL support?
- What happens on node failure?`,
  },
  {
    id: '30',
    title: 'Unique ID Generator in Distributed Systems',
    category: 'SYSTEM DESIGN',
    section: 'system-design',
    tag: 'identity',
    shortDesc: 'Membangun generator ID yang unik, cepat, dan tetap aman dipakai banyak node tanpa jadi bottleneck sentral yang rapuh.',
    detail: `ID generator terdengar remeh sampai Anda mencoba menskalakannya. Sistem kecil bisa hidup nyaman dengan auto-increment database. Tetapi di distributed system, pendekatan itu cepat menjadi bottleneck: ada single writer, contention, failover rumit, dan kadang tidak cocok untuk multi-region. Karena itu, interview topik ini biasanya menguji cara berpikir Anda tentang uniqueness, ordering, throughput, dan operational simplicity.\n\nLangkah pertama adalah mengklarifikasi requirement. Apakah ID harus unik global? Haruskah roughly sortable by time? Apakah boleh ada gap? Apakah format harus numerik, pendek, atau aman dibagikan ke publik? Requirement seperti ini langsung memengaruhi desain. UUID sangat mudah untuk uniqueness, tetapi panjang, tidak berurutan, dan kurang ramah index. Database sequence memberi ordering bagus, tetapi kurang ideal untuk skala horizontal besar. Snowflake-style ID mencoba kompromi: gabungkan timestamp, machine/node ID, dan sequence sehingga setiap node bisa menghasilkan ID lokal tanpa koordinasi per request.\n\nJawaban senior biasanya menjelaskan bukan hanya format bit, tetapi juga failure mode. Apa yang terjadi jika clock mundur? Bagaimana membagikan machine ID secara aman? Bagaimana jika satu node menghasilkan ID terlalu cepat dan sequence habis di milidetik yang sama? Di sinilah terlihat kedewasaan desain. ID generator bukan sekadar “algoritma bikin angka unik”; ia menyentuh time sync, coordination ringan, observability, dan ergonomi storage/index.`,
    springBoot: `Sudut praktis untuk Java/Spring:
- Untuk monolith kecil, sequence/identity dari Postgres/MySQL masih sangat valid dan bahkan lebih sederhana.
- Untuk distributed service skala besar, Snowflake-style generator sering diimplementasikan di library internal atau service ringan yang membagikan worker ID.
- Hibernate sequence cocok untuk banyak kasus, tetapi jangan dipaksa seolah solusi universal ketika throughput lintas region dan availability jadi isu utama.
- Di React/frontend, jenis ID memengaruhi URL readability, sort order di UI admin, dan kemungkinan enumeration jika ID bersifat mudah ditebak.`,
    comparison: `Perbandingan opsi umum:
- Auto-increment DB
  - Sederhana, berurutan, bagus untuk sistem kecil-menengah.
  - Menjadi bottleneck / SPOF logis untuk distribusi luas.

- UUID
  - Sangat mudah dan unik tanpa koordinasi.
  - Panjang, tidak ordered, kurang ideal untuk clustered index tertentu.

- Snowflake-style ID
  - Unik, roughly time-ordered, throughput tinggi per node.
  - Butuh penanganan clock dan machine ID yang disiplin.

- Hi/Lo or segment allocation
  - Mengurangi round-trip ke DB dengan blok sequence.
  - Masih butuh koordinasi pusat berkala, tetapi jauh lebih ringan.`,
    bestPractices: `Best practices yang membuat jawaban kuat:
- Klarifikasi apakah uniqueness saja cukup atau perlu ordering/compactness juga.
- Sebut trade-off index/database: ID acak dan ID terurut memberi perilaku storage berbeda.
- Jika memilih Snowflake, bahas clock skew, worker-id management, dan fallback behavior.
- Ingat bahwa “globally unique” dan “strictly sequential worldwide” sering bertentangan secara praktis.
- Pilih solusi paling sederhana yang memenuhi scale; tidak semua app perlu Snowflake.`,
    pitfalls: `Pitfalls / red flags:
- Langsung berkata “pakai UUID selesai” tanpa membahas konsekuensi index, panjang, dan ordering.
- Mengasumsikan database sequence pasti jelek untuk semua sistem.
- Tidak menyinggung clock rollback pada desain time-based ID.
- Menggabungkan requirement publik dan internal tanpa memikirkan predictability/enumeration.
- Mendesain service generator sentral tanpa memikirkan HA dan latency.`,
    rule: 'Untuk ID terdistribusi, cari keseimbangan antara uniqueness, ordering, throughput, dan operational simplicity — jangan optimalkan satu dimensi lalu merusak yang lain.',
    code: `Snowflake-style 64-bit idea:
| timestamp | worker-id | sequence |

Flow on each node:
1. Read current timestamp
2. If same millisecond, increment sequence
3. If sequence exhausted, wait next millisecond
4. If clock moved backward, trigger safeguard/fallback
5. Return composed ID

Example decision guide:
- Small app + single DB -> sequence is fine
- Public IDs + no ordering need -> UUID/ULID can work
- High-scale distributed write path -> Snowflake-style is often a strong fit`,
  },
  {
    id: '31',
    title: 'URL Shortener',
    category: 'SYSTEM DESIGN',
    section: 'system-design',
    tag: 'product-design',
    shortDesc: 'Mendesain layanan short link yang sederhana di permukaan, tetapi menyentuh encoding, redirect latency, analytics, abuse control, dan scale read-heavy.',
    detail: `URL shortener adalah favorit interview karena problem-nya mudah dipahami, tetapi cukup kaya untuk membahas storage, hashing/encoding, cache, redirect path, dan analytics. Fitur intinya ada dua: membuat short URL dari long URL, lalu melakukan redirect secepat mungkin saat short URL diakses. Di balik itu, ada banyak pertanyaan penting: apakah short code harus custom atau auto-generated, apakah link bisa expire, apakah perlu analytics click, bagaimana menangani spam/phishing, dan seberapa kuat redirect latency target-nya.\n\nRead path biasanya sangat dominan. Artinya, desain yang matang hampir selalu memikirkan cache agresif untuk lookup shortCode -> longUrl. Write path lebih ringan: menerima long URL, menghasilkan code unik, menyimpan mapping, lalu mengembalikan short link. Tantangan menariknya ada pada pemilihan code generation. Anda bisa memakai counter + base62 encoding untuk menghasilkan kode pendek dan unik, atau memakai hash tertentu plus collision handling. Counter + base62 mudah dijelaskan dan efisien, tetapi memerlukan generator ID yang andal. Hashing bisa mengurangi dependency ke counter sentral, tetapi collision dan panjang code harus dikelola.\n\nJawaban senior juga menyentuh hal operasional yang sering dilupakan kandidat: open redirect abuse, malicious URL checking, rate limiting link creation, click analytics yang jangan sampai memperlambat redirect utama, dan lifecycle data. Redirect harus tetap cepat meski analytics atau enrichment gagal. Karena itu, desain yang matang biasanya memisahkan critical path redirect dari event logging/analytics via queue.`,
    springBoot: `Sudut implementasi konkret:
- Spring Boot service bisa expose POST /shorten dan GET /{code} untuk redirect.
- Redis sangat cocok untuk cache hot mapping shortCode -> longUrl.
- Database relasional cukup bagus untuk menyimpan mapping utama jika write volume masih moderat; di skala lebih tinggi, partitioning atau distributed store bisa dipertimbangkan.
- Analytics click event sebaiknya masuk queue/Kafka agar redirect tidak menunggu write non-kritis.
- Dari sisi frontend, shortener dashboard biasanya butuh tabel analytics, expiration state, dan custom alias validation UX.`,
    comparison: `Perbandingan desain umum:
- Counter + Base62 vs hash-based code
  - Counter + Base62: pendek, deterministik, collision nyaris nol jika ID unik.
  - Hash-based: bisa lebih terdesentralisasi, tetapi collision dan retry perlu ditangani.

- Cache-aside vs direct DB lookup
  - Cache-aside: read path lebih cepat dan murah pada traffic tinggi.
  - Direct DB: lebih simpel, cocok untuk skala kecil, tetapi cepat jadi bottleneck.

- Sync analytics vs async analytics
  - Sync: implementasi awal mudah, tetapi merusak latency redirect.
  - Async: lebih scalable dan aman untuk user path utama.`,
    bestPractices: `Best practices yang bagus untuk interview:
- Pisahkan create path dan redirect path; kebutuhan scaling keduanya berbeda.
- Optimalkan redirect path untuk very low latency dengan cache dan minimal logic.
- Gunakan async event untuk analytics/click tracking.
- Tambahkan TTL/expiration, abuse detection, dan custom alias validation bila requirement mengarah ke produk publik.
- Jika memakai base62 dari ID generator, hubungkan desain ini dengan topik unique ID generator.`,
    pitfalls: `Pitfalls / red flags:
- Terlalu fokus ke algoritma encoding, tetapi lupa bahwa read path adalah bottleneck utama.
- Menaruh analytics sinkron di redirect path.
- Tidak membahas collision handling atau uniqueness code.
- Mengabaikan abuse/spam/open redirect risk untuk layanan publik.
- Tidak membedakan link permanen, link expiring, dan deleted link behavior.`,
    rule: 'Di URL shortener, redirect path harus sederhana dan cepat; semua hal sekunder seperti analytics dan enrichment sebaiknya keluar dari critical path.',
    code: `Create path:
Client -> POST /shorten
       -> generate unique id
       -> base62 encode(id)
       -> store {code -> longUrl, metadata}
       -> return shortUrl

Redirect path:
Browser -> GET /abc123
        -> Redis lookup code
        -> if miss, DB lookup and warm cache
        -> 301/302 redirect to longUrl
        -> emit click event asynchronously

Example schema:
short_links(code PK, long_url, created_at, expires_at, owner_id, status)`,
  },
];

const batch3SystemDesignSections = [
  {
    id: '32',
    title: 'Web Crawler',
    category: 'SYSTEM DESIGN',
    section: 'system-design',
    tag: 'data-platform',
    shortDesc: 'Mendesain crawler yang efisien, sopan terhadap website target, dan tetap bisa diskalakan tanpa tenggelam oleh duplicate URL atau trap yang tidak ada habisnya.',
    detail: `Web crawler adalah sistem yang mengambil halaman web dalam jumlah sangat besar, mengekstrak link dan konten, lalu menjadwalkan crawl berikutnya secara terus-menerus. Di interview, topik ini menguji kemampuan Anda membagi problem menjadi frontier management, URL deduplication, politeness, fetching, parsing, storage, dan recrawl strategy. Sistemnya terlihat seperti pipeline data, tetapi sebenarnya banyak keputusan reliability dan fairness yang menentukan apakah crawler benar-benar usable di produksi.

Arsitektur mental yang sehat biasanya dimulai dari URL frontier. Frontier menyimpan URL mana yang sudah diketahui, mana yang harus diprioritaskan, dan kapan host tertentu boleh disentuh lagi. Ini penting karena crawler yang “cepat” tapi tidak sopan akan dianggap abuse: tidak menghormati robots.txt, tidak menerapkan rate limit per host, dan bisa membanjiri satu domain kecil. Karena itu, jawaban matang hampir selalu menyebut canonicalization URL, deduplication, host-based politeness, dan scheduler yang memisahkan domain agar fetch merata.

Setelah fetch, sistem masuk ke parser/extractor. Di sini Anda mengekstrak content, metadata, dan outgoing links, lalu menyimpan hasil ke storage yang cocok: raw page, parsed document, index-ready representation, atau semuanya sekaligus. Engineer senior biasanya juga menyinggung recrawl policy. Tidak semua halaman perlu diambil ulang dengan frekuensi sama. Homepage media besar mungkin dicrawl menit-an, sedangkan halaman statis dokumentasi cukup harian atau mingguan. Dengan begitu, crawler tidak hanya scale secara teknis, tetapi juga efisien secara biaya dan bandwidth.`,
    springBoot: `Sudut implementasi yang relevan:
- Spring Boot cocok untuk orchestration API, scheduler metadata, admin panel, dan worker service ringan, meski fetcher core ber-throughput tinggi kadang lebih nyaman memakai Java async client atau worker terpisah.
- WebClient atau Java HttpClient cocok untuk fetch HTTP dengan timeout, redirect policy, dan compression support.
- Kafka/RabbitMQ berguna untuk memisahkan frontier events, fetch jobs, parse jobs, dan downstream indexing.
- Redis bisa dipakai untuk short-term dedup, host politeness token, atau frontier priority queue tertentu; storage jangka panjang bisa tetap di database/object storage/search index.
- Jika hasil crawler dipakai UI React, pikirkan freshness indicator, partial indexing state, dan search latency dari sisi consumer app.`,
    comparison: `Trade-off desain yang sering muncul:
- BFS-ish crawl vs priority crawl
  - BFS-ish: lebih sederhana dan cakupan cepat melebar.
  - Priority crawl: lebih bernilai untuk news/search use case, tetapi scoring dan fairness lebih rumit.

- Push to queue vs centralized scheduler
  - Queue-heavy: scalable dan worker-friendly.
  - Centralized scheduler: kontrol prioritas/politeness lebih mudah, tetapi bisa jadi bottleneck jika tidak hati-hati.

- Full recrawl vs incremental recrawl
  - Full recrawl: simpel secara konsep, boros bandwidth dan biaya.
  - Incremental: jauh lebih efisien, tetapi butuh change detection dan freshness policy.

- Raw HTML only vs parsed structured storage
  - Raw HTML: fleksibel untuk reprocessing.
  - Parsed storage: query downstream lebih cepat, tetapi pipeline schema evolution perlu dijaga.`,
    bestPractices: `Best practices yang memberi kesan senior:
- Normalisasi URL sejak awal: scheme, trailing slash, fragment, duplicate query params, dan canonical URL agar frontier tidak penuh sampah.
- Terapkan politeness per host/domain: robots.txt, crawl-delay bila relevan, dan rate limit independen per target site.
- Pisahkan fetch, parse, dedup, dan indexing agar pipeline mudah di-scale dan failure tidak merusak semuanya sekaligus.
- Prioritaskan recrawl berdasarkan nilai bisnis dan update frequency, bukan semua halaman diperlakukan sama.
- Catat fetch status, latency, content hash, dan last-seen metadata untuk analisis freshness dan debugging.
- Siapkan mekanisme dead-letter atau quarantine untuk halaman rusak, infinite redirect, dan parser failure berulang.`,
    pitfalls: `Pitfalls / red flags:
- Tidak membahas politeness sama sekali, seolah target website adalah dependency internal yang bebas dihajar.
- URL dedup hanya berdasarkan string mentah tanpa canonicalization, sehingga duplicate explosion cepat terjadi.
- Scheduler tidak sadar host, membuat satu domain panas dibombardir sementara domain lain terabaikan.
- Parser sinkron dan berat di jalur fetch, sehingga throughput ambruk saat menemukan halaman besar atau malformed.
- Tidak ada strategi untuk spider trap, duplicate content, login wall, atau infinite pagination.
- Semua hasil disimpan tanpa retention/freshness policy, lalu biaya storage meledak tanpa nilai tambah nyata.`,
    rule: 'Crawler yang bagus bukan yang paling agresif, tetapi yang paling disiplin mengelola frontier, dedup, politeness, dan freshness.',
    code: `High-level crawl flow:
Seed URLs
  -> URL Frontier / Scheduler
      -> Host politeness check
      -> Fetch workers
      -> Parser / Link extractor
      -> URL canonicalizer + dedup
      -> Content storage / index pipeline
      -> Recrawl scheduler

Pseudo rules:
- one host has its own rate budget
- canonicalize before enqueue
- store content hash to detect unchanged pages
- parse asynchronously, not inside one giant fetch loop`,
  },
  {
    id: '33',
    title: 'Notification System',
    category: 'SYSTEM DESIGN',
    section: 'system-design',
    tag: 'event-driven',
    shortDesc: 'Membangun sistem notifikasi multi-channel yang tahan spike, tidak mengirim duplikat, dan tetap menghormati preferensi user serta batasan provider.',
    detail: `Notification system sering tampak “tinggal kirim email atau push”, padahal di skala produk nyata problem-nya cukup kompleks. Anda harus menerima event dari banyak service, menentukan user mana yang perlu diberi tahu, memilih channel yang tepat, menghormati preference dan quiet hours, merender pesan, mengirim ke provider, lalu menangani retry, bounce, delivery status, dan analytics. Topik ini menguji event-driven thinking, reliability, dan kemampuan membedakan business policy dari transport mechanism.

High-level design yang matang biasanya memisahkan notification service dari producer service. Service lain hanya menerbitkan event atau command seperti order_paid, password_reset_requested, atau comment_mentioned. Notification service kemudian melakukan fan-out: lookup template, preference, device token/email target, dan channel policy. Dengan pemisahan ini, order service tidak perlu tahu detail APNs, FCM, SMTP, SES, atau SMS gateway.

Bagian penting lain adalah delivery pipeline. Banyak sistem perlu multi-channel fallback: push dulu, kalau device token invalid atau user offline terlalu lama, lanjut email; untuk OTP mungkin SMS diprioritaskan. Engineer senior juga biasanya membahas idempotency, scheduled send, provider quota, dead-letter queue, dan observability per channel. Notifikasi adalah area di mana duplicate send, out-of-order event, dan quiet-hour violation bisa langsung terasa ke user, jadi disiplin desain di sini sangat penting.`,
    springBoot: `Implementasi yang relevan untuk Java/Spring:
- Spring Boot service terpisah dengan inbound event consumer dari Kafka/RabbitMQ sangat cocok untuk notification orchestration.
- Scheduler seperti Quartz atau job table internal dapat dipakai untuk delayed notification / digest send.
- Template rendering bisa memakai Thymeleaf, FreeMarker, atau provider-side template tergantung kebutuhan.
- Redis berguna untuk short-term dedup, rate tracking, dan per-user mute window cache.
- Integrasi provider: SMTP/SES untuk email, Twilio untuk SMS, FCM/APNs untuk push, WebSocket/SSE untuk in-app realtime notification.
- React/frontend perlu menangani notification center, unread counter, optimistic read state, dan kemungkinan eventual consistency antara badge count dan item list.`,
    comparison: `Trade-off penting:
- Direct send from producer vs centralized notification service
  - Direct send: cepat di awal, tetapi coupling tinggi dan sulit governance.
  - Centralized service: lebih rapi, reusable, dan mudah audit, tetapi perlu event pipeline matang.

- Single queue vs per-channel queue
  - Single queue: lebih sederhana.
  - Per-channel queue: isolasi failure dan throughput control lebih baik.

- Immediate send vs digest/batch
  - Immediate: cocok untuk OTP, security alert, mention penting.
  - Digest: lebih ramah user untuk event volume tinggi seperti marketing atau social summary.

- Provider sync call vs async worker
  - Sync: mudah untuk sedikit volume, tetapi rawan latency dan retry storm.
  - Async worker: jauh lebih tahan spike dan lebih mudah diatur retry/backoff-nya.`,
    bestPractices: `Best practices yang biasanya dicari interviewer:
- Pisahkan event intake, preference evaluation, template rendering, channel dispatch, dan delivery tracking.
- Terapkan idempotency per notification intent agar event retry tidak memicu kirim ganda.
- Simpan preference user dan quiet hours sebagai policy layer yang eksplisit, bukan if-else tersembunyi di sender.
- Isolasi provider per channel dengan retry/backoff/DLQ sendiri karena failure mode email, push, dan SMS berbeda.
- Simpan audit trail minimal: siapa penerima, channel apa, template apa, status pengiriman, dan correlation id.
- Siapkan fallback channel hanya bila business case kuat; jangan spam user lintas channel tanpa aturan jelas.`,
    pitfalls: `Pitfalls / red flags:
- Producer service langsung memanggil SMTP/FCM/Twilio sendiri-sendiri, sehingga logic notifikasi tercecer di mana-mana.
- Tidak ada dedup/idempotency, jadi retry event atau provider timeout memicu spam duplikat.
- Preference user, unsubscribe, atau quiet hours dianggap detail belakangan padahal itu inti UX dan compliance.
- Semua channel diproses dalam satu worker/queue, sehingga outage email bisa menahan push yang sebenarnya sehat.
- Tidak menyimpan delivery status atau provider response, sehingga support tidak bisa menjawab “kenapa user tidak menerima notifikasi?”.
- Menganggap “sent” berarti “delivered/read”, padahal banyak channel hanya memberi status sebagian.`,
    rule: 'Anggap notification system sebagai policy engine + delivery pipeline, bukan sekadar wrapper untuk provider kirim pesan.',
    code: `Event producers
  -> Kafka topic / notification command queue
      -> Notification service
          -> preference + policy check
          -> template renderer
          -> per-channel dispatch queue
              -> email worker / push worker / SMS worker
              -> provider API
              -> delivery status + retry/DLQ

Example notification key:
notification:{userId}:{eventId}:{channel}

Rule examples:
- OTP => immediate, highest priority, SMS fallback allowed
- marketing => digest only, obey unsubscribe + quiet hours
- mention => push + in-app, email fallback optional`,
  },
  {
    id: '34',
    title: 'News Feed',
    category: 'SYSTEM DESIGN',
    section: 'system-design',
    tag: 'social-product',
    shortDesc: 'Merancang feed yang terasa cepat, relevan, dan stabil meski follower graph besar dan write/read pattern sangat tidak merata.',
    detail: `News feed adalah topik klasik karena memaksa Anda membahas graph relation, fanout, ranking, storage, cache, dan consistency UX sekaligus. Secara sederhana, problem-nya ada dua: bagaimana menulis posting baru, dan bagaimana menampilkan daftar posting yang relevan untuk tiap user. Di balik dua pertanyaan itu, ada trade-off besar antara fanout-on-write dan fanout-on-read, serta antara kronologis murni dan ranking yang lebih cerdas.

Untuk banyak interview, baseline yang aman adalah feed berbasis timeline kronologis atau semi-ranked. Saat user membuat post, sistem menyimpan post itu sebagai source of truth, lalu mendistribusikan referensinya ke feed follower, atau menyiapkan agar feed dibentuk saat dibaca. Fanout-on-write cocok untuk skenario read-heavy dan follower graph normal karena read menjadi cepat: timeline user sudah “siap saji”. Tetapi untuk user selebritas dengan jutaan follower, fanout ke semua follower saat write bisa sangat mahal. Karena itu, desain matang biasanya memadukan dua strategi: user biasa pakai fanout-on-write, akun sangat besar atau special-case pakai pull/fanout-on-read.

Engineer senior juga perlu membahas paging/cursor, cache hot feed, ranking pipeline, dan consistency yang terlihat user. Feed bukan laporan akuntansi; sedikit eventual consistency biasanya dapat diterima, tetapi duplicate item, loncatan urutan, atau unread count yang aneh akan terasa mengganggu. Karena itu, jawaban yang kuat biasanya menyebut timeline entry sebagai lightweight reference, cursor pagination stabil, dan pemisahan antara write path post creation dengan read path feed assembly/ranking.`,
    springBoot: `Sudut implementasi yang relevan:
- Spring Boot cocok untuk post service, social graph service, timeline API, dan orchestration worker, sedangkan fanout besar biasanya dibantu queue/stream seperti Kafka.
- Redis sangat berguna untuk home timeline cache, user recent feed, dan counter ringan.
- Post metadata/source of truth bisa di relational DB atau document store; timeline entry sering cukup berupa {userId, postId, score/timestamp} di store yang dioptimalkan untuk append/read.
- Search/ranking tambahan bisa masuk belakangan, jangan diasumsikan wajib dari hari pertama.
- React/frontend perlu infinite scroll, optimistic composer state, refresh behavior yang tidak menjungkirkan posisi user, dan penanganan eventual consistency pada like/comment counter.`,
    comparison: `Trade-off utama yang hampir selalu ditanya:
- Fanout-on-write vs fanout-on-read
  - Fanout-on-write: read cepat, bagus untuk mayoritas user dengan follower moderat.
  - Fanout-on-read: write lebih ringan, tetapi read lebih mahal dan kompleks.

- Chronological feed vs ranked feed
  - Chronological: sederhana, transparan, gampang dijelaskan.
  - Ranked: engagement/relevance lebih baik, tetapi scoring, experimentation, dan explainability lebih kompleks.

- Full object in timeline vs post reference only
  - Full object: read cepat, tetapi update/invalidation mahal.
  - Reference only: lebih hemat dan konsisten, tetapi perlu join/fetch tambahan saat read.

- Cache assembled feed vs assemble per request
  - Cached feed: latency bagus untuk hot users.
  - Assemble per request: lebih fleksibel, tetapi lebih berat saat traffic tinggi.`,
    bestPractices: `Best practices yang terdengar senior:
- Mulai dari feed kronologis sederhana dulu, lalu tambahkan ranking bila requirement produk memang menuntut.
- Simpan timeline sebagai reference ringan, bukan duplikasi penuh semua data post, agar update dan storage lebih terkontrol.
- Gunakan hybrid strategy untuk celebrity problem: normal users di-precompute, supernode di-pull saat read.
- Gunakan cursor pagination berbasis time/score/id agar infinite scroll stabil.
- Pisahkan post creation dari fanout dengan async pipeline; write user sebaiknya tetap cepat meski distribusi feed belum selesai total.
- Monitor lag fanout, feed generation latency, cache hit rate, dan skew follower graph.`,
    pitfalls: `Pitfalls / red flags:
- Memilih satu strategi fanout secara mutlak tanpa membahas celebrity/high-fanout edge case.
- Timeline menyimpan payload post penuh, lalu perubahan kecil pada author/profile memicu invalidation mahal di mana-mana.
- Offset pagination dipakai untuk feed yang terus berubah; hasilnya item duplicate atau terlewat saat user scroll.
- Menyatukan ranking, fanout, notification, dan counter update dalam satu transaksi sinkron saat post dibuat.
- Tidak membahas cache sama sekali padahal read path feed hampir selalu dominan.
- Mengklaim strong consistency penuh untuk seluruh feed tanpa menjelaskan biaya dan kenapa produk membutuhkannya.`,
    rule: 'Di news feed, optimalkan read experience tanpa membuat write path dan high-fanout user menjadi bom biaya.',
    code: `Post create flow:
User -> Post Service -> store post
                    -> publish PostCreated event
                    -> Fanout workers
                        -> normal followers: push post reference into home timeline
                        -> celebrity path: mark for pull-on-read

Read feed flow:
Client -> Feed API
       -> read home timeline references (Redis / timeline store)
       -> hydrate post details
       -> optional ranking / filtering
       -> return cursor-based page

Timeline entry example:
{ userId, postId, createdAt, score }`,
  },
  {
    id: '35',
    title: 'Chat System',
    category: 'SYSTEM DESIGN',
    section: 'system-design',
    tag: 'realtime',
    shortDesc: 'Mendesain chat 1:1 atau group yang terasa realtime, tahan koneksi putus, dan tetap menjaga ordering, unread state, serta delivery semantics yang masuk akal.',
    detail: `Chat system menguji banyak aspek distributed systems sekaligus: persistent connection, message delivery, ordering, fanout, storage, offline sync, presence, dan unread state. Pertanyaan interview biasanya dimulai dari chat 1:1, lalu melebar ke group chat, multi-device sync, attachments, typing indicator, dan read receipt. Kuncinya adalah membedakan jalur realtime dari jalur persistence. Pesan tidak boleh hilang hanya karena koneksi WebSocket salah satu device sedang putus.

Desain baseline yang matang biasanya memiliki gateway realtime (WebSocket atau long-lived connection), chat service untuk validasi dan persistence, message store, dan message queue/event bus untuk fanout ke device penerima. Saat sender mengirim pesan, sistem membuat message ID, menyimpan message sebagai source of truth, lalu mendorong event ke recipient session/device yang online. Jika device offline, pesan tetap tersimpan dan akan di-sync saat reconnect. Ini menjelaskan kenapa “realtime” bukan berarti semuanya hanya hidup di memory connection.

Engineer senior biasanya juga membahas ordering dan conversation model. Ordering global sempurna lintas region sangat mahal; untuk banyak produk, ordering per conversation berdasarkan server timestamp + message ID sudah cukup. Anda juga perlu membedakan delivered, received by server, displayed, dan read receipt, karena masing-masing punya arti UX dan storage yang berbeda. Untuk group chat, fanout dan unread counter menjadi lebih berat, sehingga strategi batching, per-conversation sequence, dan membership snapshot sering relevan.`,
    springBoot: `Implementasi yang relevan untuk Java/Spring:
- Spring Boot dapat menangani REST API untuk history, media metadata, conversation management, dan auth; untuk realtime, Spring WebSocket/STOMP bisa dipakai untuk baseline, meski pada skala besar banyak tim memakai gateway khusus atau protocol lain.
- Kafka/RabbitMQ berguna untuk message fanout, device notification, dan downstream indexing/analytics tanpa mengganggu send path utama.
- Redis cocok untuk presence, session mapping, ephemeral typing state, dan unread cache ringan.
- Message history/source of truth bisa disimpan di relational DB, wide-column store, atau specialized message store tergantung pola akses dan skala.
- React/frontend perlu mengelola reconnect, optimistic send state, dedup saat ack datang terlambat, scroll anchoring, unread separator, dan lazy history loading.`,
    comparison: `Trade-off desain penting:
- WebSocket vs polling/long polling
  - WebSocket: paling natural untuk realtime bidirectional.
  - Polling: lebih sederhana, tetapi boros dan UX-nya kalah untuk chat aktif.

- Persist then fanout vs fanout then persist
  - Persist then fanout: durability lebih kuat dan reasoning lebih aman.
  - Fanout then persist: latency bisa terasa cepat, tetapi rawan kehilangan consistency saat gagal.

- One global ordering vs per-conversation ordering
  - Global ordering: mahal dan biasanya tidak perlu.
  - Per-conversation ordering: jauh lebih realistis dan cukup untuk sebagian besar produk.

- Inline attachment transfer vs object storage reference
  - Inline: cepat untuk demo kecil.
  - Object storage reference: jauh lebih aman dan scalable untuk media nyata.`,
    bestPractices: `Best practices yang menunjukkan kedewasaan desain:
- Simpan message terlebih dahulu sebagai source of truth, baru lakukan realtime fanout ke device online.
- Gunakan message ID dan conversation sequence/timestamp yang jelas untuk dedup dan ordering.
- Bedakan ack level: server accepted, delivered to device, displayed, read. Jangan campur semua menjadi satu status “sent”.
- Pisahkan presence, typing indicator, dan read receipt sebagai state ephemeral/non-critical yang tidak selalu perlu konsistensi sekuat message history.
- Desain multi-device sync sejak awal: pesan yang sama bisa muncul di web, mobile, dan desktop dengan reconnect timing berbeda.
- Pastikan reconnect flow bisa replay missed messages berdasarkan last-seen cursor atau sequence.`,
    pitfalls: `Pitfalls / red flags:
- Menganggap WebSocket saja cukup tanpa storage persisten dan replay mechanism.
- Menuntut global total ordering untuk semua chat padahal biaya dan kompleksitasnya tidak sebanding dengan kebutuhan produk.
- Attachment dikirim langsung lewat app server utama tanpa object storage/CDN strategy.
- Tidak ada dedup/message ID, sehingga reconnect atau retry menghasilkan bubble ganda di UI.
- Presence dan typing dianggap sama kritisnya dengan message delivery, padahal karakter reliability-nya berbeda.
- Tidak membahas offline device, multi-device sync, atau unread state — tiga hal yang hampir pasti muncul di chat nyata.`,
    rule: 'Realtime chat yang baik selalu punya source of truth persisten; koneksi live hanya mempercepat distribusi, bukan menggantikan durability.',
    code: `Send flow:
Sender client -> WebSocket/API gateway -> Chat service
             -> validate membership/auth
             -> persist message
             -> publish MessageCreated event
             -> fanout to online recipient sessions
             -> push offline notification if needed

Reconnect flow:
Client reconnects with lastSeenSequence
  -> fetch missed messages from history store
  -> merge with local optimistic state
  -> ack delivered/read as needed

Message model (simplified):
{ messageId, conversationId, senderId, sequence, createdAt, body, status }`,
  },
];

const batch4SystemDesignSections = [
  {
    id: '36',
    title: 'Search Autocomplete System',
    category: 'SYSTEM DESIGN',
    section: 'system-design',
    tag: 'search',
    shortDesc: 'Mendesain suggestion-as-you-type yang terasa instan, hemat biaya query, dan tetap relevan walau traffic read sangat besar.',
    detail: `Search autocomplete adalah problem yang deceptively simple. User hanya mengetik beberapa huruf, lalu berharap suggestion muncul hampir seketika. Tetapi di belakang layar, sistem harus mengelola latency yang sangat ketat, query volume yang luar biasa besar, ranking suggestion, typo/prefix behavior, dan update data yang terus berjalan. Di interview, topik ini menguji pemahaman Anda tentang read-heavy system, precomputation, data structure untuk prefix lookup, dan perbedaan antara serving path cepat dengan analytics/update pipeline yang lebih longgar.

Requirement baseline biasanya mencakup: user mengetik prefix, sistem mengembalikan top-k suggestion dalam puluhan milidetik, hasil cukup relevan, dan update popularitas bisa masuk berkala tanpa mengganggu serving path. Itu langsung mengarahkan desain ke pemisahan query path dan aggregation path. Query path harus sangat ringan: ambil prefix, lookup kandidat, kembalikan top hits. Update path boleh lebih santai: hitung frekuensi pencarian, bangun ulang ranking trie/index, sinkronkan snapshot ke node serving.

Jawaban senior biasanya tidak berhenti di kata “pakai trie”. Trie memang struktur klasik yang cocok untuk prefix lookup, tetapi pada skala nyata kita juga perlu memikirkan top suggestions per node/prefix, memory footprint, warm-up strategy, multilanguage normalization, dedup, dan fallback jika cache/index belum siap. Untuk produk besar, banyak desain memilih offline/nearline aggregation: query log dikumpulkan, dibersihkan, di-rank, lalu dipublikasikan sebagai snapshot ke autocomplete servers. Dengan begitu, jalur baca tetap cepat dan stabil meski data popularity terus berubah.`,
    springBoot: `Sudut implementasi yang relevan:
- Spring Boot sangat cocok untuk API gateway layer, query service, analytics ingestion API, dan admin/rebuild orchestration.
- Untuk serving path, Java service biasanya membaca index/trie snapshot dari memory atau Redis/search store ringan, bukan menghitung ranking berat per request.
- Kafka atau queue membantu mengumpulkan search events untuk perhitungan frekuensi, typo stats, dan trending terms.
- Redis dapat dipakai untuk hot prefix cache atau top-k cache, tetapi jangan jadikan satu-satunya source ranking jika update modelnya lebih kompleks.
- Di frontend React, debounce input, cancellation request, stale-result protection, dan keyboard navigation adalah bagian UX yang wajib disebut jika interviewer menyinggung end-to-end flow.`,
    comparison: `Trade-off utama:
- Trie vs relational query LIKE 'prefix%'
  - Trie/index prefix: latency jauh lebih baik untuk read-heavy autocomplete.
  - SQL LIKE: cepat untuk demo kecil, tetapi biasanya kalah di scale dan ranking fleksibilitas.

- Real-time ranking update vs batch/nearline update
  - Real-time: lebih segar, tetapi write path dan operasional jauh lebih mahal.
  - Batch/nearline: lebih sederhana dan stabil, sering cukup untuk sebagian besar produk.

- Full-text search engine vs dedicated autocomplete structure
  - Search engine: kaya fitur, cocok jika search stack sudah ada.
  - Dedicated structure: lebih ringan dan optimal untuk prefix top-k specific use case.

- Global popularity vs personalized suggestion
  - Global: lebih mudah dibangun dan cukup kuat di awal.
  - Personalized: lebih relevan, tetapi butuh profile/history feature dan privacy discipline.`,
    bestPractices: `Best practices yang memberi kesan senior:
- Pisahkan serving path super cepat dari analytics/rebuild path yang lebih berat.
- Precompute top-k suggestion untuk prefix populer; jangan ranking penuh dari nol di setiap keypress.
- Normalisasi input: lowercase, unicode handling, whitespace cleanup, mungkin typo/synonym policy bila requirement menuntut.
- Gunakan debounce di client dan cancellation di backend/frontend agar sistem tidak didera request yang sebenarnya sudah basi.
- Definisikan jelas apa yang dioptimalkan: relevansi global, trending, freshness, atau personalization; masing-masing mengubah desain.
- Untuk skala besar, pikirkan snapshot distribution, memory usage, dan startup warm-up autocomplete servers.`,
    pitfalls: `Pitfalls / red flags:
- Semua request keypress langsung menghantam database utama dengan LIKE query tanpa cache atau index khusus.
- Menganggap trie saja cukup tanpa membahas ranking/top-k dan memory trade-off.
- Memaksa update popularity real-time sinkron di jalur query, sehingga latency autocomplete ikut naik.
- Tidak membahas debounce, cancellation, atau stale responses, padahal UX autocomplete sangat sensitif terhadap hasil yang datang terlambat.
- Tidak ada strategi untuk query kosong, spam traffic, atau prefix yang sangat populer/hot.
- Mengabaikan quality issues seperti typo, offensive term filtering, atau locale normalization jika produk publik.`,
    rule: 'Autocomplete yang baik menang karena serving path-nya sangat ringan; ranking dan pembelajaran query sebaiknya dipindahkan ke pipeline terpisah.',
    code: `Serving path:
User types "jav"
  -> API /autocomplete?q=jav
  -> prefix lookup in memory / cache / trie snapshot
  -> return top 5 suggestions in < 100 ms

Update path:
Search events -> Kafka / log stream
             -> aggregate counts + trends
             -> rebuild top-k prefix index snapshot
             -> publish snapshot to autocomplete servers

Simple mental model:
Trie node(prefix="jav") => ["java", "javascript", "java spring boot", ...]`,
  },
  {
    id: '37',
    title: 'YouTube',
    category: 'SYSTEM DESIGN',
    section: 'system-design',
    tag: 'media-platform',
    shortDesc: 'Merancang platform video yang menuntut upload besar, transcoding berat, streaming global, dan metadata/search yang tetap responsif.',
    detail: `Desain ala YouTube memaksa Anda memisahkan beberapa problem besar yang sering tercampur oleh kandidat: upload video, penyimpanan asli, transcoding ke banyak format, distribusi lewat CDN, playback metadata, engagement counters, dan recommendation/search yang sebaiknya tidak masuk critical path awal. Interviewer biasanya tidak menuntut Anda membangun seluruh ekosistem YouTube sekaligus. Yang lebih penting adalah apakah Anda mampu membagi problem menjadi jalur ingest, processing, serving, dan supporting services dengan trade-off yang masuk akal.

Upload path sendiri sudah cukup kaya. Video file besar tidak ideal melewati app server monolith sebagai one-shot upload. Desain yang matang biasanya memakai resumable/multipart upload ke object storage, lalu metadata service mencatat status video. Setelah upload selesai, event dipublikasikan ke processing pipeline untuk transcoding: menghasilkan beberapa resolusi dan bitrate agar adaptive streaming berjalan baik di jaringan berbeda. Hasil transcode lalu disimpan kembali ke object storage dan didistribusikan via CDN.

Read path untuk playback jauh lebih ringan secara logika aplikasi, tetapi berat secara bandwidth global. Karena itu, metadata API dan stream file path sebaiknya dipisahkan secara jelas. App service mengembalikan metadata video, playback manifest, permission/basic auth check, dan mungkin signed URL. File segment video sendiri idealnya dilayani object storage + CDN, bukan langsung dari service backend. Engineer senior juga akan menyinggung eventual consistency pada processing state: video baru di-upload belum tentu langsung playable; UI harus tahu status uploaded, processing, ready, failed.`,
    springBoot: `Sudut implementasi yang relevan:
- Spring Boot cocok untuk metadata service, upload session API, video catalog, comment/like API, dan orchestration workflow.
- Direct-to-object-storage upload (pre-signed URL) lebih sehat daripada mem-bounce file besar melalui backend utama.
- Kafka/RabbitMQ sangat pas untuk memicu transcoding jobs, thumbnail generation, moderation, dan analytics ingestion.
- Worker transcoding biasanya komputasinya berat dan terpisah dari API service; jangan campur dengan thread pool request normal.
- React/frontend perlu progress upload, resume support, processing state UI, adaptive player integration, dan fallback saat video belum ready.
- Jika interviewer menanyakan Java angle, Anda bisa menyebut Spring Boot untuk control plane, bukan untuk serving byte-range video secara langsung di skala global.`,
    comparison: `Trade-off penting:
- Proxy upload via app server vs direct upload to object storage
  - Proxy via app server: mudah untuk demo awal, tetapi mahal dan rapuh di skala file besar.
  - Direct upload: lebih scalable dan murah, meski flow auth/session sedikit lebih kompleks.

- Store one original only vs pre-transcode many renditions
  - Original only: hemat processing awal, tetapi playback jadi buruk di device/jaringan beragam.
  - Many renditions: biaya processing/storage naik, tetapi UX streaming jauh lebih baik.

- Serve video from app service vs CDN/object storage
  - App service: kontrol mudah, tetapi sangat tidak efisien untuk bandwidth global.
  - CDN/object storage: standar praktis untuk media delivery skala besar.

- Synchronous post-upload processing vs async pipeline
  - Sync: tampak sederhana, tetapi user menunggu terlalu lama dan backend cepat penuh.
  - Async: lebih realistis dan isolasi failure lebih baik.`,
    bestPractices: `Best practices yang terdengar matang:
- Pisahkan control plane (metadata, auth, workflow) dari data plane (video bytes/segments delivery).
- Pakai resumable or multipart upload untuk file besar dan jaringan mobile yang tidak stabil.
- Jadikan transcoding pipeline asynchronous, idempotent, dan retryable per job/stage.
- Simpan status lifecycle video dengan jelas: uploaded, virus/moderation pending, transcoding, ready, failed.
- Gunakan CDN untuk playback path dan cache manifest/thumbnail secara agresif.
- Jangan paksakan recommendation, live streaming, dan ads system ke desain baseline kecuali interviewer memang mengarah ke sana.`,
    pitfalls: `Pitfalls / red flags:
- Video file besar lewat satu endpoint Spring Boot biasa lalu disimpan ke local disk instance.
- Upload selesai dianggap video langsung siap diputar tanpa membahas transcoding, thumbnails, atau processing lag.
- File streaming dijadikan tanggung jawab langsung backend app alih-alih storage + CDN.
- Tidak ada resume/chunk strategy, sehingga upload 2 GB gagal total saat jaringan putus di 95%.
- Metadata, binary file, analytics, dan recommendation semua dicampur dalam satu service mental model.
- Mengabaikan cost bandwidth/storage padahal itu inti platform video.`,
    rule: 'Pada platform video, backend aplikasi sebaiknya mengelola metadata dan workflow; bytes video besar harus dipindahkan ke object storage, processing workers, dan CDN.',
    code: `Upload flow:
Client -> create upload session
      -> get pre-signed multipart URLs
      -> upload chunks directly to object storage
      -> notify upload complete
      -> publish VideoUploaded event
      -> transcoding workers create 360p/720p/1080p + thumbnails
      -> CDN serves playback assets when ready

Playback flow:
Client -> GET /videos/{id}
      -> metadata service returns title, status, manifest URL
      -> player fetches HLS/DASH manifest via CDN
      -> CDN serves video segments`,
  },
  {
    id: '38',
    title: 'Google Drive',
    category: 'SYSTEM DESIGN',
    section: 'system-design',
    tag: 'storage-sync',
    shortDesc: 'Mendesain file storage + sync lintas device yang menyeimbangkan upload besar, versioning, sharing, dan konsistensi sinkronisasi.',
    detail: `Google Drive-style system bukan cuma tempat menyimpan file. Problem utamanya adalah sinkronisasi file dan metadata lintas banyak device sambil tetap mendukung upload/download besar, folder hierarchy, sharing permission, version history, deduplication tertentu, dan conflict handling saat dua device mengubah keadaan hampir bersamaan. Interview topik ini menguji kemampuan Anda memisahkan metadata plane dari blob storage plane, serta memahami bahwa sync engine dan permission model sering sama pentingnya dengan upload/download itu sendiri.

Desain baseline yang sehat biasanya dimulai dari metadata service + object storage. File binary disimpan di blob/object storage, sedangkan metadata service menyimpan file id, owner, parent folder, version, checksum, size, sharing ACL, dan logical state seperti deleted/trashed. Kenapa dipisah? Karena operasi metadata jauh lebih sering dan lebih kecil daripada transfer file itu sendiri. Rename file, move folder, share link, atau change permission seharusnya tidak memaksa kita memindahkan blob besar.

Bagian yang membuat jawaban senior terasa matang adalah sync. Banyak kandidat hanya berhenti di “upload file ke storage”. Padahal pengalaman Google Drive hidup dari kemampuan client mendeteksi perubahan lokal, upload delta atau file baru, menyinkronkan metadata, menerima perubahan remote, dan menyelesaikan conflict. Anda tidak harus merancang block-level diff sedetail Dropbox jika requirement tidak meminta, tetapi bagus bila Anda menyebut version number/change log, sync token/cursor, dan conflict policy seperti last-writer-wins yang hati-hati atau duplicate conflict copy. Untuk dokumen kolaboratif realtime, problem-nya bahkan naik kelas menjadi OT/CRDT; untuk baseline Drive, cukup akui itu sebagai scope lanjutan terpisah.`,
    springBoot: `Sudut implementasi yang relevan:
- Spring Boot sangat cocok untuk metadata API, sharing/permission service, change-log API, upload session orchestration, dan admin/audit flows.
- File besar sebaiknya diunggah langsung ke object storage dengan upload session/chunking, bukan melewati service utama seluruhnya.
- Database relasional sering nyaman untuk metadata dan ACL karena query transactional-nya jelas; object storage untuk blob.
- Kafka/queue dapat dipakai untuk virus scan, thumbnail/preview generation, OCR/indexing, and change notifications.
- Redis berguna untuk hot metadata cache atau short-lived upload session state.
- Frontend/desktop/mobile clients perlu background sync engine, retry, local change journal, optimistic rename/move, dan UI conflict resolution yang jelas.`,
    comparison: `Trade-off utama:
- Metadata + blob separation vs one giant file table/store mental model
  - Separation: lebih scalable dan operasionalnya sehat.
  - Giant combined model: tampak mudah di awal, tetapi cepat sulit di-scale dan diquery.

- Whole-file sync vs chunked/delta sync
  - Whole-file: sederhana, cocok baseline awal.
  - Chunked/delta: hemat bandwidth untuk file besar/sering berubah, tetapi jauh lebih kompleks.

- Strong consistency for metadata vs eventual for secondary processing
  - Metadata share/rename/delete sering butuh perilaku lebih kuat dan jelas.
  - Preview/indexing/thumbnail biasanya boleh eventual.

- Inline permission check in storage path vs signed URL/access token model
  - Inline app checks: simpel, tetapi bisa membebani path download.
  - Signed URL/tokenized access: lebih scalable untuk file serving.`,
    bestPractices: `Best practices yang terdengar senior:
- Pisahkan metadata service dari blob storage sejak awal.
- Gunakan upload session + chunking untuk reliability file besar dan resume upload.
- Simpan version/change log agar client bisa sync incremental, bukan full rescan terus-menerus.
- Jelaskan conflict strategy secara eksplisit; “nanti disinkronkan” bukan jawaban cukup untuk multi-device system.
- Bedakan clearly antara personal file sync, shared folder ACL, dan realtime collaborative docs — ketiganya berbeda tingkat kompleksitas.
- Gunakan async workers untuk preview, virus scan, OCR, and search indexing agar upload path tetap cepat.`,
    pitfalls: `Pitfalls / red flags:
- File binary disimpan langsung sebagai blob besar di database utama tanpa alasan kuat.
- Rename/move/share dianggap operasi file content, padahal seharusnya hanya metadata mutation.
- Tidak ada concept version, change token, atau conflict handling untuk sinkronisasi banyak device.
- App server dijadikan jalur utama download/upload file besar alih-alih signed URL/object storage.
- Menggabungkan file sync system dengan collaborative document editor seolah problem-nya identik.
- Tidak membahas delete/trash/recovery, padahal itu sangat natural untuk produk drive/storage.`,
    rule: 'Untuk sistem seperti Google Drive, metadata sync dan permission model sama pentingnya dengan penyimpanan file; blob transfer sebaiknya dipisahkan dari kontrol aplikasi.',
    code: `Upload/sync flow:
Client -> create upload session
      -> upload chunks to object storage
      -> commit file version metadata
      -> append change-log event
      -> async preview / virus scan / indexing

Device sync flow:
Client sends lastSyncToken
  -> metadata service returns changed files/folders since token
  -> client downloads/uploads only affected items
  -> resolve conflicts by version/checksum policy

Core metadata example:
{ fileId, ownerId, parentId, version, checksum, size, mimeType, permission, status }`,
  },
  {
    id: '39',
    title: 'The Learning Continues',
    category: 'SYSTEM DESIGN',
    section: 'system-design',
    tag: 'meta-learning',
    shortDesc: 'Wrap-up cara belajar system design supaya bukan sekadar hafal solusi, tetapi makin tajam dalam berpikir requirement, trade-off, dan evolusi sistem.',
    detail: `Bagian penutup seperti ini penting justru karena banyak orang belajar system design dengan cara yang kurang efektif: menghafal diagram final tanpa memahami mengapa komponen itu muncul, kapan ia dibutuhkan, dan biaya operasional apa yang ikut datang. “The learning continues” seharusnya menggeser fokus dari koleksi jawaban ke pola berpikir. Interviewer senior biasanya bisa membedakan kandidat yang hafal desain Alex Xu-style dari kandidat yang benar-benar paham perjalanan keputusan di baliknya.

Pola belajar yang paling berguna adalah berulang-ulang mengurai satu problem melalui pertanyaan yang sama: requirement apa yang paling penting, angka kasarnya berapa, bottleneck utamanya di read atau write, apa failure mode paling berbahaya, data mana yang butuh consistency kuat, apa yang boleh eventual, dan bagian mana yang sebaiknya asynchronous. Dengan kerangka itu, Anda bisa menyesuaikan jawaban meski soal berganti dari news feed ke Google Drive atau dari chat ke YouTube.

Di dunia kerja nyata, belajar system design juga tidak berhenti di interview. Anda belajar dari incident review, latency regression, cost spike, migration yang gagal, retry storm, schema evolution, dan observability gap. Itu sebabnya section penutup yang baik tetap konkret: baca desain orang lain, gambar ulang dengan asumsi berbeda, lakukan back-of-the-envelope estimation, tulis trade-off, lalu kaitkan ke stack yang benar-benar Anda pakai seperti Spring Boot, React, Postgres, Redis, Kafka, object storage, dan CDN.`,
    springBoot: `Cara membumikan pembelajaran ke praktik harian:
- Ambil satu service Spring Boot yang sudah Anda punya, lalu petakan read path, write path, bottleneck, dependency, timeout, retry, dan observability-nya.
- Latih diri mengubah requirement: “bagaimana jika traffic 10x?”, “bagaimana jika file upload besar?”, “bagaimana jika harus multi-region?”, “bagaimana jika partner API suka retry?”
- Dari sisi frontend React, biasakan memikirkan dampak sistem design ke UX: loading state, eventual consistency, pagination, retry UX, optimistic update, dan offline/reconnect behavior.
- Review insiden produksi atau postmortem nyata; itu sering lebih mendidik daripada 20 diagram yang hanya indah di papan tulis.`,
    comparison: `Perbandingan pendekatan belajar:
- Hafalan solusi akhir vs latihan kerangka berpikir
  - Hafalan: cepat untuk jangka pendek, rapuh saat requirement digeser.
  - Kerangka berpikir: lebih tahan saat interviewer mengubah scale, consistency, atau product constraints.

- Fokus komponen vs fokus trade-off
  - Fokus komponen: mudah terdengar canggih, tetapi dangkal.
  - Fokus trade-off: lebih senior dan lebih transferable.

- Belajar dari buku saja vs belajar dari incident nyata
  - Buku: bagus untuk pola umum.
  - Incident nyata: mengajarkan operability, failure mode, dan biaya keputusan yang sesungguhnya.

- Single-stack thinking vs end-to-end thinking
  - Single-stack: nyaman tapi sempit.
  - End-to-end: lebih realistis untuk full-stack / senior interview.`,
    bestPractices: `Best practices untuk terus berkembang:
- Pakai satu framework jawaban konsisten: clarify, estimate, design, bottleneck, trade-off, ops.
- Setelah membaca satu desain, coba redraw dalam versi “lebih sederhana” dan versi “lebih besar”; itu melatih sense evolusi sistem.
- Simpan catatan per topik dalam format yang sama seperti app ini: overview, API/data model, trade-off, pitfalls, aturan praktis.
- Biasakan menyebut angka, bukan hanya kata “besar” atau “tinggi”.
- Hubungkan design decisions ke developer experience, operability, dan product UX, bukan cuma ke diagram arsitektur.
- Kalau menemui teknologi baru, tanyakan dulu problem apa yang ia pecahkan sebelum mengaguminya.`,
    pitfalls: `Pitfalls / red flags saat belajar system design:
- Mengoleksi terlalu banyak diagram tanpa benar-benar melatih penjelasan lisan yang runtut.
- Menghafal “jawaban populer” seperti Kafka, sharding, microservices, CDN, tanpa tahu trigger kapan ia diperlukan.
- Tidak pernah membuat estimasi kasar, sehingga semua keputusan terasa abstrak.
- Melihat system design murni sebagai backend problem dan lupa dampaknya ke frontend/user experience.
- Tidak mengevaluasi trade-off biaya dan operasional; seolah semua komponen canggih gratis dan mudah dijaga.
- Belajar hanya happy path tanpa failure mode, observability, dan recovery plan.`,
    rule: 'Tujuan belajar system design bukan menghafal arsitektur favorit, tetapi membangun kebiasaan berpikir bertahap, terukur, dan sadar trade-off.',
    code: `Practical study loop:
1. Pick one system (chat, drive, feed, payments)
2. Clarify requirements in 2-3 minutes
3. Estimate traffic/storage quickly
4. Draw baseline design first
5. Add one constraint at a time (scale, consistency, multi-region, realtime)
6. Note bottlenecks, trade-offs, and failure modes
7. Rewrite in your own words
8. Repeat later without notes

Interview self-check:
- Did I clarify assumptions?
- Did I give rough numbers?
- Did I explain why each component exists?
- Did I mention failure modes and operations?
- Did I keep the design incremental?`,
  },
];

const interviewSections = [
  {
    id: '21',
    title: 'Backend Senior Best Practices',
    category: 'INTERVIEW KIT',
    section: 'interview-kit',
    tag: 'senior',
    shortDesc: 'Checklist pola pikir dan praktik produksi untuk engineer backend Spring Boot level senior.',
    detail: `Di level senior backend, interviewer biasanya tidak hanya menilai apakah Anda bisa membuat endpoint, tetapi apakah Anda bisa menjaga sistem tetap sehat saat traffic naik, requirement berubah, dan tim membesar.\n\nJawaban yang kuat biasanya mencakup boundary yang jelas antara controller-service-repository, validasi di layer yang tepat, observability, transaction management, graceful error handling, security yang realistis, dan strategi testing yang bisa dipercaya.\n\nEngineer senior juga diharapkan mampu membahas non-functional requirements: latency, throughput, resilience, operability, rollback, dan evolusi kontrak API tanpa merusak klien lama.`,
    springBoot: `Praktik yang sangat kuat untuk disebut saat interview:\n- Gunakan DTO terpisah dari entity.\n- Terapkan global exception handling dengan ProblemDetail / error schema konsisten.\n- Tambahkan metrics, tracing, correlation-id, dan log terstruktur.\n- Gunakan transaction boundary yang eksplisit dan hindari logic berat di controller.\n- Lindungi dependency eksternal dengan timeout, retry yang bijak, circuit breaker, dan fallback yang masuk akal.\n- Bedakan validation error, business rule violation, dan technical failure.\n- Gunakan Testcontainers untuk integration test nyata dengan database/message broker.`,
    comparison: `Perbandingan jawaban biasa vs jawaban senior:\n- Biasa: “Saya pakai Spring Boot karena cepat bikin REST API.”\n- Senior: “Saya pilih Spring Boot karena ekosistemnya matang untuk security, observability, testing, dan integrasi enterprise; lalu saya batasi kompleksitas dengan layering yang jelas dan kontrak DTO yang stabil.”\n\n- Biasa: “Saya tambahkan retry.”\n- Senior: “Retry saya pasang selektif hanya untuk operasi idempotent atau aman diulang, dengan timeout dan circuit breaker agar tidak memperparah incident.”`,
    bestPractices: `Senior backend best practices:\n- Jelaskan trade-off, bukan slogan.\n- Selalu pikirkan failure mode.\n- Bedakan sync vs async berdasarkan karakter proses.\n- Desain API untuk tim dan masa depan, bukan cuma untuk hari ini.\n- Gunakan data, metrics, dan log untuk membuktikan health sistem.`,
    pitfalls: `Pitfalls backend yang sering jadi red flag saat interview:\n- Semua business logic ditaruh di controller.\n- Entity JPA langsung diexpose ke API.\n- Retry dipasang tanpa memikirkan idempotency.\n- Security dibahas terlalu dangkal, misalnya hanya “pakai JWT”.\n- Tidak bisa menjelaskan bagaimana debugging incident dilakukan di production.`,
    rule: 'Senior backend engineer harus bisa menjelaskan bagaimana sistem gagal, dipantau, dipulihkan, dan dievolusikan.',
    code: `// Contoh boundary yang sehat\n@RestController\n@RequiredArgsConstructor\nclass OrderController {\n  private final OrderApplicationService service;\n\n  @PostMapping("/api/v1/orders")\n  ResponseEntity<OrderResponse> create(@Valid @RequestBody CreateOrderRequest req) {\n\n    return ResponseEntity.status(201).body(service.create(req));\n  }\n}\n\n@Service\nclass OrderApplicationService {\n  @Transactional\n  public OrderResponse create(CreateOrderRequest req) { ... }\n}`,
  },
  {
    id: '22',
    title: 'Frontend Senior Best Practices',
    category: 'INTERVIEW KIT',
    section: 'interview-kit',
    tag: 'senior',
    shortDesc: 'Pola pikir senior React developer saat mengonsumsi API, mengelola state, dan membangun UI yang tahan perubahan.',
    detail: `Di sisi frontend, level senior bukan hanya soal bisa membuat komponen React, tetapi soal bagaimana membangun UI yang maintainable, mudah diuji, cepat, dan tahan terhadap perubahan backend.\n\nUntuk proyek full stack, penting menunjukkan bahwa frontend tidak hidup sendirian. Contract API, loading model, error model, caching strategy, dan auth flow harus dipahami sebagai satu sistem utuh.\n\nInterviewer biasanya tertarik pada cara Anda membagi state server vs state UI, menangani race condition, membangun error boundary, mengoptimalkan rendering, dan menyusun folder/module yang tidak cepat membusuk.`,
    springBoot: `Kaitannya dengan backend Spring Boot:\n- Frontend harus mengandalkan kontrak API yang stabil dan terdokumentasi.\n- Gunakan typed client / schema validation bila perlu.\n- Selaraskan error format backend agar UI bisa menampilkan pesan dengan konsisten.\n- Pahami pagination, optimistic update, auth token refresh, dan caching yang berasal dari desain API backend.\n- Jika backend memakai ETag/pagination/versioning, frontend senior harus tahu cara memanfaatkannya.`,
    comparison: `Perbandingan pendekatan frontend:\n- useEffect manual fetching vs React Query / TanStack Query\n  - useEffect manual: cepat untuk demo kecil, tapi mudah berantakan.\n  - React Query: lebih matang untuk caching, dedup, refetch, status loading/error.\n\n- Global state semua di Redux vs pemisahan state yang sehat\n  - Semua di Redux: sering overkill.\n  - Pisahkan server state, UI state, dan local component state.\n\n- Form manual vs react-hook-form\n  - Manual: fleksibel tapi verbose.\n  - react-hook-form: efisien dan cocok untuk validasi form kompleks.`,
    bestPractices: `Senior frontend best practices:\n- Bedakan server state dan client/UI state.\n- Bangun loading, empty, error, dan success states secara eksplisit.\n- Hindari prop drilling berlebihan; gunakan composition atau state management secukupnya.\n- Optimalkan re-render hanya bila ada masalah nyata, bukan premature optimization.\n- Integrasikan observability frontend: error reporting, performance tracing, dan monitoring UX.`,
    pitfalls: `Pitfalls frontend yang sering terlihat kurang senior:\n- Semua fetching dilakukan manual tanpa pattern konsisten.\n- Error handling hanya console.log.\n- State terlalu tersebar dan sulit ditelusuri.\n- Component terlalu besar dan memegang terlalu banyak tanggung jawab.\n- Tidak memikirkan accessibility, responsiveness, dan skeleton/loading UX.`,
    rule: 'Frontend senior bukan sekadar “bisa React”, tetapi mampu menjaga kompleksitas UI tetap terkendali seiring skala produk bertambah.',
    code: `// Contoh server-state handling yang lebih matang\nconst { data, isLoading, error } = useQuery({\n  queryKey: ['users', filters],\n  queryFn: () => api.getUsers(filters),\n});\n\nif (isLoading) return <UsersSkeleton />;\nif (error) return <ErrorState message="Gagal memuat data" />;\nif (!data?.length) return <EmptyState />;\n\nreturn <UsersTable data={data} />;`,
  },
  {
    id: '23',
    title: 'Senior Interview Questions',
    category: 'INTERVIEW KIT',
    section: 'interview-kit',
    tag: 'interview',
    shortDesc: 'Contoh pertanyaan interview senior backend/frontend beserta arah jawaban yang kuat.',
    detail: `Section ini dirancang sebagai bahan latihan berpikir, bukan hafalan. Kuncinya adalah menjawab dengan struktur: konteks -> trade-off -> keputusan -> risiko -> mitigasi.\n\nContoh area yang sering ditanya:\n- Bagaimana mendesain API untuk backward compatibility?\n- Kapan memilih sync vs async processing?\n- Bagaimana menangani retry tanpa duplicate side effect?\n- Bagaimana frontend mengelola server state dan error state?\n- Bagaimana Anda menyelidiki incident performa di production?\n- Kapan modular monolith lebih baik daripada microservices?\n- Bagaimana mendesain auth/authz untuk multi-tenant system?`,
    springBoot: `Cara menjawab dengan nuansa Spring Boot + React:\n- Sebutkan boundary dan alat yang relevan: Spring Security, @ControllerAdvice, Redis, Kafka, React Query, Error Boundary, dsb.\n- Kaitkan jawaban ke skenario produksi nyata.\n- Tunjukkan bahwa Anda paham end-to-end flow dari browser sampai database/downstream service.\n- Jangan jawab generik; beri contoh incident, trade-off, atau pola implementasi.`,
    comparison: `Perbandingan jawaban lemah vs kuat:\n- Lemah: “Saya pakai microservices biar scalable.”\n- Kuat: “Saya akan mulai dari modular monolith jika domain dan tim belum cukup besar; microservices saya pilih bila ada kebutuhan deployment independence, ownership tim yang jelas, dan observability yang cukup matang.”\n\n- Lemah: “Saya handle error pakai try-catch.”\n- Kuat: “Saya bedakan validation, domain, dan technical exceptions; lalu saya map ke status code dan payload error konsisten supaya frontend dan monitoring bisa merespons dengan tepat.”`,
    bestPractices: `Tips latihan interview:\n- Gunakan pola jawaban STAR atau Context-Decision-Tradeoff.\n- Sertakan pengalaman nyata jika ada.\n- Jika tidak pernah mengalami kasusnya, jawab dengan desain yang masuk akal dan jelaskan asumsi.\n- Latih kemampuan menggambar flow: client -> gateway -> service -> DB -> queue -> callback.\n- Biasakan menyebut observability, security, dan rollback plan.`,
    pitfalls: `Kesalahan umum saat interview senior:\n- Jawaban terlalu normatif tanpa trade-off.\n- Mengklaim teknologi sebagai obat semua masalah.\n- Tidak bisa menjelaskan konsekuensi operasional dari pilihan arsitektur.\n- Fokus ke kode kecil, lupa ke sistem dan tim.\n- Tidak menghubungkan backend decision ke frontend impact atau sebaliknya.`,
    rule: 'Jawaban senior yang bagus hampir selalu punya konteks, trade-off, failure mode, dan mitigasi.',
    code: `// Struktur jawaban interview yang kuat\n1. Jelaskan konteks dan asumsi\n2. Berikan 2-3 opsi yang mungkin\n3. Pilih satu dan jelaskan trade-off\n4. Bahas risiko/failure mode\n5. Sebut mitigasi dan observability\n6. Jelaskan dampak ke backend + frontend`,
  },
];

const allConcepts = [...apiConcepts, ...coreSystemDesignConcepts, ...systemDesignSections, ...batch3SystemDesignSections, ...batch4SystemDesignSections, ...interviewSections].map(enrichConcept);

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button className="code-copy" onClick={handleCopy}>
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied ? 'Copied' : 'Copy code'}
    </button>
  );
}

function InfoSection({ title, content, tone = 'default' }) {
  return (
    <section className={`info-section ${tone}`}>
      <h4>{title}</h4>
      <div className="detail">{content}</div>
    </section>
  );
}

function ArchitectureDiagram({ diagram, title }) {
  if (!diagram) return null;

  return (
    <figure className="architecture-diagram">
      <div className="architecture-diagram-head">
        <span>Diagram arsitektur</span>
        <strong>{title}</strong>
      </div>
      <img src={diagram.src} alt={`Diagram ${title}`} loading="lazy" />
      <figcaption>{diagram.caption}</figcaption>
    </figure>
  );
}

function getInterviewLens(item) {
  if (item.section === 'system-design-core') {
    return 'Jelaskan pilihan berdasarkan workload, SLO, failure mode, dan biaya operasional—bukan berdasarkan popularitas teknologi.';
  }
  if (item.section === 'system-design') {
    return 'Saat ditanya system design, mulailah dari requirement, estimasi kasar, baseline architecture, lalu jelaskan bottleneck dan trade-off.';
  }
  if (item.section === 'interview-kit') {
    return 'Jangan jawab seperti daftar istilah. Strukturkan jawaban: konteks, opsi, keputusan, risiko, dan mitigasi.';
  }
  if (item.section === 'security') {
    return 'Pembeda senior ada pada trade-off operasional: rotation, revocation, auditability, blast radius, dan boundary enforcement.';
  }
  if (item.section === 'reliability') {
    return 'Interviewer biasanya mencari failure mode: retry, timeout, fairness, duplicate side effect, dan dampak ke kapasitas sistem.';
  }
  return 'Bawa diskusi ke alasan desain, konsistensi kontrak, dan dampaknya ke client serta operasional sistem.';
}

function getReadingTime(item) {
  const wordCount = [item.detail, item.springBoot, item.comparison, item.bestPractices, item.pitfalls]
    .filter(Boolean)
    .join(' ')
    .trim()
    .split(/\s+/).length;

  return Math.max(2, Math.round(wordCount / 220));
}

export default function App() {
  const [selectedSectionId, setSelectedSectionId] = useState(learningSections[0].id);
  const [selectedId, setSelectedId] = useState(allConcepts[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filteredConcepts = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return allConcepts;

    return allConcepts.filter((item) => {
      const blob = [
        item.title,
        item.shortDesc,
        item.detail,
        item.category,
        item.tag,
        item.bestPractices,
        item.pitfalls,
        item.rule,
      ]
        .join(' ')
        .toLowerCase();
      return blob.includes(term);
    });
  }, [query]);

  const itemsBySection = useMemo(() => {
    return learningSections.reduce((acc, section) => {
      acc[section.id] = filteredConcepts.filter((item) => item.section === section.id);
      return acc;
    }, {});
  }, [filteredConcepts]);

  const visibleSections = useMemo(
    () => learningSections.filter((section) => itemsBySection[section.id]?.length),
    [itemsBySection],
  );

  useEffect(() => {
    if (!visibleSections.some((section) => section.id === selectedSectionId)) {
      setSelectedSectionId(visibleSections[0]?.id ?? learningSections[0].id);
    }
  }, [visibleSections, selectedSectionId]);

  const activeSectionItems = itemsBySection[selectedSectionId] ?? [];

  useEffect(() => {
    if (!activeSectionItems.some((item) => item.id === selectedId)) {
      setSelectedId(activeSectionItems[0]?.id ?? filteredConcepts[0]?.id ?? allConcepts[0].id);
    }
  }, [activeSectionItems, selectedId, filteredConcepts]);

  const selected = filteredConcepts.find((item) => item.id === selectedId) ?? activeSectionItems[0] ?? allConcepts[0];
  const activeSection = learningSections.find((section) => section.id === selected.section) ?? learningSections[0];
  const selectedIndexInSection = Math.max(0, activeSectionItems.findIndex((item) => item.id === selected.id)) + 1;
  const readingTime = getReadingTime(selected);
  const interviewLens = getInterviewLens(selected);
  const architectureDiagram = coreSystemDesignDiagrams[selected.id];
  const nextTopic = activeSectionItems[selectedIndexInSection] ?? null;

  useEffect(() => {
    if (!sidebarOpen) return undefined;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [sidebarOpen]);

  return (
    <div className="app-shell">
      {sidebarOpen && <button className="sidebar-overlay" aria-label="Close menu overlay" onClick={() => setSidebarOpen(false)} />}
      <div className="app">
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="brand">
            <div className="brand-badge"><Lightbulb size={22} /></div>
            <div>
              <h1>Senior Full Stack Guide</h1>
              <p>Spring Boot + React roadmap untuk belajar konsep, trade-off, dan jawaban interview level senior.</p>
            </div>
            <button className="icon-btn sidebar-close" onClick={() => setSidebarOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="search-box">
            <Search size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari topik, mis. cache, auth, rate limit"
            />
          </div>

          <div className="sidebar-block compact">
            <div className="sidebar-label">Browse by track</div>
            <div className="track-list-mini">
              {visibleSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    className={`track-mini ${selected.section === section.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedSectionId(section.id);
                      setSelectedId(itemsBySection[section.id][0].id);
                      setSidebarOpen(false);
                    }}
                  >
                    <span className="track-mini-icon"><Icon size={15} /></span>
                    <span>
                      <strong>{section.title}</strong>
                      <small>{itemsBySection[section.id].length} topics</small>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="sidebar-block compact">
            <div className="sidebar-label">Current track</div>
            <div className="nav-list">
              {activeSectionItems.map((item) => (
                <button
                  key={item.id}
                  className={`nav-item ${item.id === selected.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedId(item.id);
                    setSidebarOpen(false);
                  }}
                >
                  <span className="nav-title">{item.id}. {item.title}</span>
                  <span className="nav-desc">{item.shortDesc}</span>
                </button>
              ))}
              {!activeSectionItems.length && <div className="empty-mini">Tidak ada hasil untuk pencarian ini.</div>}
            </div>
          </div>
        </aside>

        <main className="content">
          <div className="topbar">
            <button className="icon-btn" aria-label="Buka navigasi materi" onClick={() => setSidebarOpen(true)}>
              <Menu size={18} />
            </button>
            <div className="mobile-topic-context">
              <strong>{selected.id}. {selected.title}</strong>
              <small>{selectedIndexInSection}/{activeSectionItems.length} · ~{readingTime} menit</small>
            </div>
          </div>

          <section className="reading-strip card-lite">
            <div className="reading-stat">
              <span>Now reading</span>
              <strong>{selectedIndexInSection}/{activeSectionItems.length} in {activeSection.title}</strong>
            </div>
            <div className="reading-stat">
              <span>Estimated time</span>
              <strong>~{readingTime} min</strong>
            </div>
            <div className="reading-stat">
              <span>Why it matters</span>
              <strong>Interview + production reasoning</strong>
            </div>
          </section>

          <section className="card article-card">
            <div className="meta">
              <span className="badge">Topic #{selected.id}</span>
              <span className="badge mobile-hide">{selected.category}</span>
              <span className="badge">{selected.tag}</span>
              <span className="badge mobile-hide"><CheckCircle2 size={14} /> Senior interview oriented</span>
            </div>

            <h3>{selected.title}</h3>
            <div className="short-desc">{selected.shortDesc}</div>

            <div className="callout-grid">
              <div className="mini-callout primary">
                <span className="mini-label">Interview lens</span>
                <p>{interviewLens}</p>
              </div>
              <div className="mini-callout subtle">
                <span className="mini-label">Practical rule</span>
                <p>{selected.rule}</p>
              </div>
            </div>

            <ArchitectureDiagram diagram={architectureDiagram} title={selected.title} />

            <InfoSection title="1. Core idea" content={selected.detail} />
            <InfoSection title="2. Java / Spring Boot angle" content={selected.springBoot} />
            <InfoSection title="3. Key trade-offs" content={selected.comparison} />
            <InfoSection title="4. Senior-level best practices" content={selected.bestPractices} tone="success" />
            <InfoSection title="5. Pitfalls and red flags" content={selected.pitfalls} tone="danger" />

            <div className="rule"><strong>Aturan praktis:</strong> {selected.rule}</div>

            <div className="code-block">
              <div className="code-head">
                <div className="code-head-left">
                  <Code2 size={16} />
                  <span>Contoh implementasi / snippet</span>
                </div>
                <CopyButton value={selected.code} />
              </div>
              <pre><code>{selected.code}</code></pre>
            </div>
          </section>

          {nextTopic && (
            <section className="next-step card-lite">
              <div>
                <div className="sidebar-label">Next in this track</div>
                <h4>{nextTopic.id}. {nextTopic.title}</h4>
                <p>{nextTopic.shortDesc}</p>
              </div>
              <button className="next-step-btn" onClick={() => setSelectedId(nextTopic.id)}>
                Continue reading <ArrowRight size={16} />
              </button>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

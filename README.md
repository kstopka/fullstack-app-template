# Po sklonowaniu repozytorium:

```bash
chmod +x bin/setup.sh && bash bin/setup.sh
```

sam zainstaluje `node_modules` lokalnie,
zbuduje Dockera od zera (`--no-cache`),
zostawi gotowy projekt do odpalenia.

# błąd uprawnień:

`EACCES: permission denied, mkdir '.../frontend/node_modules/@alloc'`

## Usuń obecne katalogi `node_modules`:

```bash
sudo rm -rf frontend/node_modules backend/node_modules && sudo rm -rf frontend/package-lock.json backend/package-lock.json
```

## Napraw uprawnienia i uruchom ponownie `setup.sh`:

```bash
sudo chown -R $krystian:$krystian ~/git/fullstack-app-template
bash bin/setup.sh
```

# Baza danych

## Wgrywanie pliku dump.sql do bazy danych

Aby wgrać istniejący dump bazy danych (np. `dump.sql`), użyj komendy Makefile:

```bash
make restore-db
```

Ta komenda:

1. Usuwa obecne dane w schemacie publicznym bazy danych
2. Tworzy nowy schemat publiczny
3. Wgrywa dane z pliku `dump.sql`

**Uwaga:** Upewnij się, że kontener PostgreSQL jest uruchomiony (`docker compose up db`).

## Migracje Prisma

Po wgraniu dump lub zmianie schematu w `backend/prisma/schema.prisma`, zsynchronizuj bazę danych:

### Generowanie klienta Prisma

```bash
cd backend && npx prisma generate
```

### Synchronizacja schematu z bazą (bez migracji)

Jeśli używasz Prisma bez migracji plików:

```bash
cd backend && npx prisma db push
```

**Uwaga:** `db push` nadpisze strukturę tabel w bazie danych zgodnie ze schematem. Jeśli istnieją dane, które zostaną utracone, użyj flagi `--accept-data-loss`. Użyj z ostrożnością w środowisku produkcyjnym.

### Jeśli używasz migracji (opcjonalnie)

Jeśli chcesz używać migracji Prisma:

```bash
cd backend && npx prisma migrate dev --name init
```

# cleand docker:

## Jeśli chcesz wyczyścić tylko projekt fullstack-app-template

`docker compose down --volumes --remove-orphans`

## Jeśli chcesz zrobić pełny reset całego Dockera (utrata wszystkiego, również inne projekty — kontenery, obrazy, cache):

`docker system prune -af --volumes`

# Architektura projektu

Szczegółowy opis architektury aplikacji znajduje się w pliku [`architecture.md`](architecture.md).

# Uruchamianie aplikacji

## W trybie deweloperskim (z Docker Compose)

```bash
docker compose up
```

Aplikacja będzie dostępna pod:

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- Baza danych: localhost:5432

## Bez Dockera (lokalnie)

### Wymagania wstępne

- Node.js 18+
- PostgreSQL 15+

### Kroki

1. Uruchom bazę danych PostgreSQL lokalnie
2. Skopiuj `.env.example` do `.env` i skonfiguruj zmienne środowiskowe
3. Zainstaluj zależności i uruchom backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
4. W osobnym terminalu uruchom frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

# Testowanie

## Backend

```bash
cd backend && npm test
```

## Lintowanie i formatowanie

```bash
cd backend && npm run lint
cd backend && npm run format
```

# Środowiska

- **Development**: `NODE_ENV=development` - hot reload, szczegółowe logi
- **Production**: `NODE_ENV=production` - zoptymalizowana wersja

# Zmienne środowiskowe

Skopiuj `backend/.env.example` do `backend/.env` i skonfiguruj:

- `DATABASE_URL`: URL do bazy danych PostgreSQL
- `JWT_SECRET`: Sekret do JWT tokenów

# Troubleshooting

## Problemy z uprawnieniami Docker

Zobacz sekcję "błąd uprawnień" na górze tego pliku.

## Problemy z bazą danych

- Upewnij się, że kontener PostgreSQL jest uruchomiony
- Sprawdź zmienne środowiskowe w `.env`
- Użyj `make dump-db` aby zrobić backup przed zmianami

## Problemy z zależnościami

```bash
# Wyczyść cache npm i node_modules
rm -rf frontend/node_modules backend/node_modules
rm frontend/package-lock.json backend/package-lock.json
npm install
```

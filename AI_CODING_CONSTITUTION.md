# 🤖 AI CODING CONSTITUTION v1.0

**Projekt:** Fullstack App Template (Next.js + Express + PostgreSQL)  
**Autor:** Krystian  
**Cel:** Utrzymanie spójności, czytelności i skalowalności kodu w projekcie fullstackowym.

---

## 1️⃣ ZASADY OGÓLNE

### 🔹 KISS (Keep It Simple, Stupid)

- Kod ma być prosty, czytelny i pozbawiony zbędnych warstw abstrakcji.
- Nie używaj klas ani wzorców projektowych, jeśli proste funkcje wystarczą.
- Nie komplikuj logiki komponentów – dziel je na mniejsze, gdy zaczynają rosnąć.
- Nie twórz hooków lub helperów bez uzasadnienia ich ponownego użycia.

### 🔹 DRY (Don’t Repeat Yourself)

- Unikaj powielania kodu w całym projekcie.
- Wspólne funkcje umieszczaj w katalogu `utils/`.
- Powtarzające się fragmenty komponentów React przenoś do osobnych plików.
- Jeśli logika komponentu React zaczyna być złożona, przenieś ją do custom hooka.

### 🔹 SOLID (dla backendu)

- Każda warstwa ma jeden cel: `routes → controllers → services → models → utils`.
- Nie łącz bezpośrednio routes z bazą danych.
- Services nie zwracają Response – tylko dane lub wyjątki.
- Middleware zawsze w osobnym folderze (`middleware/`).

---

## 2️⃣ FRONTEND – Atomic Design

### 🔹 Struktura katalogów

```
src/
 ├── app/
 ├── components/
 │    ├── atoms/
 │    ├── molecules/
 │    ├── organisms/
 │    ├── templates/
 │    └── pages/
 ├── hooks/
 ├── utils/
 ├── types/
 └── styles/
```

### 🔹 Zasady

- Listy renderuj przez komponenty list itemów np. `<UserListItem />`
- Logikę pobierania danych umieszczaj w hookach (`useFetchUsers`, `useAuth`)
- Zachowaj czysty JSX – bez zagnieżdżonej logiki.
- Stylowanie przez **TailwindCSS** i klasy pomocnicze.
- Nie łącz logiki pobierania danych z komponentami UI.

---

## 3️⃣ BACKEND – Clean Architecture

### 🔹 Struktura katalogów

```
src/
 ├── routes/
 ├── controllers/
 ├── services/
 ├── models/
 ├── middleware/
 ├── config/
 ├── utils/
 └── index.ts
```

### 🔹 Zasady

- Każda warstwa ma jasno określoną odpowiedzialność.
- `routes` wywołują `controllers`, które korzystają z `services`.
- `services` komunikują się z bazą danych przez modele (`pg` lub ORM).
- `middleware` przechwytuje autoryzację, błędy, logowanie.
- Używaj `ts-node-dev` do automatycznego restartu backendu.

### 🔹 Autoryzacja JWT

- Middleware `authMiddleware` weryfikuje token z nagłówka Authorization.
- `JWT_SECRET` zawsze trzymany w `.env`.
- Token zawiera `userId` i `role`.
- Endpointy zabezpieczane przez `authMiddleware`.

---

## 4️⃣ TESTY

### 🔹 Framework: Vitest + Supertest (dla backendu)

### 🔹 Rodzaje testów

- **Jednostkowe:** funkcje utils, services, hooki.
- **Integracyjne:** komunikacja backend ↔ baza danych.
- **E2E:** główne przepływy użytkownika.

### 🔹 Przykłady testów

- Test generowania poprawnego tokenu JWT.
- Test odrzucenia nieprawidłowego tokenu.
- Test dostępu do endpointu zabezpieczonego middlewarem.
- Test poprawnego renderowania komponentu React.
- Test hooka pobierającego dane z API.

---

## 5️⃣ WORKFLOW + GIT HOOKS

### 🔹 Pliki środowiskowe

- `.env.local` → lokalny rozwój
- `.env.dev` → staging / development
- `.env.prod` → produkcja
- Nie commitować żadnych `.env`.

### 🔹 Formatowanie i linting

- **ESLint + Prettier**
- Uruchamiane automatycznie przed commitami przez **Husky + lint-staged**.
- Komenda: `npm run lint && npm run format`

### 🔹 Commity

- Format **Conventional Commits**:
  - `feat:` – nowa funkcja
  - `fix:` – poprawka błędu
  - `refactor:` – refaktoryzacja
  - `test:` – dodanie testów
  - `docs:` – dokumentacja

### 🔹 Uruchamianie środowiska

```
bash bin/setup.sh    # przygotowuje node_modules i buduje kontenery Docker
docker compose up     # uruchamia wszystkie serwisy
```

### 🔹 Monitoring i logowanie

- Logi backendu zapisywane w `/logs/app.log`
- Błędy globalne łapane przez middleware `errorHandler`

---

## 6️⃣ NAJLEPSZE PRAKTYKI

- Zawsze pisz typy dla każdej funkcji (`: Promise<Response>` / `: string` itd.)
- Używaj async/await zamiast then/catch.
- Oddziel logikę biznesową od transportowej (Express / HTTP).
- Wszystko, co można przetestować – testuj.
- Jeśli można coś wyodrębnić – zrób to (komponent, hook, util).
- Unikaj magicznych stringów – trzymaj je w stałych (`constants/`).

---

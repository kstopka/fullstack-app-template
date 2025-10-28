# Architektura Aplikacji

Ten dokument opisuje architekturę aplikacji, jej kluczowe komponenty oraz technologie użyte do ich stworzenia.

## Przegląd

Aplikacja została zaprojektowana w architekturze klient-serwer, składającej się z dwóch głównych części:

1.  **Frontend**: Aplikacja webowa stworzona w oparciu o Next.js, odpowiedzialna za interfejs użytkownika i interakcję.
2.  **Backend**: Serwer API zbudowany na Node.js z użyciem TypeScript, który zarządza logiką biznesową, danymi i komunikacją z bazą danych.

Oba komponenty są skonteneryzowane przy użyciu Dockera, co ułatwia rozwój, testowanie i wdrożenie.

---

## Frontend

Frontend jest nowoczesną aplikacją typu Single Page Application (SPA) renderowaną po stronie serwera (SSR) dzięki Next.js, komunikującą się z backend API.

- **Framework**: [Next.js](https://nextjs.org/) (oparty na React z App Router)
- **Język**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (zgodnie z `postcss.config.mjs`)
- **Czcionki**: [Geist](https://vercel.com/font) i [Geist Mono](https://vercel.com/font) od Vercel
- **Struktura**:
  - `src/app/`: Główny katalog aplikacji w Next.js App Router.
    - `layout.tsx`: Główny layout aplikacji z metadanymi i czcionkami.
    - `page.tsx`: Strona główna z komponentem klienta wyświetlającym użytkowników i wiadomość z backendu.
    - `globals.css`: Globalne style CSS.
  - `public/`: Zasoby statyczne (obrazy, ikony, favicon).
  - `next.config.ts`: Konfiguracja Next.js.
- **Funkcjonalności**:
  - Pobieranie i wyświetlanie listy użytkowników z backendu
  - Wyświetlanie wiadomości testowej z API
  - Responsywny interfejs z podstawowym stylingiem CSS-in-JS

## Backend

Backend dostarcza RESTful API, z którym komunikuje się frontend.

- **Środowisko uruchomieniowe**: [Node.js](https://nodejs.org/)
- **Język**: [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/) (z generowanym klientem w `src/generated/prisma/`)
- **Baza danych**: [PostgreSQL](https://www.postgresql.org/) (zarządzana przez Docker)
- **Bezpieczeństwo**: JWT dla autoryzacji, middleware bezpieczeństwa (Helmet, CORS, Rate Limiting)
- **Struktura**:
  - `src/index.ts`: Główny plik wejściowy aplikacji serwerowej z konfiguracją Express, middleware i endpointami API.
  - `src/middleware/authMiddleware.ts`: Middleware do weryfikacji tokenów JWT.
  - `src/utils/jwt.ts`: Narzędzia do generowania i weryfikacji tokenów JWT.
  - `prisma/schema.prisma`: Schemat bazy danych z modelem User.
  - `tsconfig.json`: Konfiguracja kompilatora TypeScript.
  - `package.json`: Zawiera zależności, w tym Prisma, JWT, Express i middleware bezpieczeństwa.

## Baza Danych

Aplikacja wykorzystuje PostgreSQL jako główną bazę danych, zarządzaną przez Prisma ORM.

- **System zarządzania bazą danych**: [PostgreSQL](https://www.postgresql.org/) w wersji 15
- **ORM**: [Prisma](https://www.prisma.io/) do zarządzania schematem i migracjami
- **Konteneryzacja**: Uruchamiana w osobnym kontenerze Docker
- **Konfiguracja**:
  - Nazwa bazy danych: `myapp`
  - Użytkownik: `user`
  - Hasło: `password`
- **Struktura tabeli użytkowników** (model User w Prisma):
  - `id`: Int @id @default(autoincrement()) (automatycznie generowany identyfikator)
  - `name`: String (imię i nazwisko użytkownika)
  - `email`: String @unique (unikalny adres email)
  - `password`: String (hasło użytkownika)
  - `role`: String @default("user") (rola użytkownika)
  - `createdAt`: DateTime @default(now()) (data utworzenia rekordu)
- **Endpointy API**:
  - `GET /api/message`: Prosty endpoint testowy zwracający wiadomość
  - `GET /api/users`: Pobiera wszystkich użytkowników z bazy danych
  - `POST /api/users`: Tworzy nowego użytkownika (wymaga pól: name, email, password)
  - `POST /api/login`: Logowanie użytkownika i generowanie tokenu JWT (wymaga pól: email, password)
  - `GET /api/protected`: Chroniony endpoint wymagający ważnego tokenu JWT
  - `POST /api/init-db`: Inicjalizuje bazę danych (migracje Prisma)

## Uwierzytelnianie

Aplikacja implementuje system uwierzytelniania oparty na tokenach JWT (JSON Web Tokens).

- **Biblioteka**: [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- **Tokeny JWT**: Generowane przy logowaniu, zawierają userId i role użytkownika
- **Middleware autoryzacji**: `authMiddleware` weryfikuje tokeny w nagłówku Authorization
- **Konfiguracja**:
  - `JWT_SECRET`: Sekret do podpisywania tokenów (wymagany w zmiennych środowiskowych)
  - `JWT_EXPIRES_IN`: Czas wygaśnięcia tokenu (domyślnie 1 godzina)
- **Chronione endpointy**: Wymagają prawidłowego tokenu JWT w nagłówku `Authorization: Bearer <token>`

## Konteneryzacja

Aplikacja wykorzystuje Docker do konteneryzacji, co zapewnia spójne środowisko deweloperskie i produkcyjne.

- **Pliki konfiguracyjne**:
  - `Dockerfile`: Definiuje obrazy Docker dla frontendu i backendu.
  - `docker-compose.yml`: Służy do orkiestracji i uruchamiania wszystkich kontenerów jednocześnie, ułatwiając lokalny rozwój.
- **Usługi kontenerów**:
  - `db`: PostgreSQL 15 z trwałym przechowywaniem danych
  - `backend`: Node.js/TypeScript API server z połączeniem do bazy danych
  - `frontend`: Next.js aplikacja webowa
- **Sieć Docker**: Kontenery komunikują się poprzez wewnętrzną sieć Docker (backend łączy się z bazą jako `db:5432`)
- **Wolumeny**: Dane PostgreSQL są przechowywane w nazwanym wolumenie `postgres_data` dla trwałości danych

## Przepływ Danych

1.  Użytkownik wchodzi w interakcję z interfejsem aplikacji (Frontend).
2.  Frontend wysyła żądania HTTP (np. GET, POST) do Backend API w celu pobrania lub modyfikacji danych.
3.  Backend przetwarza żądanie, wykonuje operacje na bazie danych (jeśli jest to wymagane) i zwraca odpowiedź (zazwyczaj w formacie JSON).
4.  Frontend otrzymuje odpowiedź i aktualizuje interfejs użytkownika.

### Szczegółowy przepływ dla użytkowników:

1. **Wyświetlanie użytkowników**: Frontend automatycznie pobiera listę użytkowników przy ładowaniu strony poprzez `GET /api/users`
2. **Dodawanie użytkowników**: Backend akceptuje żądania `POST /api/users` z danymi użytkownika w formacie JSON (name, email, password)
3. **Logowanie**: Użytkownicy mogą się zalogować poprzez `POST /api/login` z email i hasłem, otrzymując token JWT
4. **Dostęp do chronionych zasobów**: Endpoint `GET /api/protected` wymaga prawidłowego tokenu JWT w nagłówku Authorization
5. **Inicjalizacja bazy danych**: Endpoint `POST /api/init-db` uruchamia migracje Prisma
6. **Komunikacja między kontenerami**: Backend łączy się z bazą danych PostgreSQL poprzez wewnętrzną sieć Docker

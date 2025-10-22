# Architektura Aplikacji

Ten dokument opisuje architekturę aplikacji, jej kluczowe komponenty oraz technologie użyte do ich stworzenia.

## Przegląd

Aplikacja została zaprojektowana w architekturze klient-serwer, składającej się z dwóch głównych części:

1.  **Frontend**: Aplikacja webowa stworzona w oparciu o Next.js, odpowiedzialna za interfejs użytkownika i interakcję.
2.  **Backend**: Serwer API zbudowany na Node.js z użyciem TypeScript, który zarządza logiką biznesową, danymi i komunikacją z bazą danych.

Oba komponenty są skonteneryzowane przy użyciu Dockera, co ułatwia rozwój, testowanie i wdrożenie.

---

## Frontend

Frontend jest nowoczesną aplikacją typu Single Page Application (SPA) renderowaną po stronie serwera (SSR) dzięki Next.js.

- **Framework**: [Next.js](https://nextjs.org/) (oparty na React)
- **Język**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (zgodnie z `postcss.config.mjs`)
- **Struktura**:
  - `src/app/`: Główny katalog aplikacji w Next.js App Router.
    - `layout.tsx`: Główny layout aplikacji.
    - `page.tsx`: Strona główna.
    - `globals.css`: Globalne style.
  - `public/`: Zasoby statyczne (obrazy, ikony).
  - `next.config.ts`: Konfiguracja Next.js.

## Backend

Backend dostarcza RESTful API, z którym komunikuje się frontend.

- **Środowisko uruchomieniowe**: [Node.js](https://nodejs.org/)
- **Język**: [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Baza danych**: [PostgreSQL](https://www.postgresql.org/) (zarządzana przez Docker)
- **Struktura**:
  - `src/index.ts`: Główny plik wejściowy aplikacji serwerowej z konfiguracją bazy danych i endpointami API.
  - `tsconfig.json`: Konfiguracja kompilatora TypeScript.
  - `package.json`: Zawiera zależności, w tym `pg` dla połączenia z PostgreSQL.

## Baza Danych

Aplikacja wykorzystuje PostgreSQL jako główną bazę danych.

- **System zarządzania bazą danych**: [PostgreSQL](https://www.postgresql.org/) w wersji 15
- **Konteneryzacja**: Uruchamiana w osobnym kontenerze Docker
- **Konfiguracja**:
  - Nazwa bazy danych: `myapp`
  - Użytkownik: `user`
  - Hasło: `password`
- **Struktura tabeli użytkowników**:
  - `id`: SERIAL PRIMARY KEY (automatycznie generowany identyfikator)
  - `name`: VARCHAR(100) NOT NULL (imię i nazwisko użytkownika)
  - `email`: VARCHAR(100) UNIQUE NOT NULL (unikalny adres email)
  - `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP (data utworzenia rekordu)
- **Endpointy API**:
  - `GET /api/users`: Pobiera wszystkich użytkowników z bazy danych
  - `POST /api/users`: Tworzy nowego użytkownika (wymaga pól: name, email)
  - `POST /api/init-db`: Inicjalizuje tabelę użytkowników (jeśli nie istnieje)

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
2. **Dodawanie użytkowników**: Backend akceptuje żądania `POST /api/users` z danymi użytkownika w formacie JSON
3. **Inicjalizacja bazy danych**: Endpoint `POST /api/init-db` tworzy tabelę użytkowników jeśli nie istnieje
4. **Komunikacja między kontenerami**: Backend łączy się z bazą danych PostgreSQL poprzez wewnętrzną sieć Docker

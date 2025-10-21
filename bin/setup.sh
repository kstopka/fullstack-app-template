#!/bin/bash
set -e

echo "🚀 Inicjalizacja środowiska po sklonowaniu repozytorium..."

# Sprawdzenie, czy zainstalowany jest Docker i npm
if ! command -v docker &> /dev/null
then
    echo "❌ Docker nie jest zainstalowany! Zainstaluj go i uruchom ponownie skrypt."
    exit 1
fi

if ! command -v npm &> /dev/null
then
    echo "❌ npm nie jest zainstalowany! Zainstaluj Node.js (zalecane v18+) i uruchom ponownie skrypt."
    exit 1
fi

# Instalacja zależności frontend
echo "📦 Instaluję zależności dla frontend..."
cd frontend
npm install

# Instalacja zależności backend
echo "📦 Instaluję zależności dla backend..."
cd ../backend
npm install

# Powrót do katalogu głównego
cd ..

# Budowanie obrazów Dockera od zera
echo "🐳 Buduję kontenery Dockera (pełny rebuild z --no-cache)..."
docker compose build --no-cache

echo ""
echo "✅ Środowisko skonfigurowane pomyślnie!"
echo "👉 Uruchom aplikację poleceniem: docker compose up"
echo "👉 Aby zatrzymać aplikację, użyj: docker compose down"
echo "👉 Aby zobaczyć logi, użyj: docker compose logs -f"

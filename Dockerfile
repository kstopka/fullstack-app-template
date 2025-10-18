# Wybieramy bazowy obraz Node
FROM node:20-alpine

# Ustawiamy katalog roboczy
WORKDIR /app

# Kopiujemy pliki package i instalujemy zależności
COPY package*.json ./
RUN npm install

# Kopiujemy resztę plików
COPY . .

# Otwieramy port backendu
EXPOSE 4000

# Domyślny polecenie (tryb dev)
CMD ["npm", "run", "dev"]

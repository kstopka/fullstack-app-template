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

# cleand docker:

## Jeśli chcesz wyczyścić tylko projekt fullstack-app-template

`docker compose down --volumes --remove-orphans`

## Jeśli chcesz zrobić pełny reset całego Dockera (utrata wszystkiego, również inne projekty — kontenery, obrazy, cache):

`docker system prune -af --volumes`

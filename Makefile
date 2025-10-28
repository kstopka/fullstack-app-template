dump-db:
	docker exec postgres_db pg_dump -U user myapp > dump.sql

restore-db:
	docker exec -i postgres_db psql -U user -d myapp -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
	docker exec -i postgres_db psql -U user myapp < dump.sql
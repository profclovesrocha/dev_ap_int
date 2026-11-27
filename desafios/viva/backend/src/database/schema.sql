-- VIVA — estrutura do banco de dados

CREATE TABLE IF NOT EXISTS registros (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  protocolo     TEXT    NOT NULL UNIQUE,
  categoria     TEXT    NOT NULL CHECK (categoria IN
                  ('iluminacao', 'abandono', 'policiamento', 'transporte', 'mato', 'outro')),
  bairro        TEXT    NOT NULL CHECK (length(bairro) BETWEEN 3 AND 60),
  descricao     TEXT    NOT NULL CHECK (length(descricao) BETWEEN 20 AND 500),
  status        TEXT    NOT NULL DEFAULT 'recebido' CHECK (status IN
                  ('recebido', 'em_analise', 'encaminhado', 'concluido')),
  demonstrativo INTEGER NOT NULL DEFAULT 0 CHECK (demonstrativo IN (0, 1)),
  criado_em     TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
) STRICT;
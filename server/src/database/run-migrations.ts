import { Pool } from 'pg';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME || process.env.DB_DATABASE;

if (!host || !port || !username || !password || !database) {
  console.error('❌ Veritabanı yapılandırma bilgileri eksik. Lütfen .env dosyasını kontrol edin.');
  process.exit(1);
}

const pool = new Pool({
  host,
  port: parseInt(port),
  user: username,
  password,
  database,
});

async function runMigrations() {
  const migrationsDir = join(__dirname, 'migrations');
  const files = readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log(`Found ${files.length} migration files`);

  for (const file of files) {
    const sql = readFileSync(join(migrationsDir, file), 'utf-8');
    console.log(`Running migration: ${file}`);
    try {
      // SQL'i statement'lara böl ve tek tek çalıştır
      // Önce yorumları temizle
      let cleanSql = sql
        .split('\n')
        .map(line => {
          // Satır içi yorumları temizle (-- ile başlayan)
          const commentIndex = line.indexOf('--');
          if (commentIndex !== -1) {
            return line.substring(0, commentIndex);
          }
          return line;
        })
        .join('\n');
      
      // Block comment'leri temizle (/* ... */)
      cleanSql = cleanSql.replace(/\/\*[\s\S]*?\*\//g, '');
      
      const statements = cleanSql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);

      for (const statement of statements) {
        if (statement.trim()) {
          console.log(`Executing: ${statement.substring(0, 50)}...`);
          await pool.query(statement);
        }
      }
      console.log(`✅ Migration completed: ${file}`);
    } catch (err) {
      console.error(`❌ Error in migration file: ${file}\n`, err);
      // Hata durumunda devam et, sadece uyar
      console.log(`⚠️  Continuing with next migration...`);
    }
  }

  await pool.end();
  console.log('✅ All migrations processed!');
}

runMigrations().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});

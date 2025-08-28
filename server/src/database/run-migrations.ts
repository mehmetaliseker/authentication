import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Environment variables'ları yükle
config();

interface MigrationResult {
    success: boolean;
    message: string;
    error?: string;
}

class MigrationRunner {
    private dataSource: DataSource;
    private migrationsPath: string;

    constructor() {
        this.migrationsPath = path.join(__dirname, 'migrations');
        this.initializeDataSource();
    }

    private initializeDataSource(): void {
        this.dataSource = new DataSource({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_DATABASE || 'authentication_db',
            synchronize: false,
            logging: true,
            entities: [],
            migrations: []
        });
    }

    public async connect(): Promise<void> {
        try {
            await this.dataSource.initialize();
            console.log(' Veritabanı bağlantısı başarılı');
        } catch (error) {
            console.error(' Veritabanı bağlantısı başarısız:', error);
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        try {
            await this.dataSource.destroy();
            console.log(' Veritabanı bağlantısı kapatıldı');
        } catch (error) {
            console.error(' Veritabanı bağlantısı kapatılamadı:', error);
        }
    }

    private getMigrationFiles(): string[] {
        try {
            const files = fs.readdirSync(this.migrationsPath)
                .filter(file => file.endsWith('.sql'))
                .sort(); // Dosyaları sırala (001, 002, 003...)
            
            return files;
        } catch (error) {
            console.error('Migration dosyaları okunamadı:', error);
            return [];
        }
    }

    private async executeMigration(fileName: string): Promise<MigrationResult> {
        const filePath = path.join(this.migrationsPath, fileName);
        
        try {
            const sqlContent = fs.readFileSync(filePath, 'utf8');
            const queries = sqlContent
                .split(';')
                .map(query => query.trim())
                .filter(query => query.length > 0 && !query.startsWith('--'));

            for (const query of queries) {
                if (query.trim()) {
                    await this.dataSource.query(query);
                }
            }

            return {
                success: true,
                message: `Migration başarılı: ${fileName}`
            };
        } catch (error) {
            return {
                success: false,
                message: `Migration başarısız: ${fileName}`,
                error: error instanceof Error ? error.message : 'Bilinmeyen hata'
            };
        }
    }

    private async checkMigrationTable(): Promise<void> {
        try {
            await this.dataSource.query(`
                CREATE TABLE IF NOT EXISTS public.migrations (
                    id SERIAL PRIMARY KEY,
                    filename VARCHAR(255) NOT NULL UNIQUE,
                    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    checksum VARCHAR(64),
                    status VARCHAR(20) DEFAULT 'completed'
                )
            `);
            console.log(' Migration tablosu kontrol edildi');
        } catch (error) {
            console.error(' Migration tablosu oluşturulamadı:', error);
            throw error;
        }
    }

    private async isMigrationExecuted(fileName: string): Promise<boolean> {
        try {
            const result = await this.dataSource.query(
                'SELECT COUNT(*) as count FROM public.migrations WHERE filename = $1',
                [fileName]
            );
            return parseInt(result[0].count) > 0;
        } catch (error) {
            return false;
        }
    }

    private async markMigrationAsExecuted(fileName: string): Promise<void> {
        try {
            await this.dataSource.query(
                'INSERT INTO public.migrations (filename, status) VALUES ($1, $2)',
                [fileName, 'completed']
            );
        } catch (error) {
            console.error(` Migration kaydı eklenemedi: ${fileName}`, error);
        }
    }

    public async runMigrations(): Promise<void> {
        try {
            console.log(' Migration işlemi başlatılıyor...');
            
            await this.connect();
            await this.checkMigrationTable();

            const migrationFiles = this.getMigrationFiles();
            
            if (migrationFiles.length === 0) {
                console.log('  Çalıştırılacak migration dosyası bulunamadı');
                return;
            }

            console.log(` ${migrationFiles.length} migration dosyası bulundu`);
            
            let successCount = 0;
            let errorCount = 0;

            for (const fileName of migrationFiles) {
                console.log(`\n Migration çalıştırılıyor: ${fileName}`);
                
                // Migration daha önce çalıştırılmış mı kontrol et
                if (await this.isMigrationExecuted(fileName)) {
                    console.log(`  Migration zaten çalıştırılmış: ${fileName}`);
                    continue;
                }

                const result = await this.executeMigration(fileName);
                
                if (result.success) {
                    await this.markMigrationAsExecuted(fileName);
                    console.log(result.message);
                    successCount++;
                } else {
                    console.error(result.message);
                    console.error(`Hata: ${result.error}`);
                    errorCount++;
                    
                    // Hata durumunda işlemi durdur
                    console.log(' Migration hatası nedeniyle işlem durduruldu');
                    break;
                }
            }

            console.log('\n Migration Sonuçları:');
            console.log(` Başarılı: ${successCount}`);
            console.log(` Başarısız: ${errorCount}`);
            
            if (errorCount === 0) {
                console.log(' Tüm migration\'lar başarıyla tamamlandı!');
            } else {
                console.log('  Bazı migration\'lar başarısız oldu');
            }

        } catch (error) {
            console.error(' Migration işlemi sırasında kritik hata:', error);
        } finally {
            await this.disconnect();
        }
    }

    public async rollbackLastMigration(): Promise<void> {
        try {
            console.log(' Son migration geri alınıyor...');
            
            await this.connect();
            
            const lastMigration = await this.dataSource.query(
                'SELECT filename FROM public.migrations ORDER BY id DESC LIMIT 1'
            );

            if (lastMigration.length === 0) {
                console.log('  Geri alınacak migration bulunamadı');
                return;
            }

            const fileName = lastMigration[0].filename;
            console.log(`📋 Son migration geri alınıyor: ${fileName}`);
            
            // Bu örnek için basit bir rollback - gerçek projede daha detaylı olmalı
            await this.dataSource.query(
                'DELETE FROM public.migrations WHERE filename = $1',
                [fileName]
            );
            
            console.log(` Migration geri alındı: ${fileName}`);
            
        } catch (error) {
            console.error(' Rollback işlemi başarısız:', error);
        } finally {
            await this.disconnect();
        }
    }
}

// CLI komutları
async function main(): Promise<void> {
    const args = process.argv.slice(2);
    const command = args[0];

    const migrationRunner = new MigrationRunner();

    try {
        switch (command) {
            case 'run':
                await migrationRunner.runMigrations();
                break;
            case 'rollback':
                await migrationRunner.rollbackLastMigration();
                break;
            default:
                console.log(' Kullanım:');
                console.log('  npm run migrate:run    - Migration\'ları çalıştır');
                console.log('  npm run migrate:rollback - Son migration\'ı geri al');
                break;
        }
    } catch (error) {
        console.error(' Ana işlem hatası:', error);
        process.exit(1);
    }
}

// Eğer dosya doğrudan çalıştırılıyorsa
if (require.main === module) {
    main();
}

export { MigrationRunner };

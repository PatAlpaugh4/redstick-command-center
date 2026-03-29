# Database Backup Strategies

## Overview
This document outlines the backup and recovery strategies for the Redstick Ventures Command Center database.

## Backup Types

### 1. Automated Backups (Vercel Postgres)
If using Vercel Postgres, automated daily backups are included:

- **Frequency**: Daily at 00:00 UTC
- **Retention**: 7 days
- **Storage**: Vercel managed
- **Recovery**: Via Vercel dashboard

### 2. Manual Backups

#### Using pg_dump
```bash
# Full database backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Compressed backup
pg_dump $DATABASE_URL | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Specific tables
pg_dump $DATABASE_URL --table=deals --table=investors > backup_tables.sql
```

#### Using Prisma
```bash
# Export data via Prisma
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > schema.sql

# Seed data export (custom script)
node scripts/export-data.js
```

### 3. Scheduled Backups (GitHub Actions)

```yaml
# .github/workflows/backup.yml
name: Database Backup
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
  workflow_dispatch:

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install PostgreSQL client
        run: sudo apt-get install -y postgresql-client
      
      - name: Create backup
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: |
          pg_dump $DATABASE_URL | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
      
      - name: Upload to S3
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          aws s3 cp backup_*.sql.gz s3://redstick-backups/database/
```

## Backup Storage

### Storage Options

| Provider | Use Case | Retention |
|----------|----------|-----------|
| AWS S3 | Long-term archival | 30+ days |
| Google Cloud Storage | Cross-region redundancy | 30+ days |
| Vercel Blob | Short-term recovery | 7 days |

### S3 Lifecycle Policy
```json
{
  "Rules": [
    {
      "ID": "TransitionToGlacier",
      "Status": "Enabled",
      "Filter": {
        "Prefix": "backups/"
      },
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "GLACIER"
        }
      ],
      "Expiration": {
        "Days": 365
      }
    }
  ]
}
```

## Recovery Procedures

### Full Database Restore

#### From pg_dump Backup
```bash
# Restore from SQL file
psql $DATABASE_URL < backup_20240115_120000.sql

# Restore compressed backup
gunzip -c backup_20240115_120000.sql.gz | psql $DATABASE_URL
```

#### Using Vercel Dashboard
1. Go to Vercel Dashboard → Storage → Postgres
2. Select database
3. Click "Restore" tab
4. Choose backup date
5. Confirm restore

### Partial Data Recovery

#### Restore Specific Table
```bash
# Extract and restore single table
gunzip -c backup_20240115_120000.sql.gz | \
  sed -n '/COPY public.deals/,/\\./p' | \
  psql $DATABASE_URL
```

#### Point-in-Time Recovery (if supported)
```bash
# Restore to specific timestamp
pg_restore --target-time "2024-01-15 12:00:00" backup_file
```

## Disaster Recovery Plan

### RPO and RTO Targets

| Scenario | RPO (Data Loss) | RTO (Recovery Time) |
|----------|-----------------|---------------------|
| Accidental deletion | < 24 hours | < 1 hour |
| Database corruption | < 24 hours | < 2 hours |
| Complete data loss | < 24 hours | < 4 hours |

### Recovery Steps

#### Scenario: Database Corruption
1. **Assess** (0-5 min)
   - Verify corruption scope
   - Check application error logs
   - Identify last known good state

2. **Stop Writes** (5-10 min)
   - Enable maintenance mode
   - Pause background jobs
   - Notify users if needed

3. **Restore** (10-60 min)
   - Select appropriate backup
   - Execute restore command
   - Verify data integrity

4. **Verify** (60-90 min)
   - Run smoke tests
   - Check critical workflows
   - Monitor error rates

5. **Resume** (90-120 min)
   - Disable maintenance mode
   - Resume background jobs
   - Monitor closely

## Testing Backups

### Monthly Restore Test
```bash
#!/bin/bash
# scripts/test-backup.sh

# Create test database
psql $ADMIN_DATABASE_URL -c "CREATE DATABASE backup_test;"

# Restore latest backup
LATEST_BACKUP=$(aws s3 ls s3://redstick-backups/database/ | sort | tail -1 | awk '{print $4}')
aws s3 cp s3://redstick-backups/database/$LATEST_BACKUP - | \
  gunzip | \
  psql $TEST_DATABASE_URL

# Run validation queries
psql $TEST_DATABASE_URL -c "SELECT COUNT(*) FROM deals;"
psql $TEST_DATABASE_URL -c "SELECT COUNT(*) FROM investors;"

# Cleanup
psql $ADMIN_DATABASE_URL -c "DROP DATABASE backup_test;"

echo "Backup test completed successfully"
```

## Security Considerations

### Backup Encryption
```bash
# Encrypt backup with GPG
gpg --symmetric --cipher-algo AES256 backup.sql

# Decrypt
gpg --decrypt backup.sql.gpg > backup.sql
```

### Access Control
- Store backup credentials in environment variables
- Use IAM roles for S3 access
- Rotate access keys every 90 days
- Enable S3 bucket versioning
- Enable S3 bucket encryption

## Monitoring

### Backup Verification Alerts
```yaml
# Add to monitoring system
backup_verification:
  schedule: daily
  check:
    - backup_file_exists
    - backup_size_reasonable
    - backup_age < 25 hours
  alert:
    on_failure: email+slack
    recipients: devops@redstick.vc
```

### Storage Monitoring
```bash
# Check backup storage usage
aws s3 ls s3://redstick-backups/database/ --recursive --human-readable --summarize
```

## Documentation Checklist

- [ ] Backup schedules documented
- [ ] Recovery procedures tested monthly
- [ ] Storage locations documented
- [ ] Access credentials secured
- [ ] RPO/RTO targets defined
- [ ] Disaster recovery plan reviewed quarterly

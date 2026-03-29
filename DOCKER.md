# Docker Setup

## Development
```bash
# Build image
docker build -t redstick-dev .

# Run container
docker run -p 3000:3000 --env-file .env redstick-dev
```

## Production
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Docker Compose
```yaml
version: '3'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://...
    depends_on:
      - db
  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=redstick
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=redstick
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:
```

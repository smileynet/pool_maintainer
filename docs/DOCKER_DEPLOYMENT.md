# Docker Deployment Guide for Pool Maintenance System

This guide covers deploying the Pool Maintenance System using Docker for both development and production environments.

## Prerequisites

- Docker Engine 20.10+ installed
- Docker Compose 2.0+ installed
- 2GB free disk space for images
- Port 8080 available (production) or 5080/6080 (development)

## Quick Start

### Production Deployment

```bash
# Build and run the production container
docker-compose up -d

# View logs
docker-compose logs -f pool-maintainer

# Stop the container
docker-compose down
```

The application will be available at http://localhost:8080

### Development with Hot Reload

```bash
# Run development container with volume mounts
docker-compose -f docker-compose.dev.yml up

# In another terminal, run Storybook
docker-compose -f docker-compose.dev.yml exec pool-maintainer-dev bun run storybook
```

Development server: http://localhost:5080
Storybook: http://localhost:6080

## Architecture

### Multi-Stage Production Build

The production Dockerfile uses a multi-stage build process:

1. **Builder Stage** (node:20-alpine)
   - Installs dependencies with bun
   - Builds the React application
   - Outputs optimized static files

2. **Runtime Stage** (nginx:alpine)
   - Serves static files with Nginx
   - Implements SPA routing fallback
   - Adds security headers
   - Enables gzip compression

### Key Features

- **Optimized Image Size**: ~40MB final image using Alpine Linux
- **Security Headers**: CSP, X-Frame-Options, etc.
- **Health Checks**: Built-in endpoint for container orchestration
- **Asset Caching**: 1-year cache for static assets
- **SPA Support**: Proper routing for single-page application

## Configuration

### Environment Variables

```bash
# Production
NODE_ENV=production

# Development
NODE_ENV=development
VITE_PORT=5080
STORYBOOK_PORT=6080
```

### Nginx Configuration

The `nginx.conf` file includes:
- Gzip compression for text assets
- Security headers for XSS protection
- Cache control for optimal performance
- SPA fallback routing
- Health check endpoint at `/health`

### Resource Limits

Production containers are configured with:
- CPU: 0.5 cores limit, 0.25 cores reserved
- Memory: 256MB limit, 128MB reserved

## Building and Running

### Build Production Image

```bash
# Build with Docker
docker build -t pool-maintainer:latest .

# Build with Docker Compose
docker-compose build
```

### Run in Different Environments

```bash
# Production (detached)
docker-compose up -d

# Development (with logs)
docker-compose -f docker-compose.dev.yml up

# Staging (custom port)
docker-compose -p staging up -d --scale pool-maintainer=2
```

### Image Management

```bash
# List images
docker images | grep pool-maintainer

# Remove unused images
docker image prune -f

# Tag for registry
docker tag pool-maintainer:latest myregistry.com/pool-maintainer:v1.0.0

# Push to registry
docker push myregistry.com/pool-maintainer:v1.0.0
```

## Deployment Strategies

### 1. Single Server Deployment

```bash
# SSH to server
ssh user@server

# Clone repository
git clone https://github.com/yourorg/pool-maintainer.git
cd pool-maintainer

# Deploy
docker-compose up -d
```

### 2. Container Registry Deployment

```bash
# On build server
docker build -t registry.example.com/pool-maintainer:latest .
docker push registry.example.com/pool-maintainer:latest

# On production server
docker pull registry.example.com/pool-maintainer:latest
docker run -d -p 80:80 registry.example.com/pool-maintainer:latest
```

### 3. Kubernetes Deployment

Create a deployment manifest:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pool-maintainer
spec:
  replicas: 3
  selector:
    matchLabels:
      app: pool-maintainer
  template:
    metadata:
      labels:
        app: pool-maintainer
    spec:
      containers:
      - name: pool-maintainer
        image: pool-maintainer:latest
        ports:
        - containerPort: 80
        resources:
          limits:
            memory: "256Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
```

## Monitoring and Maintenance

### Health Checks

```bash
# Check container health
docker-compose ps

# Manual health check
curl http://localhost:8080/health

# View container logs
docker-compose logs -f --tail=100 pool-maintainer
```

### Performance Monitoring

```bash
# Resource usage
docker stats pool-maintainer

# Detailed inspection
docker inspect pool-maintainer
```

### Backup and Recovery

Since this is a frontend application with localStorage:
- No server-side data to backup
- Users' localStorage data persists in their browsers
- Consider implementing data export features for users

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Find process using port
   lsof -i :8080
   
   # Change port in docker-compose.yml
   ports:
     - "8081:80"
   ```

2. **Build Failures**
   ```bash
   # Clean build cache
   docker builder prune -f
   
   # Build with no cache
   docker-compose build --no-cache
   ```

3. **Container Won't Start**
   ```bash
   # Check logs
   docker-compose logs pool-maintainer
   
   # Run interactively
   docker run -it pool-maintainer:latest sh
   ```

### Debug Mode

```bash
# Override entrypoint for debugging
docker run -it --entrypoint sh pool-maintainer:latest

# Inside container
nginx -t  # Test nginx config
ls -la /usr/share/nginx/html  # Check built files
```

## Security Considerations

1. **Image Scanning**
   ```bash
   # Scan for vulnerabilities
   docker scan pool-maintainer:latest
   ```

2. **Runtime Security**
   - Run as non-root user (nginx image does this)
   - Read-only root filesystem possible
   - No sensitive data in image

3. **Network Security**
   - Use HTTPS in production (reverse proxy)
   - Implement rate limiting
   - Consider WAF for public deployments

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Docker Build and Push

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            ghcr.io/${{ github.repository }}:latest
            ghcr.io/${{ github.repository }}:${{ github.sha }}
```

## Performance Optimization

1. **Image Size Optimization**
   - Multi-stage builds reduce final size
   - Alpine-based images for minimal footprint
   - Only include production dependencies

2. **Build Cache Optimization**
   - Order Dockerfile commands by change frequency
   - Copy package files before source code
   - Use .dockerignore to exclude unnecessary files

3. **Runtime Performance**
   - Nginx serves static files efficiently
   - Gzip compression reduces bandwidth
   - Proper cache headers minimize requests

## Next Steps

1. Set up HTTPS with Let's Encrypt
2. Configure monitoring with Prometheus/Grafana
3. Implement automated backups if adding backend
4. Set up container orchestration for scaling

## Support

For issues specific to Docker deployment:
1. Check container logs
2. Verify Docker/Compose versions
3. Review resource availability
4. Consult the main README.md for application-specific issues
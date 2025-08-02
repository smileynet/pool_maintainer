#!/bin/bash

# Docker build script with versioning and tagging

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get version from package.json
VERSION=$(node -p "require('./package.json').version")
COMMIT_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "no-git")
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Default values
REGISTRY=""
IMAGE_NAME="pool-maintainer"
BUILD_TYPE="production"
PUSH_TO_REGISTRY=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --registry)
      REGISTRY="$2/"
      shift 2
      ;;
    --push)
      PUSH_TO_REGISTRY=true
      shift
      ;;
    --dev)
      BUILD_TYPE="development"
      shift
      ;;
    --help)
      echo "Usage: $0 [options]"
      echo "Options:"
      echo "  --registry <url>  Docker registry URL (e.g., ghcr.io/username)"
      echo "  --push           Push images to registry after build"
      echo "  --dev            Build development image"
      echo "  --help           Show this help message"
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      exit 1
      ;;
  esac
done

# Determine Dockerfile
if [ "$BUILD_TYPE" = "development" ]; then
  DOCKERFILE="Dockerfile.dev"
  TAG_SUFFIX="-dev"
else
  DOCKERFILE="Dockerfile"
  TAG_SUFFIX=""
fi

echo -e "${GREEN}Building ${BUILD_TYPE} image...${NC}"
echo "Version: $VERSION"
echo "Commit: $COMMIT_HASH"
echo "Timestamp: $TIMESTAMP"

# Build the image with multiple tags
docker build \
  -f "$DOCKERFILE" \
  -t "${REGISTRY}${IMAGE_NAME}:latest${TAG_SUFFIX}" \
  -t "${REGISTRY}${IMAGE_NAME}:${VERSION}${TAG_SUFFIX}" \
  -t "${REGISTRY}${IMAGE_NAME}:${VERSION}-${COMMIT_HASH}${TAG_SUFFIX}" \
  --build-arg VERSION="$VERSION" \
  --build-arg COMMIT_HASH="$COMMIT_HASH" \
  --build-arg BUILD_DATE="$TIMESTAMP" \
  .

if [ $? -eq 0 ]; then
  echo -e "${GREEN}Build successful!${NC}"
  
  # Display image info
  echo -e "\n${YELLOW}Image tags created:${NC}"
  echo "  - ${REGISTRY}${IMAGE_NAME}:latest${TAG_SUFFIX}"
  echo "  - ${REGISTRY}${IMAGE_NAME}:${VERSION}${TAG_SUFFIX}"
  echo "  - ${REGISTRY}${IMAGE_NAME}:${VERSION}-${COMMIT_HASH}${TAG_SUFFIX}"
  
  # Show image size
  IMAGE_SIZE=$(docker images "${REGISTRY}${IMAGE_NAME}:latest${TAG_SUFFIX}" --format "table {{.Size}}" | tail -n 1)
  echo -e "\n${YELLOW}Image size:${NC} $IMAGE_SIZE"
  
  # Push to registry if requested
  if [ "$PUSH_TO_REGISTRY" = true ] && [ -n "$REGISTRY" ]; then
    echo -e "\n${GREEN}Pushing images to registry...${NC}"
    docker push "${REGISTRY}${IMAGE_NAME}:latest${TAG_SUFFIX}"
    docker push "${REGISTRY}${IMAGE_NAME}:${VERSION}${TAG_SUFFIX}"
    docker push "${REGISTRY}${IMAGE_NAME}:${VERSION}-${COMMIT_HASH}${TAG_SUFFIX}"
    echo -e "${GREEN}Push complete!${NC}"
  fi
else
  echo -e "${RED}Build failed!${NC}"
  exit 1
fi
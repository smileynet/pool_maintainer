#\!/bin/bash

echo "🔍 Verifying Docker deployment..."
echo

# Test 1: Basic connectivity
echo "✅ Test 1: Basic connectivity"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 | grep -q "200"; then
    echo "   ✅ Server responds with 200 OK"
else
    echo "   ❌ Server not responding properly"
fi

# Test 2: Check HTML content
echo
echo "✅ Test 2: HTML content"
HTML_CONTENT=$(curl -s http://localhost:8080)
if echo "$HTML_CONTENT" | grep -q "Pool Maintenance System"; then
    echo "   ✅ Title found in HTML"
else
    echo "   ❌ Title not found"
fi

# Test 3: Check JavaScript bundle
echo
echo "✅ Test 3: JavaScript assets"
JS_SIZE=$(curl -s http://localhost:8080/assets/index-C089Ibch.js | wc -c)
if [ "$JS_SIZE" -gt 0 ]; then
    echo "   ✅ Main JS bundle accessible ($(($JS_SIZE / 1024)) KB)"
else
    echo "   ❌ Main JS bundle not found"
fi

# Test 4: Check CSS
echo
echo "✅ Test 4: CSS assets"
CSS_SIZE=$(curl -s http://localhost:8080/assets/index-kBm_BCiC.css | wc -c)
if [ "$CSS_SIZE" -gt 0 ]; then
    echo "   ✅ Main CSS accessible ($(($CSS_SIZE / 1024)) KB)"
else
    echo "   ❌ Main CSS not found"
fi

# Test 5: Check gzip compression
echo
echo "✅ Test 5: Gzip compression"
ENCODING=$(curl -sI -H "Accept-Encoding: gzip" http://localhost:8080 | grep -i "content-encoding")
if echo "$ENCODING" | grep -q "gzip"; then
    echo "   ✅ Gzip compression enabled"
else
    echo "   ❌ Gzip compression not working"
fi

# Test 6: Check cache headers
echo
echo "✅ Test 6: Cache headers"
CACHE_CONTROL=$(curl -sI http://localhost:8080/assets/index-C089Ibch.js | grep -i "cache-control")
if echo "$CACHE_CONTROL" | grep -q "public"; then
    echo "   ✅ Asset caching configured"
else
    echo "   ❌ Asset caching not configured"
fi

# Test 7: Health check
echo
echo "✅ Test 7: Health check endpoint"
HEALTH=$(curl -s http://localhost:8080/health)
if [ "$HEALTH" = "healthy" ]; then
    echo "   ✅ Health check working"
else
    echo "   ❌ Health check failed"
fi

# Test 8: SPA routing
echo
echo "✅ Test 8: SPA fallback routing"
SPA_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/non-existent-route)
if [ "$SPA_TEST" = "200" ]; then
    echo "   ✅ SPA fallback working"
else
    echo "   ❌ SPA fallback not working"
fi

echo
echo "🎉 Docker verification complete\!"

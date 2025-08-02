#!/bin/bash

# Visual Regression Testing Script for Pool Maintenance System
# Runs comprehensive visual tests for the default styling system

set -e

echo "🎨 Pool Maintenance System - Visual Regression Testing"
echo "======================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if dependencies are installed
check_dependencies() {
    log_info "Checking dependencies..."
    
    if ! command -v bun &> /dev/null; then
        log_error "Bun is not installed. Please install Bun first."
        exit 1
    fi
    
    if ! command -v npx &> /dev/null; then
        log_error "NPX is not installed. Please install Node.js and npm first."
        exit 1
    fi
    
    log_success "Dependencies check passed"
}

# Install Playwright browsers if needed
install_browsers() {
    log_info "Installing Playwright browsers..."
    npx playwright install chromium firefox webkit
    log_success "Playwright browsers installed"
}

# Start Storybook server
start_storybook() {
    log_info "Starting Storybook server..."
    
    # Check if Storybook is already running
    if curl -s http://localhost:6080 > /dev/null 2>&1; then
        log_warning "Storybook is already running on port 6080"
        return 0
    fi
    
    # Start Storybook in background
    bun run storybook &
    STORYBOOK_PID=$!
    
    # Wait for Storybook to be ready
    log_info "Waiting for Storybook to be ready..."
    for i in {1..60}; do
        if curl -s http://localhost:6080 > /dev/null 2>&1; then
            log_success "Storybook is ready"
            return 0
        fi
        sleep 2
    done
    
    log_error "Storybook failed to start within 120 seconds"
    exit 1
}

# Stop Storybook server
stop_storybook() {
    if [ ! -z "$STORYBOOK_PID" ]; then
        log_info "Stopping Storybook server..."
        kill $STORYBOOK_PID 2>/dev/null || true
        log_success "Storybook server stopped"
    fi
}

# Cleanup function
cleanup() {
    stop_storybook
}

# Set trap for cleanup
trap cleanup EXIT

# Run visual regression tests
run_visual_tests() {
    log_info "Running visual regression tests..."
    
    # Test modes
    TEST_MODE=${1:-"all"}
    
    case $TEST_MODE in
        "baseline")
            log_info "Running baseline generation..."
            npx playwright test --config=playwright-visual.config.ts --update-snapshots
            ;;
        "compare")
            log_info "Running visual comparison tests..."
            npx playwright test --config=playwright-visual.config.ts
            ;;
        "enhanced")
            log_info "Running enhanced components visual tests..."
            npx playwright test tests/visual/enhanced-components.spec.ts --config=playwright-visual.config.ts
            ;;
        "all")
            log_info "Running all visual regression tests..."
            npx playwright test --config=playwright-visual.config.ts
            ;;
        *)
            log_error "Invalid test mode: $TEST_MODE"
            echo "Available modes: baseline, compare, enhanced, all"
            exit 1
            ;;
    esac
}

# Generate visual report
generate_report() {
    log_info "Generating visual regression report..."
    
    if [ -d "playwright-visual-report" ]; then
        log_success "Visual regression report generated"
        log_info "Report location: playwright-visual-report/index.html"
        
        # Try to open report in browser (macOS/Linux)
        if command -v open &> /dev/null; then
            open playwright-visual-report/index.html
        elif command -v xdg-open &> /dev/null; then
            xdg-open playwright-visual-report/index.html
        else
            log_info "To view the report, open: playwright-visual-report/index.html"
        fi
    else
        log_warning "No visual regression report found"
    fi
}

# Main execution
main() {
    echo ""
    log_info "Starting visual regression testing pipeline..."
    
    # Parse command line arguments
    TEST_MODE=${1:-"all"}
    SKIP_DEPS=${2:-"false"}
    
    # Check dependencies
    if [ "$SKIP_DEPS" != "true" ]; then
        check_dependencies
        install_browsers
    fi
    
    # Start Storybook
    start_storybook
    
    # Run tests
    run_visual_tests "$TEST_MODE"
    
    # Generate report
    generate_report
    
    echo ""
    log_success "Visual regression testing completed!"
    echo ""
    echo "📊 Test Results Summary:"
    echo "  • Report: playwright-visual-report/index.html"
    echo "  • Screenshots: tests/visual/*.spec.ts-snapshots/"
    echo "  • Configuration: playwright-visual.config.ts"
    echo ""
    echo "🔄 Next Steps:"
    echo "  • Review visual differences in the report"
    echo "  • Update baselines if changes are intentional: ./scripts/run-visual-tests.sh baseline"
    echo "  • Fix styling issues if differences are unintentional"
    echo ""
}

# Show help
show_help() {
    echo "Visual Regression Testing Script"
    echo ""
    echo "Usage: $0 [mode] [skip-deps]"
    echo ""
    echo "Modes:"
    echo "  all        Run all visual regression tests (default)"
    echo "  baseline   Generate new baseline screenshots"
    echo "  compare    Run comparison tests against existing baselines"
    echo "  enhanced   Run only enhanced components tests"
    echo ""
    echo "Options:"
    echo "  skip-deps  Skip dependency installation (pass 'true')"
    echo ""
    echo "Examples:"
    echo "  $0                           # Run all tests"
    echo "  $0 baseline                  # Generate new baselines"
    echo "  $0 enhanced                  # Test enhanced components only"
    echo "  $0 all true                  # Run all tests, skip dependency check"
    echo ""
}

# Check for help flag
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    show_help
    exit 0
fi

# Run main function
main "$@"
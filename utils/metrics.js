/**
 * Metrics Collection
 */
'use strict'

class MetricsCollector {
    constructor() {
        this.metrics = {
            totalRequests: 0,
            successCount: 0,
            errorCount: 0,
            startTime: Date.now()
        }
    }
    
    incrementRequest() { this.metrics.totalRequests++ }
    recordSuccess() { this.metrics.successCount++ }
    recordError() { this.metrics.errorCount++ }
    
    getMetrics() {
        return {
            ...this.metrics,
            uptime: Math.floor((Date.now() - this.metrics.startTime) / 1000)
        }
    }
}

module.exports = new MetricsCollector()

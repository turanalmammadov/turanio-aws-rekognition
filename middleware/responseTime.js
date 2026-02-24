'use strict';

/**
 * Middleware that records request processing time and adds it as
 * an X-Response-Time header (in milliseconds) on every response.
 *
 * Usage:
 *   app.use(require('./middleware/responseTime'));
 */
function responseTimeMiddleware(req, res, next) {
  const startAt = process.hrtime.bigint();

  res.on('finish', () => {
    const durationNs = process.hrtime.bigint() - startAt;
    const durationMs = Number(durationNs) / 1e6;
    // header may already be sent for streaming; ignore errors
    try {
      res.setHeader('X-Response-Time', `${durationMs.toFixed(3)}ms`);
    } catch (_) {
      // noop
    }
  });

  next();
}

module.exports = responseTimeMiddleware;

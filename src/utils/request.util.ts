import { Request } from 'express';

export class RequestUtil {
  static getIpAddress(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    return req.socket.remoteAddress || 'unknown';
  }

  static getUserAgent(req: Request): string {
    return req.headers['user-agent'] || 'unknown';
  }

  static getDeviceInfo(req: Request): string {
    const userAgent = this.getUserAgent(req);
    const platform = req.headers['sec-ch-ua-platform'] || 'unknown';
    return JSON.stringify({
      userAgent,
      platform,
      language: req.headers['accept-language']?.split(',')[0] || 'unknown',
    });
  }
}

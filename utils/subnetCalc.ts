
import { SubnetQuestion } from '../types';

function ipToLong(ip: string): number {
  return ip.split('.').reduce((long, octet) => (long << 8) + parseInt(octet, 10), 0) >>> 0;
}

function longToIp(long: number): string {
  return [
    (long >>> 24) & 0xff,
    (long >>> 16) & 0xff,
    (long >>> 8) & 0xff,
    long & 0xff,
  ].join('.');
}

export function generateQuestion(difficulty: string): SubnetQuestion {
  let firstOctet = 0;
  let cidr = 0;

  // Weighted randomness based on difficulty
  const rand = Math.random();
  
  if (difficulty === 'Beginner') {
    // Class C focus
    firstOctet = 192 + Math.floor(Math.random() * 31); // 192-223
    cidr = 24 + Math.floor(Math.random() * 7); // 24-30
  } else if (difficulty === 'Professional') {
    // Class B focus, some C
    if (rand > 0.3) {
      firstOctet = 128 + Math.floor(Math.random() * 63); // 128-191
      cidr = 16 + Math.floor(Math.random() * 15); // 16-30
    } else {
      firstOctet = 192 + Math.floor(Math.random() * 31);
      cidr = 24 + Math.floor(Math.random() * 7);
    }
  } else {
    // Class A/B focus
    if (rand > 0.5) {
      firstOctet = 1 + Math.floor(Math.random() * 125); // 1-126
      cidr = 8 + Math.floor(Math.random() * 23); // 8-30
    } else {
      firstOctet = 128 + Math.floor(Math.random() * 63);
      cidr = 16 + Math.floor(Math.random() * 15);
    }
  }

  const ipBase = `${firstOctet}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  const ipLong = ipToLong(ipBase);
  const maskLong = (0xffffffff << (32 - cidr)) >>> 0;
  
  const subnetIdLong = (ipLong & maskLong) >>> 0;
  const broadcastLong = (subnetIdLong | (~maskLong)) >>> 0;
  
  const firstHostLong = (subnetIdLong + 1) >>> 0;
  const lastHostLong = (broadcastLong - 1) >>> 0;
  
  const classType = firstOctet < 128 ? 'A' : (firstOctet < 192 ? 'B' : 'C');

  return {
    ip: ipBase,
    cidr,
    mask: longToIp(maskLong),
    subnetId: longToIp(subnetIdLong),
    firstHost: firstHostLong > lastHostLong ? 'N/A' : longToIp(firstHostLong),
    lastHost: firstHostLong > lastHostLong ? 'N/A' : longToIp(lastHostLong),
    broadcast: longToIp(broadcastLong),
    wildcard: longToIp(~maskLong >>> 0),
    classType
  };
}


import { SummaryQuestion } from '../types';

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

export function generateSummaryQuestion(): SummaryQuestion {
  const classes = [
    { base: '10.', start: [0, 255], cidr: 24, count: 4 },
    { base: '172.16.', start: [0, 240], cidr: 24, count: 4 },
    { base: '192.168.', start: [0, 240], cidr: 24, count: 4 },
    { base: '172.16.', start: [0, 128], cidr: 20, count: 4 },
  ];

  const template = classes[Math.floor(Math.random() * classes.length)];
  const secondToLastOctet = Math.floor(Math.random() * (template.start[1] - template.start[0])) + template.start[0];
  
  // Align to a power of 2 for a "clean" summary usually
  const align = 4;
  const startOctet = Math.floor(secondToLastOctet / align) * align;
  
  const networks: string[] = [];
  for (let i = 0; i < align; i++) {
    networks.push(`${template.base}${startOctet + i}.0/${template.cidr}`);
  }

  // Calculate correct summary
  // 4 networks of /24 summarized is usually /22
  const summaryCidr = template.cidr - Math.log2(align);
  const correctAnswer = `${template.base}${startOctet}.0/${summaryCidr}`;

  // Generate distractors
  const options = [correctAnswer];
  
  // Distractor 1: Wrong CIDR
  options.push(`${template.base}${startOctet}.0/${summaryCidr + 1}`);
  // Distractor 2: Wrong Base
  options.push(`${template.base}${Math.max(0, startOctet - align)}.0/${summaryCidr}`);
  // Distractor 3: Too broad
  options.push(`${template.base}${startOctet}.0/${summaryCidr - 1}`);

  // Shuffle options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  const explanation = `To summarize these networks, find the common bits. Since all networks share the first two octets and differ only in the third, we look at ${startOctet} through ${startOctet + align - 1}. In binary, these share the first ${summaryCidr} bits. The resulting summary is ${correctAnswer}.`;

  return {
    networks,
    options,
    correctAnswer,
    explanation
  };
}

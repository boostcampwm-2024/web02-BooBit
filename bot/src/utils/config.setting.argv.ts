import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export async function getArgs() {
  return await yargs(hideBin(process.argv))
    .option('client', {
      alias: 'c',
      default: false,
      description: 'client로 실행',
    })
    .option('cpi', {
      type: 'number',
      description: 'check price interval (ms)',
    })
    .option('ai', {
      type: 'number',
      description: 'action interval (ms)',
    })
    .option('at', {
      type: 'string',
      description: 'action type',
    })
    .option('minp', {
      type: 'number',
      description: 'min percent',
    })
    .option('maxp', {
      type: 'number',
      description: 'max percent',
    })
    .option('mina', {
      type: 'number',
      description: 'min amount',
    })
    .option('maxa', {
      type: 'number',
      description: 'max amount',
    })
    .option('count', {
      type: 'number',
      description: 'count',
    })
    .parse();
}

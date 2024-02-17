import { isValidObjectId } from '@/lib/utils';
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismadb = globalThis.prisma || new PrismaClient();

prismadb.$use(async (params, next) => {
  // console.log(params.action === '');
  if (params.action.includes('find')) {
    const where = params.args.where;
    const whereKeys = Object.keys(where);
    for (let prop of whereKeys) {
      if ((prop === 'id' || prop.endsWith('Id')) && prop !== 'userId') {
        if (!isValidObjectId(where[prop])) return null;
      }
    }
  }
  // if (!isValidObjectId(params.args.where.storeId)) return null;
  const result = await next(params);
  return result;
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prismadb;
}

export default prismadb;

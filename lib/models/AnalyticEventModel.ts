
import { PrismaClient} from '@prisma/client'

import { Searcher, CachePolicy, ISearcher } from 'ts-ip2region';


const ipLookup = async (ip: string) => {
    const dbPath = '../thirdparties/ip2region/ip2region.xdb'; 
    const searcher: ISearcher = new Searcher(CachePolicy.Content, dbPath);
    const regionInfo = await searcher.search(ip);
    console.log(`IP: ${ip}, Region: ${regionInfo}`);
    await searcher.close();
}

const prisma = new PrismaClient()


// make a type enum
export enum AnalyticEventType {
  LINK_VISITED = 'LINK_VISITED',
}
import { checkBlacklist } from "../..//queries/blacklist-query";
import { pool } from '../../connection/bd';
import { ResultSetHeader } from 'mysql2';

const promisePool = pool.promise();

class Blacklist {
    blockType:string;
    scoreThreshold:number;
    cacheTTLMs :number;
    cache:any;


    constructor(blockType = 'IP', scoreThreshold = 50,cacheTTLMs= 5000 ) {
        this.blockType = blockType;
        this.scoreThreshold = scoreThreshold;
        this.cacheTTLMs=cacheTTLMs;
        this.cache = new Map()
    }
    getCacheEntry(value:any) {
        const entry = this.cache.get(value);
        if (entry && (Date.now() - entry.timestamp) < this.cacheTTLMs) {
            return entry; // Cache Válido
        }
        this.cache.delete(value); // Cache Expirado
        return null;
    }
    setCacheEntry(value:any, isBlocked:string, score:number) {
        this.cache.set(value, {
            isBlocked,
            score,
            timestamp: Date.now()
        });
    }
    async isPermanentlyBlacklisted(value:any) {
        const cached = this.getCacheEntry(value);
        if (cached) {
            console.log(`[Cache] ✅ Acierto de Caché para Blacklist: ${value}`);
            // Si el cache dice que está bloqueada, retornamos el objeto de bloqueo, si no, null.
            return cached.isBlocked ? { reason: 'Cache Hit' } : null; 
        }

        const queryExistBlackList = checkBlacklist();
    const [rows]: [any[], any] = await promisePool.query(queryExistBlackList, [
      value,
      this.blockType
    ]);

    if (rows.length > 0) {
      throw new Error('Ya existe ese restaurante en nuestra bbdd');
    }

    return rows.length;
        
        // // Falla de caché, consultar la DB
        // const resultCheckBlackList = 
        
        // // Guardar resultado en caché
        // this.setCacheEntry(value, !!resultCheckBlackList, 0); 
        // return resultCheckBlackList;
    }

 

}

module.exports = Blacklist;
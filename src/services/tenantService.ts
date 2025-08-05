import { Repository } from 'typeorm';
import { ITenant } from '../types.ts';
import { Tenant } from '../entity/Tenants.js';

export class TenanatService {
    constructor(private tenantRepository: Repository<Tenant>) {}
    async create(tenantData: ITenant) {
        return await this.tenantRepository.save(tenantData);
    }
}

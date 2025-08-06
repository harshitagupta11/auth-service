import { Repository } from 'typeorm';
import { ITenant } from '../types.ts';
import { Tenant } from '../entity/Tenants.js';

export class TenanatService {
    constructor(private tenantRepository: Repository<Tenant>) {}
    async create(tenantData: ITenant) {
        return await this.tenantRepository.save(tenantData);
    }

    async update(tenantId: number, tenantData: ITenant) {
        return await this.tenantRepository.update(tenantId, tenantData);
    }
    async getAll() {
        return await this.tenantRepository.find();
    }
    async getById(tenantId: number) {
        return await this.tenantRepository.find({ where: { id: tenantId } });
    }

    async deleteById(tenantId: number) {
        return await this.tenantRepository.delete(tenantId);
    }
}

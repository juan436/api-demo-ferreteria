/**
 * Ferretería - Gestión de Pedidos
 * Copyright (c) 2025 Juan Villegas <juancvillefer@gmail.com>
 * MIT Licensed
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Provider, ProviderDocument } from './schemas/provider.schema';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectModel(Provider.name) private providerModel: Model<ProviderDocument>,
  ) {}

  async create(createProviderDto: CreateProviderDto): Promise<Provider> {
    const createdProvider = new this.providerModel(createProviderDto);
    return createdProvider.save();
  }

  async findAll(): Promise<Provider[]> {
    return this.providerModel.find().exec();
  }

  async findOne(id: string): Promise<Provider> {
    const provider = await this.providerModel.findById(id).exec();
    if (!provider) {
      throw new NotFoundException(`Provider with ID ${id} not found`);
    }
    return provider;
  }

  async findByBranch(branchId: string): Promise<Provider[]> {
    return this.providerModel
      .find({ 'branch._id': branchId })
      .exec();
  }

  async search(query: string): Promise<Provider[]> {
    return this.providerModel
      .find({
        name: { $regex: query, $options: 'i' },
      })
      .exec();
  }

  async update(id: string, updateProviderDto: UpdateProviderDto): Promise<Provider> {
    const updatedProvider = await this.providerModel
      .findByIdAndUpdate(id, updateProviderDto, { new: true })
      .exec();

    if (!updatedProvider) {
      throw new NotFoundException(`Provider with ID ${id} not found`);
    }
    return updatedProvider;
  }

  async remove(id: string): Promise<void> {
    const result = await this.providerModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Provider with ID ${id} not found`);
    }
  }
}

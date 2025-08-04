import { Photographer } from "@/core/entities/photographer";

export interface PhotographerRepository {
  findById(id: string): Promise<Photographer | null>;
}
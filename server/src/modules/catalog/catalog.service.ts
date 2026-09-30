import { CatalogRepository } from './catalog.repository';

export class CatalogService {
  constructor(private catalogRepo: CatalogRepository = new CatalogRepository()) {}

  public async getHubMetadata() {
    const [domains, categories, targets, chips, universities, testimonials] = await Promise.all([
      this.catalogRepo.getDomains(),
      this.catalogRepo.getCategories(),
      this.catalogRepo.getTargetOptions(),
      this.catalogRepo.getHeroChips(),
      this.catalogRepo.getPartnerUniversities(),
      this.catalogRepo.getTestimonials(),
    ]);

    return {
      domains,
      categories,
      targets: targets.map((t) => t.label),
      heroChips: chips,
      universities,
      testimonials,
    };
  }

  public async getCategories(domainCode?: string) {
    return this.catalogRepo.getCategories(domainCode);
  }

  public async getTargetOptions() {
    return this.catalogRepo.getTargetOptions();
  }

  public async getUniversities() {
    return this.catalogRepo.getPartnerUniversities();
  }
}

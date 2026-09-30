import { Database } from '../../db/database';
import {
  CertificateDomainEntity,
  ExamCategoryEntity,
  TargetOptionEntity,
  HeroQuickSearchChipEntity,
  PartnerUniversityEntity,
  StudentTestimonialEntity,
} from '../../shared/types';

export class CatalogRepository {
  private db = Database.getInstance();

  public async getDomains(): Promise<CertificateDomainEntity[]> {
    return Array.from(this.db.certificate_domains.values()).sort((a, b) => a.display_order - b.display_order);
  }

  public async getCategories(domainCode?: string): Promise<ExamCategoryEntity[]> {
    let list = Array.from(this.db.exam_categories.values()).filter((c) => c.is_active);
    if (domainCode && domainCode !== 'all') {
      list = list.filter((c) => c.domain_code === domainCode);
    }
    return list.sort((a, b) => a.display_order - b.display_order);
  }

  public async getTargetOptions(): Promise<TargetOptionEntity[]> {
    return Array.from(this.db.target_options.values())
      .filter((t) => t.is_active)
      .sort((a, b) => a.display_order - b.display_order);
  }

  public async getHeroChips(): Promise<HeroQuickSearchChipEntity[]> {
    return Array.from(this.db.hero_quick_search_chips.values())
      .filter((c) => c.is_active)
      .sort((a, b) => a.display_order - b.display_order);
  }

  public async getPartnerUniversities(): Promise<PartnerUniversityEntity[]> {
    return Array.from(this.db.partner_universities.values())
      .filter((u) => u.is_active)
      .sort((a, b) => a.display_order - b.display_order);
  }

  public async getTestimonials(): Promise<StudentTestimonialEntity[]> {
    return Array.from(this.db.student_testimonials.values())
      .filter((t) => t.is_featured)
      .sort((a, b) => a.display_order - b.display_order);
  }
}

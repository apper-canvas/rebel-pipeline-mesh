import companiesData from "@/services/mockData/companies.json";

class CompanyService {
  constructor() {
    this.companies = [...companiesData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.companies];
  }

  async getById(id) {
    await this.delay(200);
    const company = this.companies.find(c => c.Id === id);
    if (!company) {
      throw new Error("Company not found");
    }
    return { ...company };
  }

  async create(companyData) {
    await this.delay(400);
    const newId = Math.max(...this.companies.map(c => c.Id), 0) + 1;
    const newCompany = {
      Id: newId,
      ...companyData,
      createdAt: new Date().toISOString()
    };
    this.companies.push(newCompany);
    return { ...newCompany };
  }

  async update(id, companyData) {
    await this.delay(400);
    const index = this.companies.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Company not found");
    }
    const updatedCompany = {
      ...this.companies[index],
      ...companyData,
      Id: id
    };
    this.companies[index] = updatedCompany;
    return { ...updatedCompany };
  }

  async delete(id) {
    await this.delay(300);
    const index = this.companies.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Company not found");
    }
    this.companies.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const companyService = new CompanyService();